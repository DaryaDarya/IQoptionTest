var JwtStrategy = require('passport-jwt').Strategy;  
var ExtractJwt = require('passport-jwt').ExtractJwt;  
var config = require('../config/config');

module.exports = function(passport, User) {  
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
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
  }));
};