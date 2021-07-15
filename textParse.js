const params = {
  "status": "ok",
  "text": [
      [
          "Woolworths @®",
          "The fresh food People"
      ],
      [
          "1178 Port Hacquarie PH: 02 5505 520;",
          "Cnr Bay and Park Streets ;"
      ],
      [
          "TAX INVOICE - ABN 88 000 014 675"
      ],
      [
          "“#Sistema Klip It Rectangle Container 9.6L"
      ],
      [
          "“HSistema Klip It Rectangle 7.01 3.00"
      ],
      [
          "“dSistema Klip It 1L 3pk =",
          "Qty 2@ $3.00 each 6.00"
      ],
      [
          "“aSistema Klip It Rectangle 5.0] 5.00",
          "“dSistema Klip It Cereal Storer 4.21 3.50",
          "“aSistema Container Cracker Large 1.8L 4.25",
          "“aSistema Klip It 1.9L Rectangle 3.50",
          "“aSistema Klip It Juice Jug 2.01 5.00",
          "“dSistema Klip It Rectangle 2L 2pk"
      ],
      [
          "Qty 3@ $2.75 — each 8.25",
          "“dSistema Klip It Rectangle 3.01"
      ],
      [
          "Qty 2@ $2.00 each 4.00"
      ],
      [
          "14 SUBTOTAL"
      ]
  ]
}


const default_item = {
    'name': null,
    'item_class': null,
    'category': null,
    'quantity': 1,
    'price': null,
    'purchase_date': null,
    'expiry_date': null,
    'frozen': false,
    'status': 'uneaten',
    'remove_date': null
};

let inventory_list = [];

for (const arr of params.text)
{
    for (const line of arr)
    {
        const split_line = line.split(' ');
        if (line[0] == '“')
        {
            // Create a copy of the default item
            let new_item = JSON.parse(JSON.stringify(default_item));

            // Test if price is at the end of the product line
            let regex = /\d+\.\d{2}/;
            if (regex.test(split_line[split_line.length-1]))
            {
                console.log("REGEX SUCCESS ON ", split_line[split_line.length-1]);
                // Remove price from the line and preceding symbols
                new_item['name'] = split_line.slice(0, -1).join(' ').slice(2);
                new_item['price'] = parseFloat(split_line[split_line.length-1]);
            }
            else
            {
                console.log("REGEX FAIL ON ", split_line[split_line.length-1]);
                // Remove preceding symbols
                new_item['name'] = line.slice(2);;
            }

            inventory_list.push(new_item);
            console.log("INVENTORY");
            console.log(inventory_list);
        }
        else if (split_line[0] == 'Qty')
        {
            // console.log('last item:');
            // console.log(inventory_list[inventory_list.length-1]);
            // console.log(inventory_list);
            // Update the quantity and price of the last added item
            inventory_list[inventory_list.length-1].quantity = parseFloat(split_line[1].slice(0,-1));
            inventory_list[inventory_list.length-1].price = parseFloat(split_line[2].slice(1));
        }
        else
        {

        }
    }
}

console.log(inventory_list);
return inventory_list;

// function main(params) {

//     // 'inventory_list': [
//     //         {
//     //                 'name': 'Macro Organic Banana each',
//     //                 'item_class': 'Bananas',
//     //                 'category': 'Fruit',
//     //                 'quantity': 5,
// // 	        'price': 2.0,
//     //                 'purchase_date': '2020-03-09T22:18:26.625Z',
//     //                 'expiry_date': '2020-07-09T22:18:26.625Z',
//     //                 'frozen': true,
//     //                 'status': 'eaten/trashed/uneaten',
//     //                 'state_date': '2020-07-09'
//     //         }
//     // ]
//     const default_item = {
//             'name': null,
//             'item_class': null,
//             'category': null,
//             'quantity': 1,
//             'price': null,
//             'purchase_date': null,
//             'expiry_date': null,
//             'frozen': false,
//             'status': 'uneaten',
//             'remove_date': null
//     };

//     let inventory_list = [];

//     for (const arr of params.text)
//     {
//         for (const line of arr)
//         {
//             const split_line = line.split(' ');
//             if (line[0] == '“')
//             {
//                 let new_item = default_item;
//                 let item_name;

//                 // Test if price is at the end of the product line
//                 let regex = /d+.d{2}/;
//                 if (regex.test(split_line[-1]))
//                 {
//                     // Remove price from the line and preceding symbols
//                     item_name = split_line.slice(0, -1).join('').slice(2);;
//                 }
//                 else
//                 {
//                     // Remove preceding symbols
//                     item_name = line.slice(2);;
//                 }

//                 inventory_list.push(new_item);
//             }
//             else if (split_line[0] == 'Qty')
//             {
//                 // Update the quantity and price of the last added item
//                 inventory_list[-1].quantity = parseFloat(split_line[1].slice(0,-1));
//                 inventory_list[-1].price = parseFloat(split_line[2].slice(1));
//             }
//             else
//             {

//             }
//             console.log(line[0]);
//         }
//     }

//     print(inventory_list);
// 	return inventory_list;
// }
