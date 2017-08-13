# Nodejs Account System

This project demonstrate how a user account system may work using NodeJs, which this project was created by me (Ashley Chapman)

### Dependances

* Node.js
* MongoDB
* bcryptjs
* body-parser
* cachegoose
* connect-flash
* cookie-parser
* escape-html
* express
* express-device
* express-handlebars
* express-messages
* express-session
* express-validator
* handlebars
* handlebars-helper-equal
* hbs
* mongoose
* passport
* passport-http
* passport-local

### Recommended Packages

* Nodemon

### How to Run / Initialize MongoDB
Open the Terminal / Command Prompt and type

```
mongod

```

This will start the MongoDB Database Server and this is required everytime you first start / continue developing this project, unless you have a start-up script for MongoDB

### How to install  / run Web Service / Web Site
Use the Terminal / Commandline and type theses commands (Make sure you have Node.js Installed)

```
cd nodejs-account-system
npm install
node .
// Or if nodemon is installed 'npm install -g nodemon'
nodemon .
```