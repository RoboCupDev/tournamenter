/**
 * ViewController
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
 var async = require('async');

module.exports = {
	
	associated: function(req, res, next){

		var id = req.param('id');

		// Create query
		if(id) query = {id: id};
		else   query = {};

		View.find(query, function(err, models){
			if(err) return next(err);


			processView(models, afterProcessViews);
		});

		function afterProcessViews(err, views){
			if(err) return next(err);

			// 404 if not found
			if(id && !views[0])
				return next(404);

			var toRender = views;
			if(id) toRender = views[0];

			res.json(toRender);
		}
	},

	manage: function(req, res, next){
		res.view({
			path: req.route.path,
		});
	},


	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to GroupsController)
	 */
	_config: {
		menus: [
			{name: 'Views', path: '/views/manage', order: 5}
		]
	}	
};

/*
	This method receives a view, and will modify it to correspond
	to the 'module' choosen.

	What it does:
		+ if it's array, iterate the same function and return as array
		+ For each page contained in the view, call processPage()


	We get the model like this:
		{
		id: 2, title: "title", template: "default", [...],
		pages:
			[
				{
					module: "groups",
					still: "1000",
					options: { },
					// ----------- INSERTED FIELDS BY MODULE \/
					data: {hash: [...]},
					info: '......',
					[...]
				}
			]
		}

		Basicaly, what we have to do is to call for every page inside 'view.pages',
		the method 'process' of the module choosen.

		To do that, we first iterate trough Views array, calling processPage on it's pages
*/
function processView(view, next){
	view = _.clone(view);

	// If it's an array, create parallel tasks
	if(_.isArray(view)){
		var tasks = [];

		view.forEach(function(view){
			// Create async task
			tasks.push(function(next){
				// Call this method egain, but with only one view
				processView(view, next);
			});
		});

		// Run tasks
		return async.parallel(tasks, next);
	}


	/*
		
		Now we delegate process action to function processPage()
	*/

	var pages = view.pages || [];

	processPage(pages, function(err, newPages){
		if(err)
			sails.log.error('processView failed');

		// Set view pages
		view.pages = newPages;
		return next(err, view);
	});
}

/*
	This will run the 'module' with the self page, and return
	the value of the list of the pages.

	Assign an array to receive an array of pages.

	What it does:
		+ Call sails.ViewModules[<page.module>].process(page)
		  (it's installed under sails on bootstrap.js)
		+ When it complete, return next(err, modifiedPage);
*/
function processPage(page, next){

	page = _.clone(page);

	// If it's an array, create parallel tasks
	if(_.isArray(page)){
		var tasks = [];

		page.forEach(function(page){
			// Create async task
			tasks.push(function(next){
				// Call this method egain, but with only one view
				processPage(page, next);
			});
		});

		// Run tasks
		return async.parallel(tasks, next);
	}

	// Get module from page
	var moduleName = page.module;

	// Check if module is set
	if(!moduleName){
		sails.log.info('Module not declared. skiping');
		return next(null, page);
	}

	// Check if module is installed
	if(!sails.ViewModules[moduleName]){
		sails.log.info('Module <'+moduleName+'> is required but not installed. skiping');
		return next(null, page);
	}

	// Get module
	var module = sails.ViewModules[moduleName];

	// Check if 'process' method doesn't exist in module
	if(!_.isFunction(module.process)){
		sails.log.info('Module <'+moduleName+'> does not have .process() method');
		return next(null, page);
	}

	// Process single page
	module.process(page, function(err, newPage){
		if(err)
			sails.log.error('process() exception on module: ' + (''+moduleName).cyan);

		return next(err, newPage);
	});
}