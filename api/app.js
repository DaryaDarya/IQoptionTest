const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport');
    
const config = require('./config/config');
const promise = require("bluebird");
const pgp = require("pg-promise")({promiseLib: promise});
const db = pgp(config.db);
const redis = require('redis');
const redisClient = redis.createClient();

const userRepository = require("./repositories/user")(db)
const movieRepository = require("./repositories/movie")(db)
const userController = require("./controllers/user")(userRepository, redisClient);
const movieController = require("./controllers/movie")(movieRepository);
const router = require('./router')(express, passport, userController, movieController);

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport, userRepository, redisClient);

app.use('/api', router); 

app.listen(config.port, () => console.log("start at ", config.port));