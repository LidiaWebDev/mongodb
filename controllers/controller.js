var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var handlebars = require("handlebars");
var path = require("path");
var axios = require("axios");
var request = require("request"); // for web-scraping
var cheerio = require("cheerio"); // for web-scraping

// set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Import the Comment and Article models
// var Note = require("../models/Note.js");
// var Article = require("../models/Article.js");
const db = require("../models");

// Index Page Render (first visit to the site)
router.get("/", function(req, res) {
  console.log("Root Route");
  var hbsObject = {
    articles: "TEST1"
  };
  //res.render("articles", hbsObject);
  res.render("index", hbsObject);
  //res.json({ message: "hello scraping news" });
  // Scrape data
  // res.redirect("/articles");
});

// Articles Page Render
router.get("/articles", function(req, res) {
  db.Article.find({}, function(error, doc) {
    // log eny errors
    if (error) {
      console.log(error);
    }
    // successul json object
    else {
      var hbsObject = {
        articles: doc
      };
      res.render("index", hbsObject);
    }
  });
});

// Web Scrape Route

function scrape() {
  axios.get("https://www.pe.com/").then(function(response) {
    let $ = cheerio.load(response.data);
    console.log($);
    $("span.dfm-title").each(function(i, element) {
      let result = {};
      result.title = $(this).text();
      // result.content = $(this)
      //   .children("header")
      //   .children("h2")
      //   .children("p")
      //   .text();
      result.imgLink = $(this).children();
      db.Article.create(result).then(function(Article) {
        console.log(Article);
      });
    });
  });
}
scrape();
// router.get("/scrape", function(req, res) {
//   // First, grab the body of the html with request
//   request("https://www.pe.com", function(error, response, html) {
//     if (!error && response.statusCode == 200) {
//       // Then, load html into cheerio and save it to $ for a shorthand selector
//       var $ = cheerio.load(html);
//       var articles = {};
//       // Now, grab every everything with a class of "inner" with each "article" tag
//       $("span.dfm-title").each(function(i, element) {
//         // Create an empty result object
//         var result = {};

//         // Collect the Article Title (contained in the "h2" of the "header" of "this")
//         result.title =
//           $(this)
//             .children("header")
//             .children("h2")
//             .text()
//             .trim() + ""; //convert to string for error handling later
//         console.log("Result title:" + result.title);

//         // Collect the Article Link (contained within the "a" tag of the "h2" in the "header" of "this")
//         result.link =
//           "https://www.pe.com" +
//           $(this)
//             .children("header")
//             .children("h2")
//             .children("a")
//             .attr("href")
//             .trim();

//         // Collect the Article Summary (contained in the next "div" inside of "this")
//         result.summary =
//           $(this)
//             .children("div")
//             .text()
//             .trim() + ""; //convert to string for error handling later

//         articles[i] = result;

//         console.log("The scraped article is built" + articles);

//         var hbsObject = {
//           articles: articles
//         };
//         res.render("index", hbsObject);
//       });
//     }
//   });
// });

router.post("/save", function(req, res) {
  console.log("The title:" + req.body.title);

  var newHbsObject = {};
  newHbsObject.title = req.body.title;
  newHbsObject.link = req.body.link;

  var entry = new Article(newHbsObject);
  console.log("Saving the article" + entry);

  entry.save(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc);
    }
  });
  res.redirect("/savearticles");
});

router.get("/delete/:id", function(req, res) {
  console.log("Id is searched to be deleted" + req.params.id);
  console.log("Delete function works");
  articles.findOneAndRemove({ _id: req.params.id }, function(err, offer) {
    if (err) {
      console.log("artcile was not deleted" + err);
    } else {
      console.log("The article was deleted");
    }
    res.redirect("/savearticles");
  });
});
router.get("/notes/:id", function(req, res) {
  console.log("Id is searched to be deleted" + req.params.id);
  console.log("Delete function works");
  articles.findOneAndRemove({ _id: req.params.id }, function(err, doc) {
    if (err) {
      console.log("note was not deleted" + err);
    } else {
      console.log("The note was deleted");
    }
    res.send(doc);
  });
});

router.get("/articles/:id", function(req, res) {
  console.log("ID is getting read" + req.params.id);
  articles
    .findOne({ _id: req.params.id })
    .populate("notes")
    .exec(function(err, doc) {
      if (err) {
        console.log("notes" + doc);
        res.json(doc);
      }
    });
});

router.post("/articles/:id", function(req, res) {
  var newNote = new Note(req.body);
  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      articles
        .findOneAndUpdate(
          { _id: req.params.id },
          { $push: { notes: doc._id } },
          { new: true, upsert: true }
        )
        .populate("notes")
        .exec(function(err, doc) {
          if (err) {
            console.log("can not find the article");
          } else {
            console.log("saved note" + doc.notes);
            res.send(doc);
          }
        });
    }
  });
});
// Export Router to Server.js
module.exports = router;
