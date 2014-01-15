/**
 * Table
 *
 * @module      :: Model
 * @description :: This model represents a table with scores in the database
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var _ = require('lodash');

module.exports = {

	tableName: 'teams',

	attributes: {
		name: {
			type: 'string',
			defaultsTo: '[Table Name]'
		},

		/*
			This field, represents 'how many' scores will a single
			Team in the row have.
			
			The minimum is one, since a table with no scores doesn't make sense
		*/
		columns: {
			type: 'int',
			defaultsTo: 1,
			min: 1,
		},

		/*
			This affects how the 'Ranking' will be exposed.
			Wheater a 'lower' final score will be ranked better,
			or an 'higher' final score will be ranked better.
		*/
		sort: {
			type: 'string',
			in: ['asc', 'desc'],
		},


		/*
			evaluateMethod is what actualy 'computes' the final score
			for each row (team) in the table. There are some 'default' 
			function used to help, you also can 'write' your JavaScript 
			method for that.

			Available default methods: 
			+ sum    - sum all scores
			+ max    - the maximum value within scores
			+ min    - the minimum value within scores
			+ Anything else is threated as a literal function, with the following pattern:

			  	function(scores){
					// Literal method is inserted here
					// ...do calculation...
					// return final value
			  	}

			  	example:
			  	evaluateMethod = 
			  	"var finalScore = 0;
				for(var k in scores){
					finalScore += scores[k]*1;
				}
				return finalScore;";

		*/
		evaluateMethod: {
			type: 'string',
			defaultsTo: 'sum',
		}


	},

	beforeValidation: function (values, next) {
		// Validate 'evaluateMethod'



		return next();
	},

};

/*
	Default methods instantiation
*/
var evaluateMethods = {};

// Max method
evaluateMethods.max = function(scores){
	return _.max(scores, function(val) {
		return val*1;
	});
};

// Min method
evaluateMethods.min = function(scores){
	return _.min(scores, function(val) {
		return val*1;
	});
};

// Sum method
evaluateMethods.sum = function(scores){
	return _.reduce(scores, function(sum, num) {
		return sum + num*1;
	});
};

/*
	This will try to find a default method.
	If not succeed, will try to parse as a function.
	If not succeeded, will return null
*/
function getMethodFor(methodRaw){
	// Try to find in defaults
	if(evaluateMethods[methodRaw])
		return evaluateMethods[methodRaw];

	// Else, try to return a new function with it
	try{
		var method = Function('scores', method);
		return method;
	}catch(err){
	}
	return null;
}

/*
	Tests
*/
var testCase = {0: 100, 1: 213, '2':'5'};

var methods = [
	'sum',
	'min',
	'max',
	"var finalScore = 0;"+
	"for(var k in scores){"+
		"finalScore += scores[k]*1;"+
	"}"+
	"return finalScore;"
];

for(var m in methods)
	console.log(getMethodFor(methods[m])(testCase) + ' : '+ methods[m]);
// console.log(evaluateMethodGet('max')
