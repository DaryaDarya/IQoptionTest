
module.exports = function(express, passport, userController, movieController){
	var apiRoutes = express.Router();  

	apiRoutes.post('/register', userController.register);

	apiRoutes.post('/authenticate', userController.login);

	apiRoutes.get('/getMovies', passport.authenticate('jwt', { session: false }), movieController.getMovies);

	apiRoutes.get('/getYears', passport.authenticate('jwt', { session: false }), movieController.getMovies);

	apiRoutes.get('/getGenresCount', passport.authenticate('jwt', { session: false }), movieController.getGenresCount);

	apiRoutes.get('/getGenresRating', passport.authenticate('jwt', { session: false }), movieController.getGenresRating);

	apiRoutes.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	return apiRoutes;
}