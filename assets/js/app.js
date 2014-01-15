/**
	This file contains Models, Views, Controllers and also
	common initializations such as Socket.io

	All is stored in App object, and organized as follows:
	+       App.Models: Models Classes
	+  App.Controllers: Controller Classes
	+        App.Views: View Classes (Should be empty. Avoid putting view stuff here)
	+       App.Mixins: Utility methods to mix with models/controllers
	+            App.*: Instanced object of models, controllers, views...
 */

var App = {
	Models: {},
	Collections: {},
	Views: {},
	Mixins: {},
};

/*
	Mixin Function to help with Collection view controllers
	It keeps track of inserted views, with the view.model.id

	Call addView(view, id) to add a view
	+ If the view already exist, it will return false;
	+ else, return false

	Call removeView(id) to remove a view
	+ If the view exists, it will be removed and will return true
	+ else, return false

	Call getView(id) to get a view with id = id;
*/
// App.Mixins.CollectionList = {
// 	_views: {},
// 	addView: function(view, id){
// 	}
// }

/*
	Define Models
*/

// Team
App.Models.Team = Backbone.Model.extend({
	urlRoot: '/teams',
});

// Team Collection
App.Collections.Teams = Backbone.Collection.extend({
	model: App.Models.Team,
	url: '/teams/find',
});

/*
	Table Module Models
*/

// Score
App.Models.Score = Backbone.Model.extend({
	urlRoot: '/scores',
});

// Scores Collection
App.Collections.Scores = Backbone.Collection.extend({
	model: App.Models.Score,
	url: '/scores/find',
});

// Table
App.Models.Table = Backbone.Model.extend({
	urlRoot: '/tables',
	initialize: function(attributes){
		// Create a Backbone model
		attributes = attributes || {};
		this.scores = new App.Collections.Scores(attributes.scores || {tableId: this.id});
		delete attributes['scores'];
	    this.scores.url = '/scores/find?tableId=' + this.id;
	},
	parse: function(data, options) {
		// Delegate scores data to scores collection
		this.scores.reset(data.scores);
		delete data['scores'];

		return data;
	}
});

// Table Collection
App.Collections.Tables = Backbone.Collection.extend({
	model: App.Models.Table,
	url: '/tables/associated',
});

/*
	Configure Underscore to use tags {{}}
*/
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

// (function (io) {

//   // as soon as this file is loaded, connect automatically, 
//   var socket = io.connect();
//   if (typeof console !== 'undefined') {
//     log('Connecting to Sails.js...');
//   }

//   socket.on('connect', function socketConnected() {

//     // Listen for Comet messages from Sails
//     socket.on('message', function messageReceived(message) {

//       ///////////////////////////////////////////////////////////
//       // Replace the following with your own custom logic
//       // to run when a new message arrives from the Sails.js
//       // server.
//       ///////////////////////////////////////////////////////////
//       log('New comet message received :: ', message);
//       //////////////////////////////////////////////////////

//     });


//     ///////////////////////////////////////////////////////////
//     // Here's where you'll want to add any custom logic for
//     // when the browser establishes its socket connection to 
//     // the Sails.js server.
//     ///////////////////////////////////////////////////////////
//     log(
//         'Socket is now connected and globally accessible as `socket`.\n' + 
//         'e.g. to send a GET request to Sails, try \n' + 
//         '`socket.get("/", function (response) ' +
//         '{ console.log(response); })`'
//     );
//     ///////////////////////////////////////////////////////////


//   });


//   // Expose connected `socket` instance globally so that it's easy
//   // to experiment with from the browser console while prototyping.
//   window.socket = socket;


//   // Simple log function to keep the example simple
//   function log () {
//     if (typeof console !== 'undefined') {
//       console.log.apply(console, arguments);
//     }
//   }
  

// })(

//   // In case you're wrapping socket.io to prevent pollution of the global namespace,
//   // you can replace `window.io` with your own `io` here:
//   window.io

// );
