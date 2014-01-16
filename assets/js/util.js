var Util = {};

/*
	Utility method to help with collapsible views.

	$trigger: an jQuery element to listen to click events
	 $target: jQuery element to collapse un-collapse when clicked
	    opts: additional options
*/
Util.makeCollapsible = function($trigger, $target, opts){

	opts = _.defaults(opts || {}, {
		showData: 'Show',
		hideData: 'Hide',
	});

	updateText();

	$trigger.unbind('click').click(toggleCollapse);

	function toggleCollapse(){
		// Is it colapsed?
		if($target.hasClass('collapse')){
			$target.collapse('show');
		}else{
			$target.collapse('hide');
		}
		updateText();
	}

	// Change the trigger text depending if it's collapsed or not
	function updateText(){
		if($target.hasClass('collapse')){
			$trigger.html(opts.showData);
		}else{
			$trigger.html(opts.hideData);
		}
	}
}