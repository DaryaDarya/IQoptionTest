const bcrypt = require('bcryptjs');

module.exports = function(dbConnection){
	db = dbConnection;
	return {
		get: get,
		register: register,
		login: login
	}
}

function getByUsername(username){
	return db.oneOrNone("SELECT * FROM users WHERE username = $1", [username]);	
}

function get(id){
	return db.oneOrNone("SELECT * FROM users WHERE id = $1", [id]);	
}

function register(username, password){
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

function login(username, password){
	console.log(username, password);
	return getByUsername(username)
		.then(user => {
			if (!user){
				console.log("USERNAME NOT FOUND:", user.username);
				return null
			}else{
				console.log(user);
				var hash = user.password.trim();
				var result = bcrypt.compareSync(password, hash);
				if (result) {
		            return user;
		        } else {
					console.log("AUTHENTICATION FAILED");
		            return null;
		        }
			}
		})
}