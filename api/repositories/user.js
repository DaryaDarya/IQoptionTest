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
	return getByUsername(username)
		.then(user => {
			if (user){
				console.log("USERNAME ALREADY EXISTS:", user.username);
				return null;
			}else{
				var hash = bcrypt.hashSync(password, 8);
				var result = bcrypt.compareSync(password, hash);
				return db.one("INSERT INTO users(username, password) VALUES($1, $2) RETURNING *", [username, hash]);
			}
		})
}

function login(username, password){
	return getByUsername(username)
		.then(user => {
			if (!user){
				console.log("USERNAME NOT FOUND:", user.username);
				return null
			}else{
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