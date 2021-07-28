# Plenti - clever eating, greener living.

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

## Installation / Getting Started

Our repository is split between our mobile application built with Expo and React Native and our backend deployed as individual functions on IBM's Cloud Functions.

To get started with our application you will need to configure your IBM cloud. 

### IBM Cloud

![Solution Architecture](/images/solution-architecture.png)

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

## Licensing

The code in this project is licensed under MIT license.
