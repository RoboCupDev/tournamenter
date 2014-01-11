
module.exports = function useEasyAdmin (req, res, next) {

	res.view = view(res.view, res);
	// console.log(res.view);

	return next();
};

// Re-write view method
var view = function(newFunction, res){
	return function(data, b, c){
		if(b || c)
			console.log('Not implemented. view in useEasyAdmin');

		var startRenderTime = (new Date).getTime(); 

		// Filter data
		data = data || {};

		// Default data
		var renderData = {
			// Private
			// _projectName: self.name,
			// _rootUrl: '/',
			// _menus: self._menus,
			_menusPrivate: false,
			_pathName: (res.req ? res.req.route.path : ''),

			// Not important
			_startRenderTime: startRenderTime,

			// Public
			sideMenu: false,
		};

		// Merge objects (data overrides renderData)
		for (var key in data)
			renderData[key] = data[key];

		newFunction(renderData);
	};
}