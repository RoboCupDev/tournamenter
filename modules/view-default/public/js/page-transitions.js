/*
	This controlls animations for Pages
*/
App.Views.PageTransitions = Backbone.View.extend({

	// Internal Flags
	isAnimating: false,
	endCurrPage: false,
	endNextPage: false,
	animEndEventNames: null,
	supportAnimation: false,

	initialize: function () {
		// Find out animation end callback name (depends on browser)
		var animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		};
		this.animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
		this.supportAnimation = Modernizr.cssanimations;
	},

	// The actual view being shown
	$currentView: null,

	/*
		Set the current page. With animations.
	*/
	changePage: function(next, options){
		var self = this;
		options = options || {};
		_.defaults(options, {
		// options = {
			outClass: 'pt-page-moveToLeft',
			inClass: 'pt-page-moveFromRight',

			force: false,
		});

		if(options.animation)
			_.extend(options, options.animation);

		// If we still animating, but not forcing, cancel change.
		if( this.isAnimating && !options.force)
			return false;
		this.isAnimating = true;
		
		var $currPage = this.$currentView;
		var $nextPage = (next ? this.saveView(next).addClass( 'pt-page-current' ) : null);

		if(!this.supportAnimation)
			return self.setPage($nextPage);

		this.trigger('start-animate');
		if($currPage){
			$currPage.addClass( options.outClass ).on( self.animEndEventName, function() {
				$currPage.off( self.animEndEventName );
				self.endCurrPage = true;
				checkEndAnimation();
			});
		}else{
			self.endCurrPage = true;
			checkEndAnimation();
		}

		if($nextPage){
			$nextPage.addClass( options.inClass ).on( self.animEndEventName, function() {
				$nextPage.off( self.animEndEventName );
				self.endNextPage = true;
				checkEndAnimation();
			} );
		}else{
			self.endNextPage = true;
			checkEndAnimation();
		}

		function checkEndAnimation(){
			if(self.endNextPage && self.endCurrPage)
				self.setPage($nextPage);
		}
	},

	/*
		Set the current page. No animations.
	*/
	setPage: function(view){
		// Check if jQuery object is inside view, or is the view object itself
		var $nextView = this.saveView(view);

		// Reset flags
		this.endCurrPage = false;
		this.endNextPage = false;

		// Check if views are different
		// if($nextView == this.$currentView)
			// return false;

		// Restore current view class if already set
		if(this.$currentView)
			this.restoreView(this.$currentView);

		// Set nextView as current, with restored css values
		if($nextView){
			this.restoreView($nextView);
			this.$currentView = $nextView.addClass('pt-page-current');
		}else{
			this.$currentView = null;
		}

		// Reset animate flag
		this.isAnimating = false;

		// Trigger change-page event
		this.trigger('page-change');
		return true;
	},

	/*
		Helper function used to get jQuery view inside view object, or return view itself
		It also checks if the view has it's saved values, if not, then save it
	*/
	saveView: function(view){
		if(!view) return null;
		// If not saved, save it
		if(!view.data('originalClassList'))
			view.data('originalClassList', view.attr( 'class' ));
		return view;
	},

	/*
		Restore view default classes 
	*/
	restoreView: function(view){
		if(!view) return null;
		// Restore
		var $view = this.saveView(view);
		$view.attr('class', $view.data('originalClassList'));
		return $view;
	},

	animations: {
		'moveToLeft': {
			outClass: 'pt-page-moveToLeft',
			inClass: 'pt-page-moveFromRight',
		},
		'moveToRight': {
			outClass: 'pt-page-moveToRight',
			inClass: 'pt-page-moveFromLeft',
		},
		'moveToTop': {
			outClass: 'pt-page-moveToTop',
			inClass: 'pt-page-moveFromBottom',
		},
		'moveToBottom': {
			outClass: 'pt-page-moveToBottom',
			inClass: 'pt-page-moveFromTop',
		},
		'fadeRight': {
			outClass: 'pt-page-fade',
			inClass: 'pt-page-moveFromRight pt-page-ontop',
		},
		'fadeLeft': {
			outClass: 'pt-page-fade',
			inClass: 'pt-page-moveFromLeft pt-page-ontop',
		},
		'fadeBottom': {
			outClass: 'pt-page-fade',
			inClass: 'pt-page-moveFromBottom pt-page-ontop',
		},
		'fadeTop': {
			outClass: 'pt-page-fade',
			inClass: 'pt-page-moveFromTop pt-page-ontop',
		},
		'moveToLeftFade': {
			outClass: 'pt-page-moveToLeftFade',
			inClass: 'pt-page-moveFromRightFade',
		},
		'moveToRightFade': {
			outClass: 'pt-page-moveToRightFade',
			inClass: 'pt-page-moveFromLeftFade',
		},
		'moveToTopFade': {
			outClass: 'pt-page-moveToTopFade',
			inClass: 'pt-page-moveFromBottomFade',
		},
		'moveToBottomFade': {
			outClass: 'pt-page-moveToBottomFade',
			inClass: 'pt-page-moveFromTopFade',
		},
		'moveToLeftEasing': {
			outClass: 'pt-page-moveToLeftEasing pt-page-ontop',
			inClass: 'pt-page-moveFromRight',
		},
		'moveToRightEasing': {
			outClass: 'pt-page-moveToRightEasing pt-page-ontop',
			inClass: 'pt-page-moveFromLeft',
		},
		'moveToTopEasing': {
			outClass: 'pt-page-moveToTopEasing pt-page-ontop',
			inClass: 'pt-page-moveFromBottom',
		},
		'moveToBottomEasing': {
			outClass: 'pt-page-moveToBottomEasing pt-page-ontop',
			inClass: 'pt-page-moveFromTop',
		},
		'scaleDownRight': {
			outClass: 'pt-page-scaleDown',
			inClass: 'pt-page-moveFromRight pt-page-ontop',
		},
		'scaleDownLeft': {
			outClass: 'pt-page-scaleDown',
			inClass: 'pt-page-moveFromLeft pt-page-ontop',
		},
		'scaleDownBottom': {
			outClass: 'pt-page-scaleDown',
			inClass: 'pt-page-moveFromBottom pt-page-ontop',
		},
		'scaleDownTop': {
			outClass: 'pt-page-scaleDown',
			inClass: 'pt-page-moveFromTop pt-page-ontop',
		},
		'scaleDownDown': {
			outClass: 'pt-page-scaleDown',
			inClass: 'pt-page-scaleUpDown pt-page-delay300',
		},
		'scaleDownUp': {
			outClass: 'pt-page-scaleDownUp',
			inClass: 'pt-page-scaleUp pt-page-delay300',
		},
		'moveToLeftWithScale': {
			outClass: 'pt-page-moveToLeft pt-page-ontop',
			inClass: 'pt-page-scaleUp',
		},
		'moveToRightWithScale': {
			outClass: 'pt-page-moveToRight pt-page-ontop',
			inClass: 'pt-page-scaleUp',
		},
		'moveToTopWithScale': {
			outClass: 'pt-page-moveToTop pt-page-ontop',
			inClass: 'pt-page-scaleUp',
		},
		'moveToBottomWithScale': {
			outClass: 'pt-page-moveToBottom pt-page-ontop',
			inClass: 'pt-page-scaleUp',
		},
		'scaleDownCenter': {
			outClass: 'pt-page-scaleDownCenter',
			inClass: 'pt-page-scaleUpCenter pt-page-delay400',
		},
		'rotateRightSideFirst': {
			outClass: 'pt-page-rotateRightSideFirst',
			inClass: 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop',
		},
		'rotateLeftSideFirst': {
			outClass: 'pt-page-rotateLeftSideFirst',
			inClass: 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop',
		},
		'rotateTopSideFirst': {
			outClass: 'pt-page-rotateTopSideFirst',
			inClass: 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop',
		},
		'rotateBottomSideFirst': {
			outClass: 'pt-page-rotateBottomSideFirst',
			inClass: 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop',
		},
		'flipOutRight': {
			outClass: 'pt-page-flipOutRight',
			inClass: 'pt-page-flipInLeft pt-page-delay500',
		},
		'flipOutLeft': {
			outClass: 'pt-page-flipOutLeft',
			inClass: 'pt-page-flipInRight pt-page-delay500',
		},
		'flipOutTop': {
			outClass: 'pt-page-flipOutTop',
			inClass: 'pt-page-flipInBottom pt-page-delay500',
		},
		'flipOutBottom': {
			outClass: 'pt-page-flipOutBottom',
			inClass: 'pt-page-flipInTop pt-page-delay500',
		},
		'rotateFall': {
			outClass: 'pt-page-rotateFall pt-page-ontop',
			inClass: 'pt-page-scaleUp',
		},
		'rotateOutNewspaper': {
			outClass: 'pt-page-rotateOutNewspaper',
			inClass: 'pt-page-rotateInNewspaper pt-page-delay500',
		},
		'rotatePushLeft': {
			outClass: 'pt-page-rotatePushLeft',
			inClass: 'pt-page-moveFromRight',
		},
		'rotatePushRight': {
			outClass: 'pt-page-rotatePushRight',
			inClass: 'pt-page-moveFromLeft',
		},
		'rotatePushTop': {
			outClass: 'pt-page-rotatePushTop',
			inClass: 'pt-page-moveFromBottom',
		},
		'rotatePushBottom': {
			outClass: 'pt-page-rotatePushBottom',
			inClass: 'pt-page-moveFromTop',
		},
		'rotatePushLeft': {
			outClass: 'pt-page-rotatePushLeft',
			inClass: 'pt-page-rotatePullRight pt-page-delay180',
		},
		'rotatePushRight': {
			outClass: 'pt-page-rotatePushRight',
			inClass: 'pt-page-rotatePullLeft pt-page-delay180',
		},
		'rotatePushTop': {
			outClass: 'pt-page-rotatePushTop',
			inClass: 'pt-page-rotatePullBottom pt-page-delay180',
		},
		'rotatePushBottomPull': {
			outClass: 'pt-page-rotatePushBottom',
			inClass: 'pt-page-rotatePullTop pt-page-delay180',
		},
		'rotateFoldLeft': {
			outClass: 'pt-page-rotateFoldLeft',
			inClass: 'pt-page-moveFromRightFade',
		},
		'rotateFoldRight': {
			outClass: 'pt-page-rotateFoldRight',
			inClass: 'pt-page-moveFromLeftFade',
		},
		'rotateFoldTop': {
			outClass: 'pt-page-rotateFoldTop',
			inClass: 'pt-page-moveFromBottomFade',
		},
		'rotateFoldBottom': {
			outClass: 'pt-page-rotateFoldBottom',
			inClass: 'pt-page-moveFromTopFade',
		},
		'moveToRightFadeUnfold': {
			outClass: 'pt-page-moveToRightFade',
			inClass: 'pt-page-rotateUnfoldLeft',
		},
		'moveToLeftFadeUnfold': {
			outClass: 'pt-page-moveToLeftFade',
			inClass: 'pt-page-rotateUnfoldRight',
		},
		'moveToBottomFadeUnfold': {
			outClass: 'pt-page-moveToBottomFade',
			inClass: 'pt-page-rotateUnfoldTop',
		},
		'moveToTopFadeUnfold': {
			outClass: 'pt-page-moveToTopFade',
			inClass: 'pt-page-rotateUnfoldBottom',
		},
		'rotateRoomLeftOut': {
			outClass: 'pt-page-rotateRoomLeftOut pt-page-ontop',
			inClass: 'pt-page-rotateRoomLeftIn',
		},
		'rotateRoomRightOut': {
			outClass: 'pt-page-rotateRoomRightOut pt-page-ontop',
			inClass: 'pt-page-rotateRoomRightIn',
		},
		'rotateRoomTopOut': {
			outClass: 'pt-page-rotateRoomTopOut pt-page-ontop',
			inClass: 'pt-page-rotateRoomTopIn',
		},
		'rotateRoomBottomOut': {
			outClass: 'pt-page-rotateRoomBottomOut pt-page-ontop',
			inClass: 'pt-page-rotateRoomBottomIn',
		},
		'rotateCubeLeftOut': {
			outClass: 'pt-page-rotateCubeLeftOut pt-page-ontop',
			inClass: 'pt-page-rotateCubeLeftIn',
		},
		'rotateCubeRightOut': {
			outClass: 'pt-page-rotateCubeRightOut pt-page-ontop',
			inClass: 'pt-page-rotateCubeRightIn',
		},
		'rotateCubeTopOut': {
			outClass: 'pt-page-rotateCubeTopOut pt-page-ontop',
			inClass: 'pt-page-rotateCubeTopIn',
		},
		'rotateCubeBottomOut': {
			outClass: 'pt-page-rotateCubeBottomOut pt-page-ontop',
			inClass: 'pt-page-rotateCubeBottomIn',
		},
		'rotateCarouselLeftOut': {
			outClass: 'pt-page-rotateCarouselLeftOut pt-page-ontop',
			inClass: 'pt-page-rotateCarouselLeftIn',
		},
		'rotateCarouselRightOut': {
			outClass: 'pt-page-rotateCarouselRightOut pt-page-ontop',
			inClass: 'pt-page-rotateCarouselRightIn',
		},
		'rotateCarouselTopOut': {
			outClass: 'pt-page-rotateCarouselTopOut pt-page-ontop',
			inClass: 'pt-page-rotateCarouselTopIn',
		},
		'rotateCarouselBottomOut': {
			outClass: 'pt-page-rotateCarouselBottomOut pt-page-ontop',
			inClass: 'pt-page-rotateCarouselBottomIn',
		},
		'rotateSidesOut': {
			outClass: 'pt-page-rotateSidesOut',
			inClass: 'pt-page-rotateSidesIn pt-page-delay200',
		},
		'rotateSlideOut': {
			outClass: 'pt-page-rotateSlideOut',
			inClass: 'pt-page-rotateSlideIn',
		}
	},

});