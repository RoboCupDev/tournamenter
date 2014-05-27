/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	login: function(req, res, next){
		var realPassword = process.env.PASSWORD;
		var password = req.param('password') || req.body.password;

		// Redirect if no password required or user is already logged in
		if(!realPassword || realPassword == req.session.authentication)
			return res.redirect('/');

		/*
			Check if password is ok, and save
			it in the user session
		*/
		if(password == realPassword){
			req.session.authentication = realPassword;
			res.redirect('/');
		}else{
			delete req.session.authentication;

			// Render login view and show wrong password error if needed
			res.view({
				wrongPassword: (realPassword && password)
			});
		}
	},

	logout: function(req, res, next){
		// Logout and redirect to login if password exist
		delete req.session.authentication;
		if(process.env.PASSWORD)
			res.redirect('/login');
	},


	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to TeamsController)
	*/
	_config: {
		menus: [
			{name: 'Logout', path: '/logout', order: 999}
		]
	}
  
};

// Clear Logout item in menu if no password is given
if(!process.env.PASSWORD)
	delete module.exports._config.menus;