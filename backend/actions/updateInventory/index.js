require("dotenv").config({ path: "../.env" });

//Service is defined outside in case function is triggered quickly
//and database has been setup already
let service;

async function main(params) {
  const jwt = require("jsonwebtoken");

  const secret = process.env.JWT_SECRET;

  //Set up database if service is not defined
  if (!service) {
    service = await setupDb();
  }
  //Check for JWT and validate
  //TODO change this to a header instead of a parameter
  if (!params.token) {
    return {
      message: "Please supply JWT",
      failed: true,
    };
  }
  try {
    var decoded = jwt.verify(params.token, secret);
  } catch {
    return {
      message: "JWT validation failed",
      failed: true,
    };
  }
  const email = decoded.email;

  //Check that inventory is supplied
  if (!JSON.parse(params.__ow_body).inventory) {
    return {
      message: "Must supply inventory in body",
      failed: true,
    };
  }

  const inventory = JSON.parse(params.__ow_body).inventory;

  // Get current inventory database with email
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

  //Update local document variable
  document.result.inventory = inventory;

  //Update database of user with the new document
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
