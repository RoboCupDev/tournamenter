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
		*/
		category: {
			type: 'string',
			defaultsTo: 'default'
		},
	}

};
