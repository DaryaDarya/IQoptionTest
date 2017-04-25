var config = require("./config");
var promise = require("bluebird");
var pgp = require("pg-promise")({promiseLib: promise});
var db = pgp(config.db);

function save(params){
	return db.any("SELECT * FROM top250 WHERE id = $1", [params.place])
	    .then(data => {
	    	if (data.length){
	    		return db.none("UPDATE top250 SET kp_id = $1, name = $2, rating = $3, genre = $4 WHERE id = $5", 
	    			[params.id, params.name, params.rating, "", params.place])	    
	    	}else{
	    		return db.none("INSERT INTO top250(id, kp_id, name, rating, genre) VALUES($1, $2, $3, $4, $5)", 
	    			[params.place, params.id, params.name, params.rating, ""])	    		
	    	}
	    })
}

module.exports = {
	save: save
}