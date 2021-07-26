require("dotenv").config({ path: "../.env" });

//Service is defined outside in case function is triggered quickly
//and database has been setup already
let service;

async function main(params) {
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");

  const secret = process.env.JWT_SECRET;

  //Set up database if service is not defined
  if (!service) {
    service = await setupDb();
  }
  //Check for required parameters
  if (!params.email || !params.password) {
    return {
      message: "payload must have email and password",
      failed: true,
    };
  }

  //Get user from database
  const result = await service
    .getDocument({
      db: "users",
      docId: params.email,
    })
    .catch((err) => {
      return false;
    });

  //Error handle if user does not exist
  if (!result) {
    return {
      message: "username or password is incorrect",
      failed: true,
    };
  }

  //Check if password correct
  const correct = bcrypt.compareSync(params.password, result.result.password);

  //Error handle if password is incorrect
  if (!correct) {
    return {
      error: "username or password is incorrect",
      failed: true,
    };
  }

  //return jwt
  var token = jwt.sign(
    { email: result.result.email, name: result.result.name },
    secret,
    {
      expiresIn: "1h",
    }
  );

  return {
    message: `user ${result.result.name} logged in`,
    token: token,
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
