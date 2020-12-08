//region SET UP

const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const dateFormat = require("date-format");
require('dotenv').config()


const config = require("./assets/json/config.json");
const HOST = config.host;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.json());

const session = require("express-session");
const Keycloak = require("keycloak-connect");

const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: "abcdefageguhdok654sd65_djzuéOdnjzKIJDjneé0I",
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  })
);

const keycloak = new Keycloak({
  store: memoryStore
});

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/"
  })
);

global.appRoot = __dirname;

app.use("/files", express.static(global.appRoot + "/uploads"));

//endregion

// import sequelize
const sequelize = require("./sequelize")

//region MIDDLEWARE

/*
 *   This method will be invoked on every request we get. It allows us to log every requests we get with its origin.
 */
app.use(function(req, res, next) {
  let log = `[${dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")}] : ${req.method} ${HOST}${req.originalUrl} FROM ${req.ip}`;
  console.log(log);
  next();
});

/*
 *   This method will allow CORS
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", config.CORS_origin); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

//endregion

//region SERVER START

console.log("\n\tPROJECT_A LOADING...\n\n");

console.log("Loading models...\n");
let models = require("./models/import")(sequelize, Sequelize); // we retrieve the different models in a json object we will pass to the requests
console.log("\nLoading models complete\n");

console.log("Loading requests...\n");
let router = require("./temp")(models, keycloak);
console.log("\nLoading requests complete\n");

/*
 *   Syncing the database mean that if there was a table missing from the database that we could have added, it will add this table.
 *   Once its done, we launch the server as we are ready to fulfill requests.
 * */
sequelize
  .sync({ force: false })
  .then(() => {
      app.use("/", router);
      console.log("\nDatabase synced");
      app.listen(2424, function() {
        console.log("\n\tPROJECT_A LOADING COMPLETE");
        console.log("\nServer running on port 2424");
    });
  })
  .catch(err => {
    console.log("Error during syncing :\n" + err);
  });

//endregion

module.exports = app;
