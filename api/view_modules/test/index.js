
/*
	Simple test view-module
*/
exports.process = function (page, next) {
	// Inject test attrib
	page.test = true;

	next(null, page);
};

// Public js files to inject in templates
exports.jsFilesToInclude = ['client.js'];