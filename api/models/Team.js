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
		name: 'string',
		category: 'string',

		country: 'string',
		state: 'string',
		city: 'string',

		active: 'boolean',
	}

};
