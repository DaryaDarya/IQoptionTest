var request = require("request");
var iconv  = require('iconv-lite');
var schedule = require('node-schedule');
var parser = require("./parser");

var opt = {
    url: "https://www.kinopoisk.ru/top/",
    encoding: null
}

getData(); //to get data immediately after running script

var workingJob = schedule.scheduleJob('0 0 * * *', getData); //to get new data every day at 00:00

function getData () {
  request(opt, function (error, response, body) {
      if (!error) {
          parser.parseBody(iconv.decode(body, 'win1251'));
      } else {
          console.log("Произошла ошибка: " + error);
      }
  });
}

