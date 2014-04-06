/*
	=======================================
				PAGEVIEWS MESSAGE
	=======================================

	An extension of default PAGEVIEW.

	This will configure an Message

*/
(function () {

	// Get default pageview module to extend
	defaultModule = _.clone(Modules.PageViews['pageview']);

	// Extend default pageview
	var module = _.extend(defaultModule, {
		name: 'Message View',
		module: 'pageview-message',
		disabled: false,
	});

	/*
		A custom table renderer for markdown
	*/
	var customTableRenderer = function(header, body) {
		return '<table class="table table-striped table-bordered table-responsive" style="background-color: #F0F0F0;">\n'
		+ '<thead>\n'
		+ header
		+ '</thead>\n'
		+ '<tbody>\n'
		+ body
		+ '</tbody>\n'
		+ '</table>\n';
	};

	/*
		Public view Class that will render, update and animate
		tables
	*/
	module.view = defaultModule.view.extend({
		
		initialize: function(){
			// Call super constructor
			this._initialize();
			console.info('pageview-message created');

			this.listenTo(this.model, 'change:options', this.render);
		},

		template: JST['pageview-message.view'],
		render: function(){
			var options = this.model.get('options');

			// Render template
			this.$el.html(this.template());

			// Setup template props
			var $inner = this.$('.inner');
			$inner.addClass( options.align ? ('text-'+options.align) : 'text-center');
			$inner.css('zoom', options.size*1 || 1.5);

			// Get default markdown renderer
			var renderMethod = null;

			// This is an workflow to allow multiple markdown libraries
			if(window.markdown){
				// markdown.js
				renderMethod = markdown.toHTML;
			}else if(window.marked){
				// marked.js (allows tables, so let's stylize)
				marked.Renderer.prototype.table = customTableRenderer;
				renderMethod = marked;
			}

			// Set template
			if(options.message && renderMethod)
				$inner.html(renderMethod( options.message ));

			var colors = {
				primary: '#428bca',
				success: '#5cb85c',
				info:    '#5bc0de',
				warning: '#f0ad4e',
				danger:  '#d9534f',
			}

			// Set bg and text colors
			this.$el.css('backgroundColor', colors[options.type] || colors.info);
			$inner.addClass('alert alert-'+(options.type || 'info'));
			

			// Render markdown
			// this.$el.addClass('container');
			// this.$el.addClass('center-block')

			// var $img = $('<img>');
			// $img.prop('src', options.file);
			// this.$el.html($img);
			// this.$el.addClass('text-center');

			// var sizes = {
			// 	small: '50%',
			// 	medium: '70%',
			// 	big: '100%',
			// }
			// var height = sizes[options.size] || sizes.medium;

			// Give time to update DOM
			var $container = this.$('.container');
			setTimeout(function(){
				$container.css('position', 'relative');
				$container.css('top', '50%');
				$container.css('marginTop', -$container.height()/2);
			}, 1);
		},

	});


	module.ConfigView = defaultModule.ConfigView.extend({

		template: JST['pageview-message.configView'],

		initialize: function(){
			// Setup model variables
			if(!this.model.has('options'))
				this.model.set('options', {});

			this.listenTo(this.model, 'change:options', this.optionsChanged);

			this.listenTo(this.model, 'change', this.render);
		},

		render: function(){
			var view = this;
	
			// Render view
			this.$el.html(this.template());
			this.$el.addClass('panel-body');

			// Initialize edit fields
			this.configureEditFields();

			// Initialize view with options
			this.optionsChanged();

			return this;
		},

		optionsChanged: function(){
			var options = this.model.get('options');

			this.$('.config-text').val(options.message || '');
			// this.$('.img-thumbnail').prop('src', options.file);
		},

		configureEditFields: function(){
			var view = this;

			// Editable options for message type
			var $type = this.$('.config-type');
			App.Mixins.editInPlaceCustom($type, {
				type: 'select',
				mode: 'popup',
				source: [
					{value: 'primary',text: 'Default'},
					{value: 'info',   text: 'Info'},
					{value: 'warning',text: 'Warning'},
					{value: 'success',text: 'Success'},
					{value: 'danger', text: 'Danger'},
				],
				// source: module.tablesKeys,
				showbuttons: true,
				value: view.model.getOption('type'),
				emptytext: 'Primary',
			}, this.createSaveWrapperForField('type'));

			// Editable options for text zoom size
			var $size = this.$('.config-size');
			App.Mixins.editInPlaceCustom($size, {
				type: 'text',
				mode: 'popup',
				// source: module.tablesKeys,
				showbuttons: true,
				value: view.model.getOption('size'),
				emptytext: '1',
			}, this.createSaveWrapperForField('size'));

			// Editable options for image size
			var $align = this.$('.config-align');
			App.Mixins.editInPlaceCustom($align, {
				type: 'select',
				mode: 'popup',
				source: [
					{value: 'left',		text: 'Left'},
					{value: 'center',	text: 'Center'},
					{value: 'right',	text: 'Right'},
				],
				// source: module.tablesKeys,
				showbuttons: true,
				value: view.model.getOption('align'),
				emptytext: 'Left',
			}, this.createSaveWrapperForField('align'));

			// Initialize edit field on textarea
			var $editor = this.$('.config-text');
			$editor.markdown({
				autofocus:false,
				savable:true,

				onBlur: saveTextField,
				onSave: saveTextField,
			});

			function saveTextField(e){
				// e.preventDefault();
				// console.log(e.getContent());
				view.model.setOption('message', e.getContent());
				view.model.save({silent: true});
			}

			return this;
		},

	});

	module.ItemView = defaultModule.ItemView.extend({
		ConfigView: module.ConfigView,
	});

	// Register in modules
	(Modules.PageViews = Modules.PageViews ? Modules.PageViews : {})[module.module] = module;

})();