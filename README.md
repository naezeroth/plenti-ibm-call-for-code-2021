![Logo of the project](https://raw.githubusercontent.com/jehna/readme-best-practices/master/sample-logo.png)


//Another example https://github.com/dbader/readme-template
# Plenti - clever eating, greener living.
> Additional information or tagline
Plenti is a mobile application which digitises the kitchen inventory and uses expiry date approximations to remind people to finish their food on time. The application prioritises usability by minimising the manual input required by the user; this is an issue which many existing solutions fail to address. A user can input data into the application through receipt scanning, which scans products off a store receipt through a text recognition model, and classifies specific store products into general food item categories through a natural language classifier implemented using IBM Watson. 

Insights on one’s level of food waste in terms of amounts, types of food wasted and costs are also provided to help consumers make smarter decisions. Users can see both personal and Plenti community insights, while a leaderboard displays users that have most improved their food savings. This quantifies the positive environmental impact each person can make while using the app and integrates social elements to engage users. 

The front-end user interface of the application is developed in React Native, allowing for cross-platform compatibility. This mobile user interface communicates with a cloud-based back-end hosted on IBM Cloud Functions, which interacts with a Cloudant database to store user data. 

## Installing / Getting started

Our repository is split between our mobile application built with Expo and React Native and our backend deployed as individual functions on IBM's CLoud Functions.

To get started with our application you will need to configure your IBM cloud. 

### IBM Cloud

![Solution Architecture](/images/solution-architecture.png)

Create an IBM cloud account and set up 

#### Cloudant Database 

Create a Cloudant database and a non-partitioned table called "users". Create a service credential and note down the apiKey and Service URL. 

#### Cloud Functions and API Gateway

Create a cloud functions namespace and note down all the environment variables such as region and namespace. Ensure you have downloaded the IBM CLI tool on your device, downloaded the [cloud functions plugin](https://cloud.ibm.com/functions/learn/cli) set the correct namespace. 
#### Natural Language Classifier 

???? Ensure you have noted down the service credentials
### Initial Configuration

Simply clone the repo and inside /backend/actions/ copy the .env.dist to a .env file and fill out the specified information. 

Now inside /backend run an ```npm install``` and for each folder in actions run ```npm run build``` (this builds the index.js file with dependencies into a single file) and run ```npm run deploy``` which will deploy each of the functions to your IBM Cloud Functions Namespace. 

Inside the IBM Cloud Functions dashboard, head to API and click create API. From there configure like so. Or optionally import the API.yaml file in the root of the project.

![API Specification](/images/api-spec.png)

TODO - also another .env for app/ for the API url. 


We're all set up now!

Simply go to /app and run ```npm install``` and ```npm start``` to view the application on your device with Expo Go. 

## Developing

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
git clone https://github.com/your/awesome-project.git
cd awesome-project/
packagemanager install
```

And state what happens step-by-step.

### Building

If your project needs some additional steps for the developer to build the
project after some code changes, state them here:

```shell
./configure
make
make install
```

Here again you should state what actually happens when the code above gets
executed.

### Deploying / Publishing

In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

```shell
packagemanager deploy awesome-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.

## Features

What's all the bells and whistles this project can perform?
* What's the main functionality
* You can also do another thing
* If you get really randy, you can even do this

## Configuration

Here you should write what are all of the configurations a user can enter when
using the project.

#### Argument 1
Type: `String`  
Default: `'default value'`

State what an argument does and how you can use it. If needed, you can provide
an example below.

Example:
```bash
awesome-project "Some other value"  # Prints "You're nailing this readme!"
```

#### Argument 2
Type: `Number|Boolean`  
Default: 100

Copy-paste as many of these as you need.

## Contributing

When you publish something open source, one of the greatest motivations is that
anyone can just jump in and start contributing to your project.

These paragraphs are meant to welcome those kind souls to feel that they are
needed. You should state something like:

"If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome."

If there's anything else the developer needs to know (e.g. the code style
guide), you should link it here. If there's a lot of things to take into
consideration, it is common to separate this section to its own file called
`CONTRIBUTING.md` (or similar). If so, you should say that it exists here.

## Links

Even though this information can be found inside the project on machine-readable
format like in a .json file, it's good to include a summary of most useful
links to humans using your project. You can include links like:

- Project homepage: https://your.github.com/awesome-project/
- Repository: https://github.com/your/awesome-project/
- Issue tracker: https://github.com/your/awesome-project/issues
  - In case of sensitive bugs like security vulnerabilities, please contact
    my@email.com directly instead of using issue tracker. We value your effort
    to improve the security and privacy of this project!
- Related projects:
  - Your other project: https://github.com/your/other-project/
  - Someone else's project: https://github.com/someones/awesome-project/


## Licensing

One really important part: Give your project a proper license. Here you should
state what the license is and how to find the text version of the license.
Something like:

"The code in this project is licensed under MIT license."
