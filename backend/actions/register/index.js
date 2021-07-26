require("dotenv").config({ path: "../.env" });
let service;

const testInventory = [
  {
    category: "dairy",
    expiry_date: null,
    days_to_expiry: 5,
    frozen: false,
    item_class: null,
    name: "Milk",
    emoji: "🐮",
    price: 3,
    purchase_date: new Date(),
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "meats",
    expiry_date: null,
    days_to_expiry: 3,
    frozen: false,
    emoji: "🥩",
    item_class: null,
    name: "Chicken tenders",
    price: 10,
    purchase_date: new Date(),
    quantity: 5,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "grains",
    expiry_date: null,
    days_to_expiry: 10,
    frozen: false,
    item_class: null,
    emoji: "🌾",
    name: "Bread",
    price: 2,
    purchase_date: new Date(),
    quantity: 3,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "beverages",
    expiry_date: null,
    days_to_expiry: 20,
    emoji: "🥤",
    frozen: false,
    item_class: null,
    name: "Coca-cola",
    price: 1,
    purchase_date: new Date(),
    quantity: 10,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "vegetables",
    expiry_date: null,
    days_to_expiry: 5,
    emoji: "🍅",
    frozen: false,
    item_class: null,
    name: "Tomato",
    price: 2,
    purchase_date: new Date(),
    quantity: 4,
    remove_date: null,
    status: "uneaten",
  },
];

async function main(params) {
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  console.log("Service", !service);

  const secret = process.env.JWT_SECRET;

  if (!service) {
    service = await setupDb();
  }

  if (!params.name || !params.email || !params.password) {
    return {
      error: "payload must have email, password and name",
      failed: true,
    };
  }
  const hashedPassword = bcrypt.hashSync(params.password, 8);

  const userDoc = {
    createdAt: new Date(),
    name: params.name,
    email: params.email,
    password: hashedPassword,
    _id: params.email,
    inventory: testInventory,
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
    apikey: process.env.CLOUDANT_APIKEY,
  });

  const service = new CloudantV1({
    authenticator: authenticator,
  });

  service.setServiceUrl(process.env.CLOUDANT_SERVICE_URL);
  return service;
}

// main({
//   name: "Apurva",
//   email: "test@test5.com",
//   password: "yolo",
// });

global.main = main;
