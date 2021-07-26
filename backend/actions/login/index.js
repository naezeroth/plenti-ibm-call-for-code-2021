require("dotenv").config({ path: "../.env" });
let service;

async function main(params) {
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  console.log("Service", !service);

  const secret = process.env.JWT_SECRET;

  if (!service) {
    service = await setupDb();
  }

  if (!params.email || !params.password) {
    return {
      message: "payload must have email and password",
      failed: true,
    };
  }

  //Get user from db
  const result = await service
    .getDocument({
      db: "users",
      docId: params.email,
    })
    .catch((err) => {
      return false;
    });

  console.log("Result", result);

  if (!result) {
    return {
      message: "username or password is incorrect",
      failed: true,
    };
  }

  // //Check if pw correct
  const correct = bcrypt.compareSync(params.password, result.result.password);

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

// main({
//   email: "test@test.com",
//   password: "yolo2",
// });

global.main = main;
