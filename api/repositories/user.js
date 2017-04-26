const config = require("../config/config");
const promise = require("bluebird");
const pgp = require("pg-promise")({promiseLib: promise});
const db = pgp(config.db);
const bcrypt = require('bcryptjs');

function getByUsername(username){
	return db.oneOrNone("SELECT * FROM users WHERE username = $1", [username]);	
}

exports.get = function(id){
	return db.oneOrNone("SELECT * FROM users WHERE id = $1", [id]);	
}

exports.register = function(username, password){
	console.log(username, password);
	return getByUsername(username)
		.then(user => {
			console.log(user);
			if (user){
				console.log("USERNAME ALREADY EXISTS:", user.username);
				return null;
			}else{
				var hash = bcrypt.hashSync(password, 8);
				console.log(hash, hash.length);
				var result = bcrypt.compareSync(password, hash);
				console.log(result);
				return db.one("INSERT INTO users(username, password) VALUES($1, $2) RETURNING *", [username, hash]);
			}
		})
}

exports.login = function(username, password){
	console.log(username, password);
	return getByUsername(username)
		.then(user => {
			if (!user){
				console.log("USERNAME NOT FOUND:", user.username);
				return null
			}else{
				console.log(user);
				var hash = user.password.trim();
				console.log(hash, hash.length);
				var result = bcrypt.compareSync(password, hash);
				console.log(result);
				if (result) {
		            return user;
		        } else {
					console.log("AUTHENTICATION FAILED");
		            return null;
		        }
			}
		})
}