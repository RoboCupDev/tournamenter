/**
 * Scores
 *
 * @module      :: Model
 * @description :: A representation of a single 'row' in a Table model
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	// Reference to Table model
  	tableId: {
  		type: 'string',
  		required: true
  	},

  	teamId: {
  		type: 'int'
  	},

  	/*
  		How data is stored in scores:
  		{
  			1: {value: 123, data: {}},
  			3: {value: 123, data: {}},
  			4: {value: 123, data: {}},
  			[...]
  		}
  	*/
  	scores: {
  		type: 'json',
  		defaultsTo: {}
  	}

    
  }

};
