const cheerio = require("cheerio");
//const fs = require('fs');
const db = require("./db");

function getParams($, cols) {
    var topMovie = getIdAndName($, cols);
    topMovie.rating = getRating($, cols);
    topMovie.place = getPlace($, cols);
    return topMovie;
}

function getIdAndName($, cols) {
    var linkEl = $(cols[1]).find("a");
    var url = linkEl.attr("href");
    var id = url.match(/(?!\/film\/)\d+(?=\/)/g)[0];
    var name = linkEl.text();
    //fs.appendFileSync("./films.txt", name);
    return {
      id: id,
      name: name
    };
}

function getEnglishName($, cols) {
    var nameEl = $(cols[1]).find("span");
    var name = nameEl.text();
    return name;
}

function getRating($, cols) {
    var ratingEl = $(cols[2]).find("a");
    var rating = ratingEl.text();
    return rating;
}

function getPlace($, cols) {
    var placeEl = $(cols[0]).find("a");
    var place = placeEl.attr("name");
    return place;
}

function parseBody(body) {
  var $ = cheerio.load(body);
  var top = $("#top250_place_1").parent().children();
  for (let i = 1; i < top.length; i++) {
      var child = $(top[i]);
      if(child.attr("id").startsWith("top250_place")){
        var params = getParams($, child.children());
        db.save(params);
      }
  }
}

module.exports = {
  parseBody: parseBody
}


