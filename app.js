const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//swaggerUi doc
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//cookies and file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true, tempFileDir: "/temp/"
}));


// ui used to checksignup
app.set("view engine", "ejs");

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //using extended so that if its a nested json object it would support that.

//morgan middleWare
app.use(morgan("tiny"));

//import all routes
const home = require("./route/home");
const signup = require("./route/user");

//router middleware
app.use("/api/v1", home);
app.use("/api/v1", signup);

app.get("/signupform", (req, res) => {
    res.render("signupform");
  });

//export app js
module.exports = app;
