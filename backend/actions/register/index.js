let service;
const secret = "C.a~9J?w>pfh&?ke94|4Mcs2;2Jl!F";

async function main(params) {
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  console.log("Service", !service);
  if (!service) {
    service = await setupDb();
  }

  if (!params.name || !params.email || !params.password) {
    return {
      error: "payload must have email, password and name",
    };
  }
  const hashedPassword = bcrypt.hashSync(params.password, 8);

  const userDoc = {
    createdAt: new Date(),
    name: params.name,
    email: params.email,
    password: hashedPassword,
    _id: params.email,
  };

  const result = await service
    .putDocument({
      db: "users",
      docId: params.email,
      document: userDoc,
    })
    .catch((error) => {
      console.log("Error", error);
      return false;
    });

  if (!result) {
    return {
      error: "email already exists",
    };
  }

  console.log("Result", result);

  var token = jwt.sign({ email: params.email, name: params.name }, secret, {
    expiresIn: "1h",
  });

  return {
    message: `user ${params.name} successfully created`,
    token: token,
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

// main({
//   name: "Apurva",
//   email: "test@test.com",
//   password: "yolo",
// });

global.main = main;
