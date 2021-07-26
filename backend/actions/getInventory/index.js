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

  // Get current inventory database with email
  const result = await service
    .getDocument({
      db: "users",
      docId: email,
    })
    .catch((err) => {
      return false;
    });

  if (!result) {
    return {
      message: "failed",
      failed: true,
    };
  }

  //Return inventory
  return {
    inventory: result.result.inventory,
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
