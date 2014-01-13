/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var _ = require('lodash');

module.exports.bootstrap = function (cb) {

	/*
		******************************************
		ADD HERE ALL THE TOP MENUS TO BE RENDERED
		******************************************
	*/
	var menus = [

	];

	// Search for menus in controllers and merge with menus
	menus = menus.concat(findMenusInControllers());

	// Get Express app instance
	var express = sails.express.app;

	// Locals that are constant
	var constantLocals = {
		_projectName: sails.config.appName,
		_rootUrl: '',
		_menus: menus,
		sideMenu: false,
		path: '/',
		_version: require('../package.json').version
	}

	// Sort menus
	constantLocals._menus = _.sortBy(menus, 'order');

	// Add to express
	express.locals(constantLocals);

	// It's very important to trigger this callack method when you are finished 
	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
	cb();
};


/*
	This method will find all Controllers that have 'menus' array inside
	it's '_config' object, and return all mixed toguether
*/
function findMenusInControllers(){

	// Menus array that will hold all menus from controllers
	var menus = [];

	// Search in every controller
	_.each(sails.controllers, function(controller){
		// Is there a key 'menus' inside '_config'
		if(controller._config && controller._config.menus){

			var menusToAdd = controller._config.menus;

			// Adds menus in controller to menus
			for(var k in menusToAdd)
				menus.push(menusToAdd[k]);
		}
	});

	return menus;
}
