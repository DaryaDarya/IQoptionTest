var schedule = require('node-schedule');
var requestService = require("./services/requestService");
var parser = require("./services/parser");

getData(); //to get data immediately after running script

var workingJob = schedule.scheduleJob('0 0 * * *', getData); //to get new data every day at 00:00

function getData () {
  return requestService.getTop()
    .then(response => {
      return parser.parseBody(response);
    })
}

