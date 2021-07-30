# Plenti - clever eating, greener living.

<img src="/images/logo.png" width="100%"/>

Plenti is a mobile application that applies the 2 principles of preventing food waste used by small cafes - inventory tracking and waste measurement. This solution aims to remind consumers about what’s in their kitchen by providing greater visibility on food items that can be tucked away for too long, as well as allowing consumers to measure what they’re throwing out to access personalised insights on how to improve their wasteful behaviours. Where consumers previously needed to track their inventory on lists or spreadsheets, our solution aims to provide an easy way for consumers to stay on top of their groceries and reduce waste. An added social element motivates users and aims to reinforce that tackling food waste is a collective effort. 

To do so, Plenti digitises the kitchen inventory and uses expiry date approximations to remind people to finish their food on time. A user can input data into the application through receipt scanning, which scans products off a store receipt through a text recognition model, and classifies specific store products into general food item categories through a natural language classifier implemented using IBM Watson. 

Insights on one’s level of food waste in terms of amounts, types of food wasted and costs are also provided to help consumers make smarter decisions. Users can see both personal and Plenti community insights, while a leaderboard displays users that have most improved their food savings. This quantifies the positive environmental impact each person can make while using the app and integrates social elements to engage consumers. 

The front-end user interface of the application is developed in React Native, allowing for cross-platform compatibility. This mobile user interface communicates with a cloud-based back-end hosted on IBM Cloud Functions, which interacts with a Cloudant database to store user data. 

<p float="left">
<img src="/images/inventory.jpeg" alt="Inventory" width="23%"/>
<img src="/images/scanner.jpeg" alt="Scanner" width="23%"/>
<img src="/images/scanned-result.jpeg" alt="Scanned Result" width="23%"/>
<img src="/images/select.jpeg" alt="Select" width="23%"/>
<img src="/images/dashboard.jpeg" alt="Dashboard" width="23%"/>
<img src="/images/bin.jpeg" alt="Bin" width="23%"/>
<img src="/images/leaderboard.jpeg" alt="Leaderboard" width="23%"/>
</p>

## Contents 

01. [Video Demo](#Video-Demo)
02. [App Usage](#App-Usage)
03. [Solution Architecture](#Solution-Architecture)
04. [Installation / Getting Started](#Installation)
05. [Project Roadmap](#Project-Roadmap)
06. [Authors](#Authors)
07. [License](#License)

## Video Demo <a name="Video-Demo"></a>


## App Usage <a name="App-Usage"></a>
The Plenti app is divided into three primary screens: the inventory, scanner and dashboard. 

### Create Account



### Inventory
The inventory screen allows the user to manage their food inventory, 

#### Add Items
Items can be added to the inventory using the add button at the top of the screen. 

#### Edit Items

#### Freeze Items

#### Eat, Throw Out, Delete

### Scanner

### Dashboard


## Solution Architecture <a name="Solution-Architecture"></a>

![Solution Architecture](/images/solution-architecture.png)

1. The user interacts with a mobile application to view and manage their food inventory.
1. The React Native application communicates with the back end through an API managed by API Gateway.
1. API Gateway accesses a serverless back end implemented through various actions in Cloud Functions.
1. Each Cloud Functions action may interact with other cloud services to perform data processing and store information in the database.
1. The Cloudant database stores user data for back-end access.
1. An optical character recognition (OCR) model is deployed in the cloud to convert user-scanned receipt images to text data.
1. Watson Natural Language Classifier is used to semantically classify products into different food categories.

## Installation / Getting Started <a name="Installation"></a>

Our repository is split between our mobile application built with Expo and React Native and our backend deployed as individual functions on IBM's Cloud Functions.

To get started with our application you will need to configure your IBM cloud. 

### IBM Cloud

Create an IBM cloud account and set up the following services.

#### Cloudant Database

Create a Cloudant database and a non-partitioned table called "users". Create a service credential and note down the apiKey and Service URL. 

#### Cloud Functions and API Gateway

Create a cloud functions namespace and note down all the environment variables such as region and namespace. Ensure you have downloaded the IBM CLI tool on your device, downloaded the [cloud functions plugin](https://cloud.ibm.com/functions/learn/cli) set the correct namespace. 

#### Natural Language Classifier 

Create a Watson Natural Language Classifier instance. To train the classifier, first load a dataset of training samples and labels in a csv format into your data assets. Our dataset consists of approximately 5000 training samples spanning 54 different food classes, collected from various Australian supermarkets. This dataset can be accessed in the dataset folder of this repository. After loading the dataset, train the model on the data. This training process may take some time. Note down the API key, service URL and classifier ID for the model instance, as this is needed for external access to the classifier.

#### Optical Character Recognition (OCR)

[Follow instructions](https://developer.ibm.com/technologies/artificial-intelligence/models/max-ocr/) to deploy your own OCR in your IBM cloud environment using the Kubernetes Cluster service or use the sample provided by IBM for testing purposes.

### Configuration

Simply clone the repo and inside /backend/actions/ copy the .env.sample to a .env file and fill out the specified information. 

Now inside /backend run an ```npm install``` and for each folder in actions run ```npm run build``` (this builds the index.js file with dependencies into a single file) and run ```npm run deploy``` which will deploy each of the functions to your IBM Cloud Functions Namespace. 

Inside the IBM Cloud Functions dashboard, head to API and click create API. From there configure like so. Or optionally import the API.yaml file in the root of the project.

![API Specification](/images/api-spec.png)

Go to /app and copy app.json.sample to app.json and fill out the apiUrl from the Cloud Functions page and add the OCR endpoint.

We're all set up now!

Simply go to /app and run ```npm install``` and ```npm start``` to view the application on your device with Expo Go. 

## Authors <a name="Authors"></a>
* Apurva Shukla
* David Young
* Christina Liu
* James Macintyre
* Vivian Yu
<!-- * [*Apurva Shukla*](https://www.linkedin.com/in/apurva-shukla/)
* [*David Young*](https://www.linkedin.com/in/dy27/)
* [*Christina Liu*](https://www.linkedin.com/in/christinaliu123/)
* [*James Macintyre*](https://www.linkedin.com/in/jameslmacintyre/)
* [*Vivian Yu*](https://www.linkedin.com/in/vivian-yu-914a56152/) -->

## License <a name="License"></a>
This project is licensed under the Apache 2 License - see the [ LICENSE ](https://github.com/naezeroth/plenti-ibm-call-for-code-2021/blob/master/LICENSE) for details.
