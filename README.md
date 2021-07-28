![Inventory](/images/inventory.jpeg "Inventory")
![Scanner](/images/scanner.jpeg "Scanner")
![Scanned result](/images/scanned-result.jpeg "Scanned Result")
![Select](/images/select.jpeg "Select")
![Dashboard](/images/dashboard.jpeg "Dashboard")
![Bin](/images/bin.jpeg "Bin")
![Leaderboard](/images/leaderboard.jpeg "Leaderboard")

# Plenti - clever eating, greener living.

Plenti is a mobile application which digitises the kitchen inventory and uses expiry date approximations to remind people to finish their food on time. The application prioritises usability by minimising the manual input required by the user; this is an issue which many existing solutions fail to address. A user can input data into the application through receipt scanning, which scans products off a store receipt through a text recognition model, and classifies specific store products into general food item categories through a natural language classifier implemented using IBM Watson. 

Insights on one’s level of food waste in terms of amounts, types of food wasted and costs are also provided to help consumers make smarter decisions. Users can see both personal and Plenti community insights, while a leaderboard displays users that have most improved their food savings. This quantifies the positive environmental impact each person can make while using the app and integrates social elements to engage users. 

The front-end user interface of the application is developed in React Native, allowing for cross-platform compatibility. This mobile user interface communicates with a cloud-based back-end hosted on IBM Cloud Functions, which interacts with a Cloudant database to store user data. 

## Installing / Getting started

Our repository is split between our mobile application built with Expo and React Native and our backend deployed as individual functions on IBM's CLoud Functions.

To get started with our application you will need to configure your IBM cloud. 

### IBM Cloud

![Solution Architecture](/images/solution-architecture.png)

Create an IBM cloud account and set up the following services.

#### Cloudant Database 

Create a Cloudant database and a non-partitioned table called "users". Create a service credential and note down the apiKey and Service URL. 

#### Cloud Functions and API Gateway

Create a cloud functions namespace and note down all the environment variables such as region and namespace. Ensure you have downloaded the IBM CLI tool on your device, downloaded the [cloud functions plugin](https://cloud.ibm.com/functions/learn/cli) set the correct namespace. 
#### Natural Language Classifier 

???? Ensure you have noted down the service credentials 

#### OCR 

[Follow instructions](https://developer.ibm.com/technologies/artificial-intelligence/models/max-ocr/) to deploy your own OCR in your IBM cloud environment using the Kubernetes Cluster service or use the sample provided by IBM for testing purposes.

### Configuration

Simply clone the repo and inside /backend/actions/ copy the .env.sample to a .env file and fill out the specified information. 

Now inside /backend run an ```npm install``` and for each folder in actions run ```npm run build``` (this builds the index.js file with dependencies into a single file) and run ```npm run deploy``` which will deploy each of the functions to your IBM Cloud Functions Namespace. 

Inside the IBM Cloud Functions dashboard, head to API and click create API. From there configure like so. Or optionally import the API.yaml file in the root of the project.

![API Specification](/images/api-spec.png)

Go to /app and copy app.json.sample to app.json and fill out the apiUrl from the Cloud Functions page and add the OCR endpoint.

We're all set up now!

Simply go to /app and run ```npm install``` and ```npm start``` to view the application on your device with Expo Go. 

## Licensing

"The code in this project is licensed under MIT license."
