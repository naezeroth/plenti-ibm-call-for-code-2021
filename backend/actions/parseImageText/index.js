// const { IamAuthenticator } = require('ibm-watson/auth');
const NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

async function main(params) {
  //get text from params.__body and check that it exists.
  //JSON.parse etc.

  if (!JSON.parse(params.__ow_body).text) {
    return {
      message: "Must supply text as body",
      failed: true,
    };
  }  

  const text = JSON.parse(params.__ow_body).text;

  var naturalLanguageClassifier = new NaturalLanguageClassifierV1({
    url: 'https://api.us-south.natural-language-classifier.watson.cloud.ibm.com/instances/badedd77-8003-48e6-943b-861ea34e66af',
    iam_apikey: 'n2Se7LEGkNIQsVt3AGiS6mhvP7A_heT_PbAcU_PYJJW3'
  });

  const default_item = {
    name: null,
    item_class: null,
    category: null,
    quantity: 1,
    price: null,
    purchase_date: new Date(),
    expiry_date: null,
    frozen: false,
    status: "uneaten",
    remove_date: null,
  };

  let inventory_list = [];

  let classify_list = [];

  for (const arr of text) {
    for (const line of arr) {
      const split_line = line.split(" ");
      if (line[0] == "“") {
        // Create a copy of the default item
        let new_item = JSON.parse(JSON.stringify(default_item));

        // Test if price is at the end of the product line
        let regex = /\d+\.\d{2}/;
        if (regex.test(split_line[split_line.length - 1])) {
          // Remove price from the line and preceding symbols
          new_item["name"] = split_line.slice(0, -1).join(" ").slice(2);
          new_item["price"] = parseFloat(split_line[split_line.length - 1]);
        } else {
          // Remove preceding symbols
          new_item["name"] = line.slice(2);
        }

        inventory_list.push(new_item);
        classify_list.push(new_item["name"])

      } else if (split_line[0] == "Qty") {
        // Update the quantity and price of the last added item
        inventory_list[inventory_list.length - 1].quantity = parseFloat(
          split_line[1].slice(0, -1)
        );
        inventory_list[inventory_list.length - 1].price = parseFloat(
          split_line[2].slice(1)
        );
      }
    }
  }

  const classifyParams = {
    collection: classify_list,
    classifier_id: 'b9a0dbx961-nlc-19',
  };


  const response = await naturalLanguageClassifier.classifyCollection(classifyParams)
    .then(response => {
      console.log("RESPONSE:")
      console.log(response)
      const classification = response.result;
      
      console.log(classification)
      console.log(JSON.stringify(classification, null, 2)); 
      return response;
    })
    .catch(err => {
      console.log('error:', err);
    });

  const collection = response.collection;
  
  if (collection.length != inventory_list.length)
  {
    console.log('error: classification results length does not match item list length')
  }

  for (let i=0; i<collection.length; i++)
  {
    inventory_list[i].item_class = collection[i].top_class;
  }

  return { inventory_list: inventory_list };
}

global.main = main;

