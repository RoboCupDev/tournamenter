
/*
	Method called after data fetched from the
	database has this modules name in 'class' 
*/
exports.process = function (page, next) {
	// Do nothing
	page.randomData = Math.round(Math.random()*1000);
	next((page.randomData < 200 ? 'Process failed' : null), page);
};

// Public js files to inject in templates
exports.jsFilesToInclude = ['/groups/client.js'];