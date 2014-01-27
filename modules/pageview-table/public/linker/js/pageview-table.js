/*
	=======================================
				PAGEVIEWS TABLE
	=======================================

	An extension of default PAGEVIEW.

	This will configure and show table data

*/
(function () {

	// Get default pageview module to extend
	defaultModule = _.clone(App.PageViews['pageview']);

	// Extend default pageview
	var module = _.extend(defaultModule, {
		name: 'Table View',
		module: 'pageview-table',
		disabled: false,
	});

	module.ConfigView = defaultModule.ConfigView.extend({
		render: function(){
			this.$el.html('AEWEW!');
			return this;
		}
	});

	// Register in modules
	App.PageViews[module.module] = module;

})();