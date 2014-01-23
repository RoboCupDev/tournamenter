
/*
	Simple test view-module
*/
exports.process = function (page, next) {
	// Inject test attrib
	page.test = page.still*10;

	next(null, page);
};

// Public js files to inject in templates
exports.jsFilesToInclude = ['client.js'];