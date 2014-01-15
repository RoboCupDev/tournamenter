/**
 * TableController
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

var async = require('async');

module.exports = {

	/*
		The object of this action is to create a full data
		of the table, with it's table data processed, ranked, [...]

		Associations with 'Scores' model will be done before computing
		the table contents, since Sails do not associate models together.

		Also, to associate every row with an existing team, so that
		we can use it's information in data.
	*/
	associated: function(req, res, next){
		// Search for ID if requested
		options = {where: {}};
		var id = req.param('id');
		if(id)
			options.where.id = id;

		// Query Table model, and call afterFindTables when done.
		var finding = Table
			.find(options)
			.done(afterFindTables)


		/*
			Start working with data
		*/
		var data = [];
		function afterFindTables(err, models){
			if(err || data.length <= 0)
				return finishRendering();

			// Create parallel tasks to associate each table with it's scores
			var findTasks = [];
			models.forEach(function(table){

				// Create and add parallel task to array
				var task = function(){
					associateTable(table, onAssociate);
				};
				findTasks.push(task);

			});

			// This function is called after every association is done
			function onAssociate(associated){
				data.push(associated);
			}

			// Execute parallel tasks
			async.parallel(findTasks, afterAssociateWithScores);
		}

		/*
			After scores are associated with the table, we can process it
		*/
		function afterAssociateWithScores(){
			console.log('associated!');
			console.log(data);
			finishRendering();
		}

		/*
			Render JSON content
		*/
		function finishRendering(){
			// If none object found with given id return error
			if(id && !data[0])
				return next();

			// If querying for id, then returns only the object
			if(id)
				data = data[0];

			// Render the json
			res.send(data);
		}

	}

	sandbox: function(req, res, next){
		res.send('works');
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to TableController)
	*/
	_config: {
		menus: [
			{name: 'Tables', path: '/tables/sandbox', order: 999},
		]		
	}

  
};
