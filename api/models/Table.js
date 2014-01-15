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
			Scores data are inserted in another table, and linked with this
			with the tableId field.
			In order to compute the table data, it's needed to 'associate'
			this object with the found with 'Scores' model, and set on this object
			with key 'scores'.

			Ex:
			Scores.find({tableId: 'id'}).done(function(collection){
				table.scores = collection;
			});

			var tableData = Scores.computeTable();
		*/

		/*
			Just to help views, disabling/enabling some actions
		*/
		locked: {
			type: 'string',
			in: ['yes', 'no'],
			defaultsTo: 'no',
		},

		
		/*
			Name for 'Rank' heading
		*/
		headerRank: {
			type: 'string',
			defaultsTo: 'Rank',
		},
		/*
			Name for 'Team' heading
		*/
		headerTeam: {
			type: 'string',
			defaultsTo: 'Team',
		},
		/*
			Prepended value for scores.
			in case this equals to 'Score', headers will be generated as follows:
				'Score 1', 'Score 2', 'Score 3'
		*/
		headerScore: {
			type: 'string',
			defaultsTo: 'Score',
		},
		/*
			Name for 'Final' score heading
		*/
		headerFinal: {
			type: 'string',
			defaultsTo: 'Final',
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
			defaultsTo: 'desc',
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
		},

		/*
			This method will generate the table with all it's fields.

			return data will be on the following format:

			{
				headers: {'rank': 'Rank', 'team': 'Team', 'score.1': 'Score 1', 'final': 'Final'},
				data: [
					{'rank': 1, 'team':Team...'[,..] ],
					{'rank': 2, 'team':Team...'[,..] ],
					[...]
				],
			}

		*/
		table: generateTable,


	},

	beforeValidation: function (values, next) {
		// Validate 'evaluateMethod'
		if(!getMethodFor(values.evaluateMethod))
			return next('evaluateMethod is not working');

		return next();
	},

};

/*
	Generates the table
*/
function generateTable(){
	// Save to allow in function referencte
	var table = table;
	/*
		Create headers array
		Rank | Team | Score 1 | Score N | Final
	*/

	// Order is important
	var headers = {
		rank: table.headerRank,
		team: table.headerTeam,
	};
	// Create Scores header
	for(var i = 1; i <= table.columns*1; i++)
		header['score.'+(i)] = table.headerScore + i;

	// Add last header (Final score)
	headers['final'] = table.headerFinal;

	/*
		Create data table
	*/
	var data = [];
	var scores = table.scores;

	// Just warn (DEBUG mode...)
	if(!scores)
		console.log('Table is empty!');

	_(scores).forEach(function(score){
		
	});



}

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
	If not succeeded, will return null.

	In sum: Will return a function if succeeds, otherwise, 'null'
*/
function getMethodFor(methodRaw){
	// Try to find in defaults
	if(evaluateMethods[methodRaw])
		return evaluateMethods[methodRaw];

	// Else, try to return a new function with it
	try{
		var method = Function('scores', methodRaw);
		return method;
	}catch(err){
	}
	return null;
}

/*
	Tests
*/
// var testCase = {0: 100, 1: 213, '2':'5'};

// var methods = [
// 	'sum',
// 	'min',
// 	'max',
// 	"var finalScore = 0;"+
// 	"for(var k in scores){"+
// 		"finalScore += scores[k]*1;"+
// 	"}"+
// 	"return finalScore;"
// ];

// for(var m in methods)
// 	console.log(getMethodFor(methods[m])(testCase) + ' : '+ methods[m]);
// console.log(evaluateMethodGet('max')
