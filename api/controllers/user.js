const jwt = require('jsonwebtoken');
const config = require('../config/config');
var User;

module.exports = function(userRepository){
	User = userRepository;
	return {
		login: login,
		register: register
	}
}

function login(req, res) {  
	return User.login(req.body.username, req.body.password)
		.then((user) => {
			if (!user){
				res.send({ success: false, message: 'Authentication failed. User not found or Passwords did not match.' });
			}else{
				var token = jwt.sign(user, config.secret, {
					expiresIn: 10080
				});
				res.json({ success: true, token: 'JWT ' + token });
			}
		})
		.catch((err) => {
			if (err) throw err;
		})
}

function register(req, res) {  
	if(!req.body.username || !req.body.password) {
		res.json({ success: false, message: 'Please enter username and password.' });
	} else {
		return User.register(req.body.username, req.body.password)
			.then(user => {
				if (user){
					res.json({ success: true, message: 'Successfully created new user.' });
				}else{
					res.json({ success: false, message: 'That username address already exists.'});
				}
			})
			.catch(() => {
				res.json({ success: false, message: 'That username address already exists.'});
			})
  	}
}