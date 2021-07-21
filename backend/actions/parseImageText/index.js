function main(params) {
  //get text from params.__body and check that it exists.
  //JSON.parse etc.
  if (!JSON.parse(params.__ow_body).text) {
    return {
      message: "Must supply text as body",
      failed: true,
    };
  }

  const text = JSON.parse(params.__ow_body).text;

  const default_item = {
    name: null,
    item_class: null,
    category: null,
    quantity: 1,
    price: null,
    purchase_date: new Date(),
    expiry_date: null,
    days_to_expiry: 0, //TODO implement logic
    frozen: false,
    status: "uneaten",
    remove_date: null,
  };

  let inventory_list = [];

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
        console.log("INVENTORY");
        console.log(inventory_list);
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

  return { inventory_list: inventory_list };
}

global.main = main;