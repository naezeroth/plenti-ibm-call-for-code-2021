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
    apikey: process.env.CLOUDANT_APIKEY,
  });

  const service = new CloudantV1({
    authenticator: authenticator,
  });

  service.setServiceUrl(process.env.CLOUDANT_SERVICE_URL);
  return service;
}

global.main = main;
