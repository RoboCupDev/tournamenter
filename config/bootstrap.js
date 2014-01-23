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
var express = require('express');
var fs = require('fs');

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

	// Sort menus and add to express
	constantLocals._menus = _.sortBy(menus, 'order');
	express.locals(constantLocals);

	/*
		Load View Modules from api/view_modules/
	*/
	sails.ViewModules = loadViewModules(__dirname + '/../api/view_modules');

	// It's very important to trigger this callack method when you are finished 
	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
	cb();
};

/*
	******************************************
	   VIEW MODULES LOADING AND INSTALATION
	******************************************
*/
function loadViewModules(root){

	var files = [];
	try {
		// Save into files
		files = fs.readdirSync(root);
	} catch (e) {
		// If failed, stop here
		console.info('Directory not found: '.red + root);
		return {};
	}

	// Find directories only
	var moduleDirs = {};
	files.forEach(function(file){
		var dirPath = root + '/' + file;

		// Add module and path if it's a directory
		if(fs.statSync(dirPath).isDirectory())
			moduleDirs[file] = dirPath;
	});

	// Instal modules
	var loadedModules = {};
	for(var moduleName in moduleDirs){
		var modulePath = moduleDirs[moduleName];

		// load server.js and add to loaded resources
		try{
			var module = require(modulePath);
			loadedModules[moduleName] = module;
		}catch(e){
			console.info('Could not require module: '.red + moduleName + ' at '.cyan + modulePath);
		}

		// Serve public assets under /<moduleName> namespace
		var publicPath = modulePath + '/public';
		var namespace = '/'+moduleName;
		sails.express.app.use(namespace, express.static(publicPath));
	}

	// Iterate through files in the current directory
	// files.forEach(function(file) {
	// app.use('/static', express.static(__dirname + '/public'));

	sails.log('View Modules Installed: '.green + (_(loadedModules).keys().join(',')).cyan);
	return loadedModules;
}

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
