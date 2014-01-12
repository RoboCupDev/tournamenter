/**
 * TeamsController
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
    
    index: function(req, res, next){

    	// Find teams
    	Team.find().done(finishRendering);

    	function finishRendering(err, collection){
    		if(err) return next('Failet to retrieve data');

			return res.view({
				path: req.route.path,
				teams: collection
			});
    	}
    },

	post: function (req, res, next) {
		return XEditable.handle(Team)(req, res, next);
	},  


	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to TeamsController)
	*/
	_config: {
		menus: [
			{name: 'Teams', path: '/teams', order: 0}
		]
	}

  
};
