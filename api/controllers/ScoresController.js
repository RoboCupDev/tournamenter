/**
* ScoresController
*
* @module      :: Controller
* @description	:: A set of functions called `actions`.
*
*                 Actions contain code telling Sails how to respond to a certain type of request.
*                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
*
*                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
*                 and/or override them with custom routes (`config/routes.js`)
*
*                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
*
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/

module.exports = {


	/*
		Updates a single score on a given Score id
	*/
	updateScore: function (req, res, next) {
		var scoreId = req.param('id', null);
		var scoreNumber = req.param('number', null);
		var scoreData = req.param('data', null);
		var scoreValue = req.param('value', null);

		if(	scoreId === null ||
			scoreNumber === null ||
			scoreData === null ||
			scoreValue === null){
			return next('Missing properties');
		}

		// Find the score
    	Scores.findOne(scoreId).done(function (err, score){
	    	if(err) return next('Failed to get score: ' + err);

	    	if(!score)
	    		return next('Score not found');

	    	var update = {
	    		scores: score.scores || {}
	    	};

	    	update.scores[scoreNumber] = {
	    		value: parseInt(scoreValue),
	    		data: scoreData,
	    	};

	    	// console.log(update);
	    	// next();
	    	Scores.update(score.id, update, function (err, model){
	    		if(err) return next(err);
	    		console.log(model);
	    		return res.json(model && model[0]);
	    	});
    	});
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to ScoresController)
	*/
	_config: {}


};
