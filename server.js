// dependencies
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var handlebars = require("handlebars");
var path = require("path");

// Scraping tools

var request = require("request");
var cheerio = require("cheerio");

// Require all models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Import Routes/Controller
var viewRoute = require("./controllers/controller.js");
app.use(viewRoute);

// Use morgan logger for logging requests
app.use(logger("dev"));

// Body Parser request

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// Serve Static Content
app.use(express.static("/public"));

// Express-Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
    // extname: ".hbs",
    // layoutsDir: path.join(__dirname, "views/layouts")
  })
);
app.set("view engine", "handlebars");
// app.set("views", path.join(__dirname, "views"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/Articles", { useNewUrlParser: true });
var db = mongoose.connection;
// Mongoose errors if does not connect
db.on("error", function(error) {
  console.log("Mongoose error:", error);
});
// success message
db.once("open", function() {
  console.log("Mongoose connected");
});

// Launch App
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Running on port: Lidia's Scraper News Channel " + port);
});
