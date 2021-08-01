require("dotenv").config({ path: "../.env" });

const NaturalLanguageClassifierV1 = require("watson-developer-cloud/natural-language-classifier/v1");

async function main(params) {
  const jwt = require("jsonwebtoken");

  const secret = process.env.JWT_SECRET;

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

  var naturalLanguageClassifier = new NaturalLanguageClassifierV1({
    url: process.env.WATSON_NLP_URL,
    iam_apikey: process.env.WATSON_IAM_API_KEY,
  });

  if (!JSON.parse(params.__ow_body).text) {
    return {
      message: "Must supply text as body",
      failed: true,
    };
  }

  const text = JSON.parse(params.__ow_body).text;

  const classifyParams = {
    text: text,
    classifier_id: process.env.WATSON_CLASSIFIER_ID,
  };

  const response = await naturalLanguageClassifier
    .classify(classifyParams)
    .then((response) => {
      console.log("RESPONSE:");
      console.log(response);
      const classification = response.result;

      console.log(classification);
      console.log(JSON.stringify(classification, null, 2));
      return response;
    })
    .catch((err) => {
      console.log("error:", err);
    });

  return response;
  // return {
  //   top_class: result.result.inventory,
  // };
}

global.main = main;
