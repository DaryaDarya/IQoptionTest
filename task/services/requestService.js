var promise = require("bluebird");
var promisifiedRequest = promise.promisify(require("request"));
var iconv  = require('iconv-lite');

function getTop() {
  var requestOptions = {
      url: "https://www.kinopoisk.ru/top/",
      encoding: null,
      json: true
  };
  return makeRequest(requestOptions);
}

function makeRequest(options) {
  return promisifiedRequest(options)
    .then(response => {
      return iconv.decode(response.body, 'win1251');
    })
}

function getMovie(id) {
  var requestOptions = {
      url: `https://www.kinopoisk.ru/film/${id}/`,
      headers: {
        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4,pl;q=0.2',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
      },
      encoding: null,
      json: true
  };
  return makeRequest(requestOptions);
}

module.exports = {
  getTop: getTop,
  getMovie: getMovie
}
