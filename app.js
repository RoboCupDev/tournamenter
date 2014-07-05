
/*
	This snippet allows the app to be runned from
	another directory without concerns to Sails.
*/
process.chdir(__dirname);

var sails = require('sails');
var colors = require('colors');
var _ = require('lodash');
var argv = require('optimist').argv;

console.info(argv);

/*
	Set a password for login purposes. If none is set, will be public

	Usege:
		node app --env.PASSWORD 123456
*/
if(argv.env && argv.env.PASSWORD){
	var password = argv.env.PASSWORD;
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

/*
	Set vars in env object to process.env 
*/
if(argv.env){
	for(var k in argv.env)
		process.env[k] = argv.env[k];
	// _.extend(process.env, argv.env);
}


/*
	Set process name as the APP_NAME
*/
process.title = 'node | ' + (
	process.env.APP_NAME ||
	process.env.PORT || '1337');

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
