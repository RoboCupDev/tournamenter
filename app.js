
var sails = require('sails');
var colors = require('colors');
var _ = require('lodash');
var argv = require('optimist').argv;

/*
	Set a password for login purposes. If none is set, will be public

	Usege:
		node app --password 123456
		node app --pw 123456
*/
if(argv.password || argv.pw){
	var password = argv.password || argv.pw;
	console.log('\n$ Using Password: '.cyan + password);
}

/*
	Set a custom adapter for current Node process

	Usage:
		node app --adapter.module "sails-disk"
		node app --adapter.module "sails-mongo" --adapter.url "localhost:12702/test"
*/
if(argv.adapter){
	var adapter = argv.adapter;

	console.log('\n$ Using Custom Adapter: '.cyan + adapter.module);

	// Inject adapter into config files
	var adapterConfig = require('./config/adapters.js');
	adapterConfig.adapters.default = adapter;
}

// Start sails and pass it command line arguments
sails.lift(argv, function (sails) {

	/*
		Initialize Backuper.
	*/
	if(argv.backup){
		Backup.start(argv.backup);
		setTimeout(Backup.save, 2000);
	}
	
});
