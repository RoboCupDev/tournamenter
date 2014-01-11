/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var _ = require('lodash');

module.exports.bootstrap = function (cb) {

	initializeEasyAdmin();

	// initializeXEditable();

	// It's very important to trigger this callack method when you are finished 
	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
	cb();
};


function initializeEasyAdmin(){

	// Locals that are constant
	var constantLocals = {
		_projectName: sails.config.appName,
		_rootUrl: '',
		_menus: [],
	}

	// console.log(sails.controllers);
	// sails.express.app.locals();
	// console.log(sails.config.appName);

	// Search in every controller
	_.each(sails.controllers, function(controller){
		// Is there a key 'menus' inside '_config'
		if(controller._config && controller._config.menus)
			_.extend(constantLocals._menus, controller._config.menus);
	});

	sails.express.app.locals(constantLocals);

}


/*function initializeXEditable(){
	// console.log(sails.models);
	_.each(sails.controllers, function(controller){
		console.log(controller);

		var Model = sails.models[controller.identity];

		// if(Model)
			// controller['asdasd'] = XEditable.handle(controller);


	});
}
*/
