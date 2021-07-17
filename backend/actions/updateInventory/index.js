let service;
const secret = "C.a~9J?w>pfh&?ke94|4Mcs2;2Jl!F";

async function main(params) {
  const jwt = require("jsonwebtoken");
  console.log("Service", !service);

  if (!service) {
    service = await setupDb();
  }
  if (!params.token) {
    return {
      message: "Please supply JWT",
      failed: true,
    };
  }
  if (!JSON.parse(params.__ow_body).inventory) {
    return {
      message: "Must supply inventory in body",
      failed: true,
    };
  }

  const inventory = JSON.parse(params.__ow_body).inventory;
  console.log("New inventory is", inventory);
  try {
    var decoded = jwt.verify(params.token, secret);
  } catch {
    return {
      message: "JWT validation failed",
      failed: true,
    };
  }

  const email = decoded.email;

  // update inventory db with email

  const document = await service
    .getDocument({ db: "users", docId: email })
    .catch((err) => {
      console.log(err);
      return false;
    });

  if (!document) {
    return {
      message: "Something went wrong getting user information",
      failed: true,
    };
  }

  let result = document.result;

  // console.log("Result from databse is", result);

  document.result.inventory = inventory;

  let update = await service
    .putDocument({ db: "users", document: document.result, docId: email })
    .catch((err) => {
      console.log("Something went wrong updating database with inventory", err);
      return false;
    });
  if (!update) {
    return {
      message: "something went wrong updating database with inventory",
      failed: true,
    };
  }
  console.log("Updated database: ", update);

  return {
    message: "updated database successfully",
    update: update,
  };
}

async function setupDb() {
  const { CloudantV1 } = require("@ibm-cloud/cloudant");
  const { IamAuthenticator } = require("ibm-cloud-sdk-core");

  const authenticator = new IamAuthenticator({
    apikey: "0ClBVmSnAKdOKuOt_69fQ5j9aWiT3n4t2DzkyV-WZHl7",
  });

  const service = new CloudantV1({
    authenticator: authenticator,
  });

  service.setServiceUrl(
    "https://a859431b-1431-4549-9712-4dd14785f393-bluemix.cloudantnosqldb.appdomain.cloud"
  );
  return service;
}

global.main = main;
