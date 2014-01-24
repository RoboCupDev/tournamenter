/*
	Loads all modules within a given root folder.

	The process of loading consists of:
	 + requiring module.
	 + Adding to modu
*/

var sails = require('sails');
var express = require('sails/node_modules/express');
var _ = require('lodash');
var fs = require('fs');

module.exports = {

	/*
		Global variable to keep instaled modules

		MODULES - All modules loaded
		'pageview': {
			<moduleName>: <module>,
			<moduleName>: <module>,
		}
	*/
	modules: {},

	/*
		Global variable to keep modules grouped by type

		TYPES - Modules separated by type
		{
			'default': {
				<moduleName>: <module>,
			}
			'pageview': {
				<moduleName>: <module>,
				<moduleName>: <module>,
			}
		}
	*/
	types: {},

	/*
		Use this method to find a specific module, or
		get the entire group of modules of the same type
	*/
	get: function(type, moduleName){
		var types = this.types[type];
		// No type set, or type doesn't exists
		if(!type || !types)
			return null

		// type set, return module if moduleName set
		if(moduleName)
			return types[moduleName];

		// Return the entire type
		return types;
	},

	load: function(root){

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
		for(var moduleName in moduleDirs){
			var modulePath = moduleDirs[moduleName];

			// Install module
			this.install(moduleName, modulePath);
		}

	},

	/*
		Install a given module with the given path
	*/
	install: function(moduleName, modulePath){

		var module = null;

		try{
			module = require(modulePath);
		}catch(e){
			console.info('Could not require module: '.red + moduleName + ' at '.cyan + module);
			return;
		}
	
		// Register module
		var type = (module.type ? module.type : 'default');

		this.modules[moduleName] = module;

		// If first type this type is added, create an empty object
		if(!this.types[type])
			this.types[type] = {};
		this.types[type][moduleName] = module;

		// Serve public assets under 'public' directory, if exist
		var publicPath = modulePath + '/public';
		if(fs.lstatSync(publicPath).isDirectory()){
			sails.express.app.use(express.static(publicPath));
		}
		// sails.express.app.use(express['static'](publicPath));
		// sails.express.app.use(function(req, res, next){
		// 	console.log('AQUI!'.red);
		// 	next();
		// });

		// Initialize module
		if(module.initialize)
			module.initialize();

		// Iterate through files in the current directory
		// files.forEach(function(file) {
		// app.use('/static', express.static(__dirname + '/public'));
	}

}