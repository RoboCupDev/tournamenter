/*
	This module serves the purpose of RoboCup, to sync View's data to Parse.com server.

*/
var _ = require('lodash');
var argv = require('optimist').argv;
var Parse = require('kaiseki');

var TAG = 'ParseSyncer ::'.cyan;

var ParseSyncer = {

	/*
		Defaults
	*/
	config: {
		// Parse configuration
		APP_ID: null,
		REST_API_ID: null,

		// Category (like 'rescue.a.primary') to save to in Parse.com
		category: null,

		// For Login
		username: null,
		password: null,

		// false to force login every time, or a number (in secconds) to expirte
		loginExpiration: false,
		// Update interval (in seconds)
		interval: 10,
		initializeDelay: 0,

	},

	/*
		Checks passed args and
	*/
	initialize: function (sails, config) {
		var self = this;

		// Skip this module. It's not initialized
		if(!argv.ParseSyncer) return;

		// Overrides configs with enviroment passed args
		_.extend(self.config, argv.ParseSyncer, config);
		console.log(argv.ParseSyncer);

		console.log(TAG, 'Init with category:'.grey, self.config.category.green);

		// Give some time to app. Let's delay a bit to initialize and start syncing
		setTimeout(function(){
			self.postInitialize();
		}, self.config.initializeDelay);
	},

	/*
		What it does:
			+ Initialize Parse
			+ Start interval to sync data
	*/
	parse: null,
	interval: null,
	postInitialize: function(next){
		var self = this;

		console.log(TAG, 'postInitialize'.grey);

		// Create Parse object
		if(!self.parse) self.parse = new Parse(self.config.APP_ID, self.config.REST_API_ID);

		// Start interval for sync
		// Clear and re-set interval
		self.interval = clearInterval(self.interval);
		self.interval = setInterval(doSync, self.config.interval * 1000);
		setTimeout(doSync, 0);
		function doSync(){
			self.sync();
		}
	},

	/*
		Logins and runs callback
	*/
	sessionToken: null,
	lastLogin: 0,
	login: function(next){
		var self = this;

		// If not expired and a sessionToken is set, then skip login
		var expired = self.lastLogin + self.config.loginExpiration < (new Date()).getTime();
		if(!expired && self.sessionToken){
			console.log(TAG, 'Login skiped. Already logged in'.grey);
			return next(null);
		}

		// Logs in and waits for callback
		self.parse.loginUser(self.config.username, self.config.password, afterLogin);

		function afterLogin(err, res, body, success){
			if(err || !success) return next(body.error);

			// Save lastLogin timestamp as current time
			self.lastLogin = (new Date()).getTime();

			// Save token for later use
			self.sessionToken = body.sessionToken;
			console.log(TAG, 'Logged in:'.grey, self.sessionToken.green);
			next(null);
		}
	},

	/*
		Save data to parse field and run callback
	*/
	save: function(data, next){

	},

	/*

	*/

	/*
		Fetches data, login (if needed), and save to parse
	*/
	sync: function(next){
		var self = this;

		self.login(function(err){
			if(err) console.error(TAG, 'Failed to Login'.red, err.grey);

		});
	},


}

module.exports = ParseSyncer;