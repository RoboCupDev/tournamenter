var assert = require('assert');
var Sails = require('sails');
var barrels = require('barrels');
var _ = require('lodash');
var supertest = require("supertest");
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

/*
	Test team module
*/
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


/*
	Test View module and modules
*/

describe('View Controller', function() {

	// Try to find all
	describe('/views/associated', function() {

		var res = null;

		before(function(done){
			supertest(sails.express.app)
				.get('/views/associated')
				.end(function(err, _res){
					res = _res;
					done();
				});
		});

		it ('should exist', function () {
			assert(res.status == 200);
		});

		it ('should be an array', function () {
			assert(_.isArray(res.body));
		});

		it ('should have a few registers', function () {
			assert(res.body.length > 1);
		});

		it ('should contain module`s extra data on pages', function () {
			assert(res.body[0].pages[0].test);
		});
	});

	// Try to find one
	describe('/views/associated/:id', function() {

		var res = null;

		before(function(done){
			supertest(sails.express.app)
				.get('/views/associated/2')
				.end(function(err, _res){
					res = _res;
					done();
				});
		});

		it ('should be an object', function () {
			assert(_.isObject(res.body));
		});

		it ('should have a title', function () {
			assert(res.body.title == 'two');
		});

		it ('should have extra hash data on pages', function () {
			res.body.pages.forEach(function(page){
				assert(page.test == page.still*10);
			});
		});
	});

});
