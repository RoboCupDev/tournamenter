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
			.done(associateScores)


		/*
			Associate Scores data with Table data in key 'scores'
		*/
		var data;
		function associateScores(err, models){
			// Empy array (adjusts variable scope)
			data = [];

			if(err || models.length <= 0)
				return finishRendering();

			// Create parallel tasks to associate each table with it's scores
			var findTasks = [];
			models.forEach(function(table){

				// Create and add parallel task to array
				var task = function(cb){
					// Creates another wrapper function to return null on first param
					// (it's required, since async work this way)
					associateTable(table, function returnToAsync(associated){
						cb(null, associated);
					});
				};
				findTasks.push(task);

			});

			// Execute parallel tasks
			async.parallel(findTasks, afterAssociateScores);
		}

		/*
			This function is called after all associations finished
		*/
		function afterAssociateScores(err, results){
			// Get response from callbacks and set as data array
			data = results;

			// Call next step
			processTables();
		}

		/*
			After scores are associated with the table, we can process it
		*/
		function processTables(){
			// Now we go through all Tables and call the method table on it
			_.invoke(data, 'table');
			
			// Now we associate team's data
			associateTeams();
		}

		/*
			Associate every Scores in table, inserting a 'team' hash with team data
			(but first, we need to get a list of the teams)
		*/
		var teams;
		function associateTeams(){

			// Reset teams
			teams = {};

			// Helper method used to save team data inside each table row
			function associateWithTeams(teams, tableModel){
				// Go through all team rows inside the table, and add's a team index
				_.forEach(tableModel.table.data, function(teamRow){
					teamRow['team'] = teams[teamRow.id] || {};
				});
			}

			// Find teams
			Team.find().done(function(err, collection){
				// Turns the id as the key to access it
				// ( o(1) when accessing it )
				for(var k in collection){
					var team = collection[k];
					teams[team.id] = team;
				}

				afterFindTeams();
			});

			function afterFindTeams(){
				// Go through all tables and call association method
				_.forEach(data, function(tableModel){
					associateWithTeams(teams, tableModel);
				});

				// Finish rendering
				finishRendering();
			}
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

	},

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


/*
	This method receives one 'Table' object and
	insert key 'scores' inside it.
*/
function associateTable(model, next){
	// Perform search in Scores, where tableId equals to model.id and callback
	findAssociated(Scores, 'tableId', model.id, afterFind);

	function afterFind(models){
		model.scores = models;
		return next(model);
	}
}

/*
	Find in Model, where 'key' is equal to id
*/
function findAssociated(Model, key, id, cb){
	// Create where clause
	var options = {
		where: {}
	};
	options.where[key] = id;

	var finding = Model.find(options);

	finding.done(function afterFound(err, models) {
		if(cb)
			cb(models);
	});
}