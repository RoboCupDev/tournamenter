var assert = require('assert');
var Sails = require('sails');
var barrels = require('barrels');
var fixtures;

// Global before hook
before(function (done) {
	
	// Lift Sails with test database
	Sails.lift({
		log: {
			level: 'error'
		},
		adapters: {
			default: 'test'
		}
	}, function(err, sails) {
		if (err) return done(err);
	
		// Load fixtures
		barrels.populate(function(err) {
			done(err, sails);
		});
		
		// Save original objects in `fixtures` variable
		fixtures = barrels.objects;
	});
});

// Global after hook
after(function (done) {
	console.log();
	sails.lower(done);
});

// Here goes a module test
describe('Team', function() {

	describe('#list()', function() {
		it ('should list two teams', function() {
			Team.find(function(err, teams){
				assert(teams.length === 2);
			}); 
		});
		it('should find team by name', function(){
			Team.findOne({name: "XLS"}).done(function(err, team){
				assert(team.country === "SE");
			});
		});
	});

	describe('#create()', function(){
		it('should create a team easily', function(){
			Team.create({
				name: "Test Name",
				country: "UK"
			}).done(function(err, team){
				assert(team.name === "Test Name");
				assert(team.country === "UK");
			})
		});
	});

	describe('#list again', function(){
		it('should list a few more teams now', function(){
			Team.find(function(err, teams){
				assert(teams.length === 3);
			});
		});
	});
});
