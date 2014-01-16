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

	It configures the XEditable field by default, to save to the given
	model, instead of using it's own method to send by ajax.

	Also, leave some defaults to facilitate configuration.

	Usage: editInPlace(ModelToSave, jQueryField, )
*/
App.Mixins.editInPlace = function(modelToSave, jQueryField, opts, saveOpts){
	// Filter and adds default behavior
	opts = opts || {};

	var defaults = {
		type: 'text',
		mode: 'inline',
		unsavedclass: '',
		showbuttons: false,
		success: function(response, newValue) {
			// Finds key name
			var name = opts.name || jQueryField.attr('data-name') || null;
			// If found, then save it
			if(name){
				saveOpts = saveOpts || {silent: true, patch: true};
	        	modelToSave.save(name, newValue, saveOpts);
	        }
	    }
	};

	// Apply options to editable
	jQueryField.editable(_.defaults(opts, defaults));
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
	},
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
