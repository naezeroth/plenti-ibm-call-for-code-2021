let service;
const secret = "C.a~9J?w>pfh&?ke94|4Mcs2;2Jl!F";

async function main(params) {
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  console.log("Service", !service);
  if (!service) {
    service = await setupDb();
  }

  if (!params.email || !params.password) {
    return {
      error: "payload must have email and password",
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
    return returnError();
  }

  // //Check if pw correct
  const correct = bcrypt.compareSync(params.password, result.result.password);

  if (!correct) {
    console.log("pw incorrect");
    return returnError();
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

function returnError() {
  return {
    error: "username or password is incorrect",
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

main({
  email: "test@test.com",
  password: "yolo",
});

global.main = main;
