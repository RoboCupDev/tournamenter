/*
	Set backup interval for DB. By default, all models will be
	'backuped' in a single file.
	
	Options:
		interval: Time in minutes, between backups

		    path: Relative path to folder where backups will be saved, 

		  models: Models to save. A comma separated string of model names
		  		  If none, all models will be backuped
	
	Usage:
		node app --backup.interval=5 --backup.path=/desktop/backupFolder
		node app --backup.interval=10 --backup.path=../backupFolder --backup.models="Team,Group"
*/
exports.start = function(config) {
	var backup = _.defaults({}, config, {
		interval: 5,
		path: 'backup/',
		models: [],
	});

	// Split models string, and convert to array
	if(_.isString(backup.models))
		backup.models = backup.models.split(',');

	// Setup folder
	

	// Start interval

	console.log('\n$ Backup Settings:'.cyan +
		'\n\tinterval: '.green+(backup.interval+'s').red +
		'\n\tpath: '.green+(backup.path).red +
		'\n\tmodels: '.green+JSON.stringify(backup.models).red + 
		'\n');
}