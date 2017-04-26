var Movie;

module.exports = function(movieRepository){
	Movie = movieRepository;
	return {
		getMovies: getMovies,
		getYears: getYears,
		getGenresCount: getGenresCount,
		getGenresRating: getGenresRating
	}
}

function getMovies(req, res) {  
	return Movie.getMovies(req.query.rows, req.query.page, req.query.genre, req.query.name, req.query.sorting)
		.then(movies => {
		  	res.send({movies:movies});
		})
}

function getYears(req, res) {  
	return Movie.getYears(req.query.startYear, req.query.endYear)
		.then(years => {
		  	res.send({years:years});
		})
}

function getGenresCount(req, res) {  
	return Movie.getGenresCount(req.query.genre)
		.then(genres => {
		  	res.send({genres:genres});
		})
}

function getGenresRating(req, res) {  
	return Movie.getGenresRating(req.query.genre)
		.then(genres => {
		  	res.send({genres:genres});
		})
}