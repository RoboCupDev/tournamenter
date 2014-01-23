/**
 * View
 *
 * @module      :: Model
 * @description :: Represent a view (a collection of pages, with options)
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	tableName: 'views',

	attributes: {

		/*
			The title of this view
			('Rescue B', 'My Tournament', ...)
		*/
		title: {
			type: 'string',
			defaultsTo: '[View Title]'
		},

		/*
			Template page to be used.
			The logic is:
				Search for template inside '/views/view/<template>.ejs'
		*/
		template: {
			type: 'string',
			defaultsTo: 'default'
		},

		/*
			This is the array that contains all pages to be shown
			on the client. It's structure should follow the following:

			pages: [
				{
					module: string,
					still: int,
					enabled: boolean,
					options: {},
					data: {},
				},
				{...}
			]
			
			MODULE:
				The module associated to it. In the server side,
				it's responsable for modifying data before responding
				to requests.
				
				On the Client side, it's responsable for rendering
				it's views and configurations.

				It will be loaded from '/api/view_modules/<module>/server.js'

			STILL:
				still is the time (in ms) to be still on the page.
				After this time, another page will be shown...

			ENABLED:
				If the view will be shown or not
			
			OPTIONS:
				Saved options about this view. This is requrired by the module
				only, and is not essential.

			DATA:
				A reserved place to return data. Example:
				If your module needs to associate things with some options, and
				return information about it, return in the 'data' hash.

		*/
		pages: {
			type: 'array',
			defaultsTo: []
		},
	},

};
