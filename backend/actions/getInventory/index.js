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

  console.log("Jwt is", params.token);

  try {
    var decoded = jwt.verify(params.token, secret);
  } catch {
    return {
      message: "JWT validation failed",
      failed: true,
    };
  }
  const email = decoded.email;
  console.log("Decoded email", email, decoded);
  // update inventory db with email

  const result = await service
    .getDocument({
      db: "users",
      docId: email,
    })
    .catch((err) => {
      return false;
    });

  console.log("Result", result);

  if (!result) {
    return {
      message: "failed",
      failed: true,
    };
  }

  console.log("Result", result);

  return {
    inventory: result.result.inventory,
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
