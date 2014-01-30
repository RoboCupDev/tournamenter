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
	Util: {},
	
	PageViews: {},
};
window.App = App;

/*
	Mixin to show modal and confirm action

	  message: Message to place inside the modal
	allowSkip: If the checkbox can skip this action
	     next: callback for the result
*/
App.Mixins.confirmAction = function(message, allowSkip, next){
	// Find modal
	$modal = $('#modal-destroy');
	
	// Check if user dismissed warning
	if(allowSkip && $modal.find('.btn-dismiss').is(':checked'))
		return confirmed();

	$modal.find('.dont-remember').toggleClass('hide', !allowSkip);

	// Change message
	message = message || 'Are you certain about this action?';
	$modal.find('.modal-body').text(message);

	// Show Modal
	$modal.modal('show');

	// Get callback on the confirm-delete button
	$modal.find('.btn-confirm-destroy').unbind('click').click(confirmed);
	function confirmed(){
		// Hide modal and callback
		$modal.modal('hide');
		return next();
	};
}


/*
	Mixin to help configuring XEditable fields, for in place editions

	It is a custom editInPlace, used to callback when changed.

	It will call 'next' whenever a change is made to the field. You are
	supposed to call the callback method on it, and pass erro as param.
*/
App.Mixins.editInPlaceCustom = function($field, opts, next){
	// Filter and adds default behavior
	opts = opts || {};

	var defaults = {
		type: 'text',
		mode: 'inline',
		// unsavedclass: '',
		showbuttons: false,
		url: function(params) {
			var d = new $.Deferred;
			d.promise();

			next(params, returnHere);

			function returnHere(err){
				if(err)
					return d.reject(err);
				return d.resolve();
			}

        	return d;
	    }
	};

	// Apply options to editable
	$field.editable(_.defaults(opts, defaults));
	return this;
};

/*
	Mixin to help configuring XEditable fields, for in place editions

	It configures the XEditable field by default, to save to the given
	model, instead of using it's own method to send by ajax.

	Also, leave some defaults to facilitate configuration.

	Usage: editInPlace(ModelToSave, jQueryField, )
*/
App.Mixins.editInPlace = function(modelToSave, jQueryField, opts, saveOpts){
	App.Mixins.editInPlaceCustom(jQueryField, opts, function cb(params, next){
		// This is the default backbone save options object
		saveOpts = _.defaults({
			patch: true,
			wait: true,
			success: function(){
				next();
			},
			error: function(response, xhr) {
				next('Something went wrong...');
			}
		}, saveOpts);

		var toSave = {};
		toSave[params.name] = params.value;

    	modelToSave.save(toSave, saveOpts);
	});

	return this;
};

/*
	Creates a table with the given headers, content and jQuery root object
*/
App.Mixins.createTable = function(headers, content, root){
	// Try recycling table if set
	var $table = (root ? root : $('<table>'));

	// Make it visible and remove id
	$table.removeClass('hide');
	$table.removeAttr('id');

	// Creates thead
	$thead = $('<thead>');

	// Add Headers
	var headersCount = 0;
	$tr = $('<tr>');
	$thead.append($tr);

	for(var k in headers){
		$tr.append($('<th>').text(headers[k]));
		headersCount++;
	}

	// Creates tbody
	$tbody = $('<tbody>');
	
	// Go trough all contents and adds to table
	for(var c in content){
		var rowData = content[c];
		// console.log(rowData);
		var $row = $('<tr>');

		// Go through headers and append to table
		for(var k in headers){
			var value = rowData[k];
			$row.append($('<td>').text(value));
		}

		$tbody.append($row);
	}

	// Show 'nothing on table' If there is no data
	if(content.length <= 0){
		var $row = $('<tr>');
		$row.append($('<td>').addClass('text-center').attr('colspan', ''+headersCount).text('No data in table'));
		$tbody.append($row);
	}

	$table.empty();
	$table.append($thead);
	$table.append($tbody);

	return $table;
}


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
	=======================================
					MODELS
	=======================================
*/


// Score
App.Models.Score = Backbone.Model.extend({
	urlRoot: '/scores',
});

// Scores Collection
App.Collections.Scores = Backbone.Collection.extend({
	model: App.Models.Score,
	comparator: 'rank',
	url: '/scores/find',
});

// Table
App.Models.Table = Backbone.Model.extend({
	urlRoot: '/tables',
	// initialize: function(attributes){
	// 	// Create a Backbone model
	// 	attributes = attributes || {};
	// 	this.scores = new App.Collections.Scores(attributes.scores || []);

	// 	// Save this object inside the scores collection, allowing access from it
	// 	this.scores.table = this;
	//     this.scores.url = '/scores/find?tableId=' + this.id;
	// 	delete attributes['scores'];
	// },
	// parse: function(data, options) {
	// 	// Delegate scores data to scores collection
	// 	if(data.scores){
	// 		this.scores.reset(data.scores);
	// 		delete data['scores'];
	// 	}

	// 	return data;
	// },

	constructor: function(){
		var self = this;
		console.log('Init Table');

		// Create a collection of pages and save itself in it
		this.scores = new App.Collections.Scores();
		this.scores.view = this;

		// Save this object inside the scores collection, allowing access from it
		this.scores.table = this;
	    this.scores.url = '/scores/find?tableId=' + this.id;

		Backbone.Model.apply(this, arguments);
	},

	initialize: function(attributes){
		if(attributes && attributes.scores)
			this.scores.reset(attributes.scores)
	},

	parse: function(data, options) {
		// Delegate scores data to scores collection
		if(data.scores){
			this.scores.reset(data.scores);
			data.scores = this.scores;
		}
		return data;
	},

	toJSON: function(){
		var returnObj = _.clone(this.attributes);
		returnObj.scores = this.scores.toJSON();
		return returnObj;
	},
});

// Table Collection
App.Collections.Tables = Backbone.Collection.extend({
	model: App.Models.Table,
	url: '/tables/associated',
});

// Page Model
App.Models.Page = Backbone.Model.extend({
	save: function(attrs, opts){
		this.set(attrs);
		this.collection.view.save(null, opts);
	},
	// Override sync, since this model is nested to a View model
	sync: function(){},
});

// Pages Collection
App.Collections.Pages = Backbone.Collection.extend({
	model: App.Models.Page,
	// Override sync, since this model is nested to a View model
	sync: function(){},
});

// View Model
App.Models.View = Backbone.Model.extend({
	urlRoot: '/views/',

	constructor: function(){
		var self = this;
		console.log('Init View');

		// Create a collection of pages and save itself in it
		this.pages = new App.Collections.Pages();
		this.pages.view = this;

		// Delegate save action to this
		this.listenTo(this.pages, 'change', function(){
			self.trigger('change:pages');
		});	

		Backbone.Model.apply(this, arguments);
	},

	initialize: function(attributes){
		if(attributes && attributes.pages)
			this.pages.reset(attributes.pages);
	},

	parse: function(data, options) {
		// Delegate scores data to scores collection
		if(data.pages){
			this.pages.reset(data.pages);
			data.pages = this.pages;
		}
		return data;
	},

	toJSON: function(){
		var returnObj = _.clone(this.attributes);
		returnObj.pages = this.pages.toJSON();
		return returnObj;
	},
});

// Views Collection
App.Collections.Views = Backbone.Collection.extend({
	model: App.Models.View,
	url: '/views/',
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
