var config = require("../config");
var promise = require("bluebird");
var pgp = require("pg-promise")({promiseLib: promise});
var db = pgp(config.db);

function saveMovie(params){
	return db.any("SELECT * FROM top250 WHERE id = $1", [params.place])
	    .then(data => {
	    	if (data.length){
	    		return db.none("UPDATE top250 SET kp_id = $1, name = $2, rating = $3, genre = $4, year = $5 WHERE id = $6",
	    			[params.id, params.name, params.rating, params.genre, params.year, params.place])
	    	}else{
	    		return db.none("INSERT INTO top250(id, kp_id, name, rating, genre, year) VALUES($1, $2, $3, $4, $5, $6)",
	    			[params.place, params.id, params.name, params.rating, params.genre, params.year])
	    	}
	    })
}

function saveGenre(genre) {
	return db.any("SELECT * FROM genres WHERE name = $1", [genre])
		.then(data => {
			if (data.length){
				return data[0];
			}else{
				return db.one("INSERT INTO genres(name) VALUES($1) RETURNING id", [genre])
			}
		})
		.then(data => {
			return data.id;
		})
}

function saveMovieGenre(movieId, genreId) {
	return db.any("SELECT * FROM movieGenres WHERE movieId = $1 AND genreId = $2", [movieId, genreId])
		.then(data => {
			if (!data.length){
				return db.none("INSERT INTO movieGenres(movieId, genreId) VALUES($1, $2)", [movieId, genreId]);
			}
		})
}

module.exports = {
	saveMovie: saveMovie,
	saveGenre: saveGenre,
	saveMovieGenre: saveMovieGenre
}
