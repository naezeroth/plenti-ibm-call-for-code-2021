let service;

async function main(params)
{
  console.log("Service", !service);
  if (!service) {
    service = await setupDb();
  }

  // const userDoc = {
  //   createdAt: new Date(),
  //   name: params.name,
  //   email: params.email,
  //   password: hashedPassword,
  //   _id: params.email,
  // };

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
      message: "failed",
      failed: true,
    };
  }

  console.log("Result", result);

  return {
    inventory: result.result.inventory
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
