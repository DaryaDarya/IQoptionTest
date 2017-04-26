const express = require('express'),
    //cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    //methodOverride = require('method-override'),
    //session = require('express-session'),
    passport = require('passport'),
    jwt = require('jsonwebtoken')
    config = require('./config/config'),
    User = require('./repositories/user');    

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

var apiRoutes = express.Router();  

apiRoutes.post('/register', function(req, res) {  
	if(!req.body.username || !req.body.password) {
		res.json({ success: false, message: 'Please enter username and password.' });
	} else {
		return User.register(req.body.username, req.body.password)
			.then((user) => {
				console.log(user);
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
});

apiRoutes.post('/authenticate', function(req, res) {  
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
});

apiRoutes.get('/dashboard', passport.authenticate('jwt', { session: false }), function(req, res) {  
  res.send('It worked! User id is: ' + req.user.id + '.');
});

apiRoutes.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('/api', apiRoutes); 

var port = 5000;
app.listen(port);
console.log("start at 5000")