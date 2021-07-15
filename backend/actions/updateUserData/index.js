let service;
const secret = "C.a~9J?w>pfh&?ke94|4Mcs2;2Jl!F";

async function main(params) {

  const jwt = require("jsonwebtoken");
  console.log("Service", !service);
  if (!service) {
    service = await setupDb();
  }

  if (!params.name || !params.email || !params.password) {
    return {
      error: "payload must have email, password and name",
      failed: true,
    };
  }

  const userDoc = {
    createdAt: new Date(),
    name: params.name,
    email: params.email,
    password: hashedPassword,
    _id: params.email,
  };

  service
    .getDocument({
      db: "users",
      docId: params.email,
    })
    .then((docResult) => {
      // // using OrderDocument on getDocument result:
      // const document: OrderDocument = docResult.result;
      let document = docResult.result;

      console.log(document);

      // Update the document in the database
      service
        .postDocument({ db: exampleDbName, document: document })
        .then((res) => {
          // Keeping track with the revision number of the document object:
          document._rev = res.result.rev;
          console.log(
            'You have updated the document:\n' + JSON.stringify(document, null, 2)
          );
        });
    })
    .catch((err) => {
      if (err.code === 404) {
        console.log(
          'Cannot update document because either "' +
            exampleDbName +
            '" database or the "example" ' +
            'document was not found.'
        );
      }
    });








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
      message: "email already exists",
      failed: true,
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
