var JwtStrategy = require('passport-jwt').Strategy;  
var ExtractJwt = require('passport-jwt').ExtractJwt;  
var config = require('../config/config');

module.exports = function(passport, User, redisClient) {  
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  opts.passReqToCallback = true;
  passport.use(new JwtStrategy(opts, function(request, jwt_payload, done) {
    var token = "JWT "+ opts.jwtFromRequest(request);
    redisClient.exists(token, (err, reply) => {
      if (reply === 1){
        done(null, false);        
      }else{
        return User.get(jwt_payload.id)
          .then(user => {
            if (user) {
              done(null, user);
            } else {
              done(null, false);
            }
          })
          .catch(err => {
            done(err, false); 
          })
        }
      })
  }));
};