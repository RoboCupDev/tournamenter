/**
 * GroupsController
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

 var _ = require('lodash');

var GroupController = module.exports = {
	
	post: function (req, res, next) {
		return XEditable.handle(Group)(req, res, next);
	},

	manage: function (req, res) {
		return res.view({
			path: req.route.path
		});
	},

	// Mix in matches inside groups data
	associated: function(req, res, next){

		// Search for ID if requested
		var id = req.param('id');

		findAssociated(id, finishRendering);

		// Render JSON content
		function finishRendering(data){
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

	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to GroupsController)
	 */
	_config: {
		menus: [
			{name: 'Groups', path: '/groups/manage', order: 1}
		]
	},

	_findAssociated: findAssociated

};

/*
	The objective of this PRIVATE method is to create a full data
	of the Group, with it's matches, teams, and soccer-tables generated
*/
function findAssociated(id, next){
	options = {where: {}};
	if(id) options.where.id = id;
	var finding = Group.find(options).sort('id');;

	// Data to be rendered
	var data = [];
	// Wait for parallel tasks to complete
	var completed = 0;

	finding.done(function afterFound(err, models) {
		if(!err)
			afterFindGroups(models);
	});


	// After finishing search
	function afterFindGroups(models){
		data = models;
		completed = 0;
		
		if(data.length <= 0)
			return next([]);

		// Load Matches for each Group and associates
		data.forEach(function(group){

			Match.find()
				.where({'groupId': group.id})
				.sort('day ASC')
				.sort('hour ASC')
				.sort('id')
				.then(function(matches){
				// Associate matches with groups
				group.matches = matches;

				// Compute scoring table for each group
				// (must be computed AFTER associating matches with it)
				group.table = group.table();

				// Callback
				loadedModel();
			});
		});
	}

	// Function needed to wait for all queries to finish
	function loadedModel(){
		completed++;

		if(completed >= data.length)
			associateTeams();
	}

	// Load Teams
	function associateTeams(){
		Team.find(afterFindTeams);
	}

	// Associate keys with teams
	function afterFindTeams(err, teamData){
		var teamList = {};

		// Load teams and assing it's key as it's id
		teamData.forEach(function(team){
			teamList[team.id] = team;
		});

		// Includes team object in 'table' data
		data.forEach(function(group){

			// console.log(group);
			// Go trough all the table adding key 'team' with team data
			_.forEach(group.table, function(row){
				row.team = teamList[row.teamId];
			});
		});

		// Includes team object in 'match' data
		data.forEach(function(group){

			// console.log(group);
			// Go trough all the table adding key 'team' with team data
			_.forEach(group.matches, function(row){
				row.teamA = teamList[row.teamAId];
				row.teamB = teamList[row.teamBId];
			});
		});

		next(data);
	}
}