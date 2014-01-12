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

module.exports = {
	
	post: function (req, res, next) {
		return XEditable.handle(Group)(req, res, next);
	},

	index: function (req, res) {
		return res.view({
			questions: [{
				title: 'Freddy a presidente?',
				content: 'Últimamente Freddy se encuentra con más diplomacia.'
			}]
		});
	},

	teamlist: function(req, res){

		Team.find(afterFind);

		function afterFind(err, data){
			var teamList = [];
			var query = (req.param('query') || '').toLowerCase();

			for(k in data){
				team = data[k]
				var insert = 
				{
					id: team.id,
					text: data[k].name
				};

				if((insert.text || '').toLowerCase().indexOf(query) >= 0)
					teamList.push(insert);
			}

			res.send(teamList);
		}
	},

	// Mix in matches inside groups data
	associated: function(req, res, next){

		// Search for ID if requested
		options = {where: {}};
		var id = req.param('id');
		if(id) options.where.id = id;


		var finding = Group.find(options);

		finding.done(function afterFound(err, models) {
			if(!err)
				afterFindGroups(models);
		});

		// Data to be rendered
		var data = [];
		// Wait for parallel tasks to complete
		var completed = 0;

		// After finishing search
		function afterFindGroups(models){
			data = models;
			completed = 0;
			
			if(data.length <= 0)
				return finishRendering();

			// Load Matches for each Group and associates
			data.forEach(function(group){

				findAssociated(Match, 'groupId', group.id, function(matches){
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

			// console.log(data);
			finishRendering();
		}

		// Render JSON content
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

	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to GroupsController)
	 */
	_config: {
		menus: [
			{name: 'Groups', path: '/groups', order: 1}
		]
	}

	
};


// Find in Model, where 'key' is equal to id
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