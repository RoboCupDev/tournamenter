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

		/*
			Find tables in server. Return cached if exist, or callback later
			This is a helper method, for loading tables the first time it's called.
			When it is fetched, all the remaining callbacks will be executed.
			Afte that, calling this method will return instantly the tables.

			Also, when it fetches, it will update the tablesKeys array.
		*/
		tables: new App.Collections.Tables(),
		tablesKeys: [],
		_callbacks: [],
		fetchComplete: false,
		getTables: function(next){
			var self = this;
			// Register  callbacks

			// Fetches data
			if(!this.fetchComplete){
				this._callbacks.push(next);
				// Only fetches for the first time
				if(this._callbacks.length <= 1)
					this.tables.fetch({success: onFetchComplete});
				return null;
			}

			return this.tables;

			function onFetchComplete(){
				self.fetchComplete = true;
				processTablesKeys();
				// Run callbacks
				while(self._callbacks.length > 0)
					self._callbacks.pop()(self.tables);
			}

			// When the table is synced, we shall update it's values
			function processTablesKeys(){
				var tablesKeys = [];

				module.tables.forEach(function(table){
					tablesKeys.push({
						value: table.get('id'),
						text: table.get('name'),
					});
				});

				module.tablesKeys = tablesKeys;
			}
		},
	});



	module.ConfigView = defaultModule.ConfigView.extend({

		template: JST['pageview-table.configView'],

		initialize: function(){
			// Setup model variables
			if(!this.model.has('options'))
				this.model.set('options', {});

			this.listenTo(this.model, 'change', this.render);
		},

		render: function(){
			var view = this;

			// If the fetch is not complete, return and call self render later
			var tables = module.getTables(function(){
				view.render();
			});
			if(!tables) return this;
				
			// Render view
			this.$el.html(this.template());
			this.$el.addClass('list-group');

			// Initialize edit fields
			this.configureEditFields();

			return this;
		},

		configureEditFields: function(){
			var view = this;

			// Editable options used for Tables
			$tables = this.$('.config-tables');
			App.Mixins.editInPlaceCustom($tables, {
				type: 'select2',
				mode: 'popup',
				source: module.tablesKeys,
				showbuttons: true,
				value: view.model.get('options').tables,
				select2: {
					multiple: true,
					width: 200,
					placeholder: 'Select Tables',
					allowClear: true,
				},
			}, this.createSaveWrapperForField('tables'));

			// Editable options used table items
			$rows = this.$('.config-rows');
			App.Mixins.editInPlaceCustom($rows, {
				type: 'text',
				mode: 'popup',
				showbuttons: true,
				value: view.model.get('options').rows,
				emptytext: 'Automatic',
				validate: function(value) {
					if(!value)
						return;
					value = value*1;
					if(!_.isNumber(value) || value < 1)
						return 'It must be bigger than 1!';

					var isRound = (value % 1 === 0);
					if(!isRound)
						return 'It must be an integer';
				}
			}, this.createSaveWrapperForField('rows'));

			// Editable options used table items
			$still = this.$('.config-still');
			App.Mixins.editInPlaceCustom($still, {
				type: 'text',
				mode: 'popup',
				showbuttons: true,
				value: view.model.get('options').still,
				emptytext: 'Automatic',
				validate: function(value) {
					if(!value)
						return;
					value = value*1;
					if(!_.isNumber(value) || value < 1)
						return 'It must be bigger than 1!';
				},
				display: function(value){
					$(this).text(value ? value + 's' : value);
				}
			}, this.createSaveWrapperForField('still'));

			return this;
		}
	});

	module.ItemView = defaultModule.ItemView.extend({
		ConfigView: module.ConfigView,
	});

	// Register in modules
	App.PageViews[module.module] = module;

})();