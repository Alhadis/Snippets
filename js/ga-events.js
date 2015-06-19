(function(){
	
	/**
	 * Configure GA tracking events after page load.
	 * 
	 * @param {Object|Function} config {
	 *     A hash of selectors, each holding the properties of a tracking target. E.g.,
	 * 
	 *     "#load-more": {
	 *         category: 'Gallery',
	 *         action:   'Click',
	 *         label:    'Load More'
	 *     }
	 * 
	 *     If a function is assigned to a selector string instead of a hash, it's triggered whenever
	 *     the accompanying element is clicked/tapped. Use this functionality to override the automated event
	 *     tracking if more granular control is required.
	 * 
	 *     @type {String} category    - Event category
	 *     @type {String} action      - Event action
	 *     @type {String} label       - Event label
	 *     @type {Boolean} persistent - If TRUE, will delegate the handler so any matching elements created
	 *                                  AFTER calling this function will still receive event tracking. Enable
	 *                                  this only if the elements are dynamically created. Optional.
	 * }
	 */
	var GAEvents	=	function(config){

		/** Loop through the targets config and assign direct event listeners to anything not marked as "persistent". */
		var i, delegated	=	[];
		for(i in config){

			if(config[i].persistent)
				delegated.push(i);

			else (function(selector, attr){
				var elements	=	document.querySelectorAll(selector);
				Array.prototype.forEach.call(elements, function(el){
					el.addEventListener("click", function(e){
						if("function" === typeof attr)
							attr.call(e.target, e);
						else ga("send", "event", attr.category, attr.action, attr.label);
					});
				});

			}(i, config[i]));
		}


		/** Shim for Element.matches method */
		var el	=	Element.prototype;
		el.matches	= el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector || function(selector){
			var matches	=	(this.document || this.ownerDocument).querySelectorAll(selector), i	= 0;
			while(matches[i] && this !== matches[i]) i++;
			return !!matches[i];
		};


		/** Only add a delegated click handler if there were any "persistent" tracking targets defined in our config. */
		if(delegated.length){
			document.documentElement.addEventListener("click", function(e){

				for(var i = 0, l = delegated.length; i < l; ++i){
					var selector	=	delegated[i],
						attr		=	config[selector];	

					if(e.target.matches(selector)){
						if("function" === typeof attr)
							attr.call(e.target, e);
						else ga("send", "event", attr.category, attr.action, attr.label);
						return;
					}
				}
			});
		}
	};


	/** Export */
	window.GAEvents	=	GAEvents;
}());
