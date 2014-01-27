/*
	This pageview module will be responsible for
	showing Table data.

	Process method will find the corresponding table
	data and fetch from it.
*/
module.exports = {
	type: 'pageview',

	initialize: function(sails){

	},

	process: function (page, next) {
		// page.data = {};
		next();
	}
}