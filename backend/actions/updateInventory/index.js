require("dotenv").config({ path: "../.env" });
let service;

async function main(params) {
  const jwt = require("jsonwebtoken");
  console.log("Service", !service);

  const secret = process.env.JWT_SECRET;

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

  return {
    message: "updated database successfully",
  };
}

async function setupDb() {
  const { CloudantV1 } = require("@ibm-cloud/cloudant");
  const { IamAuthenticator } = require("ibm-cloud-sdk-core");

  const authenticator = new IamAuthenticator({
    apikey: process.env.CLOUDANT_APIKEY,
  });

  const service = new CloudantV1({
    authenticator: authenticator,
  });

  service.setServiceUrl(process.env.CLOUDANT_SERVICE_URL);
  return service;
}

global.main = main;
