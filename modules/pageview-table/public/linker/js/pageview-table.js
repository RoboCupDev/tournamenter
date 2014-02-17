/*
	=======================================
				PAGEVIEWS TABLE
	=======================================

	An extension of default PAGEVIEW.

	This will configure and show table data

*/
(function () {

	// Get default pageview module to extend
	defaultModule = _.clone(Modules.PageViews['pageview']);

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


	/*
		Public view Class that will render, update and animate
		tables
	*/
	module.view = defaultModule.view.extend({
		tableTemplate: JST['pageview-table.table'],

		initialize: function(){
			// Call super constructor
			this._initialize();
			this.listenTo(this.model, 'change:options change:data', this.render);
			// this.listenTo(this.model, 'change:data', this.updateTables);
		},

		render: function(){
			console.log('Rendering pageview-table');
			// Get Page options and data
			var options = this.model.get('options');
			var tables 	= this.model.get('data');
			console.log(tables);

			// Find out correct layout template for it
			var template = JST['pageview-table.layout-'+tables.length];
			// Check if layout template exist
			if(!template)
				return console.log('No layout file provided for '+tables.length+' tables');

			// Create Views for tables
			var tableViews = [];
			for(var t in tables){
				var table = tables[t];
				tableViews.push(this.tableTemplate({
					// table: tables[t]
					title: table.name,
					subtitle: 'Scores',
				}));
			}

			var finalLayout = template({
				tables: tableViews
			});

			this.$el.html(finalLayout);
			this.$el.addClass('pageview-table');

			this.updateTables();
		},

		updateTables: function(){
			console.log('updateTables');
			var tables = this.model.get('data');
			var $tables = this.$el.find('table');
			for(var t in tables){
				if(!$tables[t]) return console.info('Ops... DOM Table not found');

				var table = tables[t];
				var $table = $tables[t];
				var header = this.makeTableHeader(table);
				var data = this.makeTableContent(table);

				App.Mixins.createTable(header, data, $table);
			}
		},

		/*
		Table Data example
			table:{
				columns: "5",
				createdAt: "2014-01-16T19:10:21.861Z",
				evaluateMethod: "return Math.random();",
				headerFinal: "Final",
				headerRank: "Rank",
				headerScore: "Round",
				headerTeam: "Team",
				locked: "no",
				name: "Oficial Rounds",
				sort: "desc",
				updatedAt: "2014-01-30T02:41:41.302Z",
				id: "52d82e9d672c2ccc04e0c775",
				scores: [...]
		*/
		makeTableHeader: function(table){
			var alignRight = 'text-right';
			var headers = {
				'rank': {
					value: table.headerRank,
					class: alignRight
				},
				'teamName': table.headerTeam,
			};
			// Create dynamic score fields
			for(var k = 1; k <= table.columns*1; k++){
				headers['score'+k] = {
					value: table.headerScore+' '+k,
					class: alignRight,
				};
			}

			headers['final'] = {
				value: table.headerFinal,
				class: alignRight
			};

			return headers;
		},

		/*
		Table Scores Example:
			scores: [
				{
					createdAt: "2014-01-24T03:53:58.687Z",
					scores: {
						1: {value: 213, data: {...}}
					},
					tableId: "52d82e9d672c2ccc04e0c775",
					teamId: "52d35c1e6bda8a5c8f8a22a9",
					updatedAt: "2014-01-24T03:54:02.213Z",
					id: "52e1e3d6dbb78102006b8397",
					final: 0.733663140097633,
					rank: 1,
					team: {
						category: "default",
						country: "LK",
						createdAt: "2014-01-13T03:23:10.011Z",
						name: "XLSd",
						updatedAt: "2014-02-07T09:52:40.193Z",
						id: "52d35c1e6bda8a5c8f8a22a9"
					}
				},
				{...}
			]
		*/
		makeTableContent: function(table){
			var content = [];
			var columns = table.columns*1;

			for(var s in table.scores){
				var score = table.scores[s];
				// Add dynamic attributes
				score.teamName = score.team.name;
				for(var c = 1; c <= columns; c++){
					var scoreValue = (score.scores[c] ? score.scores[c].value : '-');
					score['score'+c] = scoreValue;
				}
				content.push(score);
			}

			return content;
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
	(Modules.PageViews = Modules.PageViews ? Modules.PageViews : {})[module.module] = module;

})();