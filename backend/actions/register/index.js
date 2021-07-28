require("dotenv").config({ path: "../.env" });

//Service is defined outside in case function is triggered quickly
//and database has been setup already
let service;

//Setup users with a testInventory so they get the feel of the application
const testInventory = [
  {
    category: "dairy",
    expiry_date: null,
    days_to_expiry: 5,
    frozen: false,
    item_class: "milk",
    name: "Dairy Farmers Milk 2l",
    emoji: "🐮",
    price: 3.5,
    purchase_date: new Date(),
    quantity: 1,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "meats",
    expiry_date: null,
    days_to_expiry: 3,
    frozen: false,
    emoji: "🐔",
    item_class: "chicken",
    name: "Chicken tenders",
    price: 3,
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
    item_class: "rice",
    emoji: "🍚",
    name: "Sunrice White Rice 1kg",
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
    item_class: "lemonade",
    name: "Schweppes Lemonade 1.1l",
    price: 1,
    purchase_date: new Date(),
    quantity: 2,
    remove_date: null,
    status: "uneaten",
  },
  {
    category: "vegetables",
    expiry_date: null,
    days_to_expiry: 5,
    emoji: "🍅",
    frozen: false,
    item_class: "tomato",
    name: "Fresh Tomato",
    price: 0.54,
    purchase_date: new Date(),
    quantity: 4,
    remove_date: null,
    status: "uneaten",
  },
];

async function main(params) {
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");

  const secret = process.env.JWT_SECRET;

  //Set up database if service is not defined
  if (!service) {
    service = await setupDb();
  }
  //Check that name email and password have been supplied
  if (!params.name || !params.email || !params.password) {
    return {
      error: "payload must have email, password and name",
      failed: true,
    };
  }

  //Hash password to store in DB
  const hashedPassword = bcrypt.hashSync(params.password, 8);

  const userDoc = {
    createdAt: new Date(),
    name: params.name,
    email: params.email,
    password: hashedPassword,
    _id: params.email,
    inventory: testInventory,
  };

  //Create user document and check if email is unique (since it is the docId)
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

  //Create a JWT and sign it
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

global.main = main;
