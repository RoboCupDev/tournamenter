/**
 * Team
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	tableName: 'teams',

	attributes: {
		name: {
			type: 'string',
			defaultsTo: '[Team Name]'
		},
		country: {
			type: 'string',
			defaultsTo: '?'
		},

		/*
			This property can be used to sync data outside of this system.
			It's not required, and in fact, not used inside this system.

			The idea is that all teams will be stored in a internet database,
			and that each league will 'fetch' a single category from that
			database (let's say: 'junior.rescueb').
			This attribute will come with the team model, but will not be used.

			It's nice to keep it even not using...

		*/
		category: {
			type: 'string',
			defaultsTo: 'default'
		},
	}

};
