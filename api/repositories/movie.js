var db;

module.exports = function(dbConnection){
	db = dbConnection;
	return {
		getMovies: getMovies,
		getYears: getYears,
		getGenresCount: getGenresCount,
		getGenresRating: getGenresRating
	}
}


function getMovies(rows = 20, page = 1, genre, name, sorting){
	var conditions = [];
	if (genre){
		conditions.push(`genre ~*'${genre}'`);
	}
	if(name){
		conditions.push(`name ~*'${name}'`);
	}
	if (!sorting || sorting.toLowerCase()!="desc" && sorting.toLowerCase()!="asc"){
		sorting = "desc";
	}
	var query = "SELECT * FROM top250 ";
	if (conditions.length){
		query += `WHERE ${conditions.join(" AND ")}`;
	}
	query +=` ORDER BY rating ${sorting} LIMIT ${rows} OFFSET ${rows*(page-1)}`;
	return db.any(query);
}

function getYears(startYear, endYear){
	var conditions = [];
	if (startYear){
		conditions.push(`year>=${startYear}`);
	}
	if (endYear){
		conditions.push(`year<=${endYear}`);
	}
	var having = `HAVING ${conditions.join(" AND ")}`;
	var query = `SELECT year, avg(rating) FROM top250 GROUP BY year ${having} ORDER BY year`;
	return db.any(query);
}

function getGenresCount(genre){
	var having = genre ? `HAVING genre ~*'${genre}'`:"";
	var query = `SELECT genre, count(*) FROM top250 GROUP BY genre ${having}`;
	return db.any(query);
}

function getGenresRating(genre){
	var having = genre ? `HAVING genre ~*'${genre}'`:"";
	var query = `SELECT genre, avg(rating) FROM top250 GROUP BY genre ${having}`;
	return db.any(query);
}