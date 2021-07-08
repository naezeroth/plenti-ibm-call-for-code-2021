const bcrypt = require('bcrypt');               //Importing the NPM bcrypt package.
//https://medium.com/@yunyuenchan/how-to-use-npm-module-in-ibm-cloud-functions-a0c76154e85
//https://dipankarmaikap.com/how-to-design-a-serverless-rest-api-ibm-cloud-functions-and-cloudant/ 
//https://www.codespot.org/hashing-passwords-in-nodejs/
//https://cloud.ibm.com/functions/actions
// Step 1: create a cloud function
main = message => {
  console.log(message.email)
  console.log(message.password)
  const saltRounds = 10;                          //We are setting salt rounds, higher is safer.
  const myPlaintextPassword = message.password;   //Unprotected password


  /* Here we are getting the hashed password from the callback,
  we can save that hash in the database */
  bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
    //save the hash in the db
    console.log(hash);
  });

}
// Step 2: Execute it for testing
main({
  email: 'abc@gmail.com',
  password: 'thisIsPassword'
})
// Step 3: Assign it as start function
global.main = main