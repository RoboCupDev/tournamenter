var __ok = true;

/*
	Simple module
*/
var testPageModule = {
	name: 'Test View',
	module: 'test',
	disabled: false,
	// this.itemView = itemView;
	// this.barView = barView;
	// this.configView = configView;
};

testPageModule.itemView = Backbone.View.extend({

	template: _.template($('#template-test-itemView').html()),

	initialize: function(){
		console.log('Initializing itemView');

	},

	render: function(){
		console.log('Rendering itemView');
		

		return this;
	}
});

// Register in modules
App.PageViews.test = testPageModule;
