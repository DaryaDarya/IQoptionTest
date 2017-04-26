const cheerio = require("cheerio");
const promise = require("bluebird");
const promisifiedRequest = promise.promisify(require("request"));
const db = require("./db");
const requestService = require("./requestService");
const genres = require("../data/genres").genres;

function getParams($, cols) {
    var topMovie = getMainParams($, cols);
    topMovie.rating = getRating($, cols);
    topMovie.place = getPlace($, cols);
    return getFirstGenreFake(topMovie.id)
      .then( genre => {
        topMovie.genre = genre;
        return topMovie;
      })
}

function getFirstGenreFake(movieId) {
  return promise.cast(genres[Math.floor(Math.random()*genres.length)]);
}

function getMainParams($, cols) {
    var linkEl = $(cols[1]).find("a");
    var url = linkEl.attr("href");
    var id = url.match(/(?!\/film\/)\d+(?=\/)/g)[0];
    var fullName = linkEl.text();
    var name = fullName.substring(0, fullName.lastIndexOf(" "));
    var year = fullName.substring(fullName.lastIndexOf(" ") + 2, fullName.length-1);
    return {
      id: id,
      name: name,
      year: year
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

function parseMovie($, cols) {
  return getParams($, cols)
    .then(params => {
      return db.saveMovie(params);
    })
}

function parseBody(body) {
  var $ = cheerio.load(body);
  var top = $("#top250_place_1").parent().children().toArray();
  return promise.map(top, child => {
      var $child = $(child);
      var elementId = $child.attr("id");
      if(elementId && elementId.startsWith("top250_place")){
        return parseMovie($, $child.children());
      }
      return;
  }, {concurrency: 5})
  .then(() => console.log("Done"));
}



/*-----------------For parsing multiple genre---------------*/
function getGenres(movieId) {
  return requestService.getMovie(movieId)
    .then(response => {
      return parseGenres(movieId, response);
    })
}

function parseGenres(movieId, moviePageBody) {
  var $ = cheerio.load(moviePageBody)
  var genreNodes = $('span[itemprop="genre"]').children().toArray();
  return promise.map(genreNodes, genreNode => {
    var genre = $(genreNode).text();
    return saveGenreToMovie(movieId, genre);
  })
}

function saveGenreToMovie(movieId, genre) {
  return db.saveGenre(genre)
    .then(genreId => {
      return db.saveMovieGenre(movieId, genreId);
    })
}

function parseBodyRecursively(body) {
  var $ = cheerio.load(body);
  var top = $("#top250_place_1").parent().children().toArray();
  var i=0;
  return parseMovieRecursively($, top, i, top.length);
}

function parseMovieRecursively($, movies, i, max) {
  var $child = $(top[i]);
  return parseOneMovie($, $child)
    .then(() => {
      if(i < max)
        return parseMovieRecursively($, movies, i+1, max)
    })
}

function parseOneMovie($, $child) {
  var elementId = $child.attr("id");
  if(elementId && elementId.startsWith("top250_place")){
    return parseMovie($, $child.children());
  }
  return promise.resolve();
}



/*-----------------For parsing first genre---------------*/
function getFirstGenre(movieId) {
  return requestService.getMovie(movieId)
    .then(response => {
      console.log(response);
      return parseFirstGenre(movieId, response);
    })
}

function parseFirstGenre(movieId, moviePageBody) {
  var $ = cheerio.load(moviePageBody)
  var genreNodes = $('span[itemprop="genre"]').children().toArray();
  return $(genreNodes[0]).text();
}

module.exports = {
  parseBody: parseBody
}
