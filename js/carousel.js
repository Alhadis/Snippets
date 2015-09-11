(function(){
	"use strict";

	/*<*/
	var	DOC					=	document,
		WIN					=	window,
		TRUE				=	true,
		FALSE				=	false,
		OBJ					=	Object,
		MATH				=	Math,
		NUM					=	Number,
		UNDEF,

		/** Dictionary */
		QUERY				=	"querySelector",
		QUERY_ALL			=	QUERY + "All",
		ADD_LISTENER		=	"addEventListener",
		POINT_EVENT			=	"click",
		SCROLL				=	"scroll",
		OFFSET				=	"offset",
		_LEFT				=	"Left",
		_WIDTH				=	"Width",
		RESIZE				=	"resize",
		SCROLL_LEFT			=	SCROLL	+ _LEFT,
		SCROLL_WIDTH		=	SCROLL	+ _WIDTH,
		OFFSET_LEFT			=	OFFSET	+ _LEFT,
		OFFSET_WIDTH		=	OFFSET	+ _WIDTH,
		INNER_WIDTH			=	"inner" + _WIDTH,
		/*>*/


		/**
		 * Basic view controller for a horizontally-sliding row of elements.
		 *
		 * @param {Object} args - Hash of configuration variables
		 * @constructor
		 */
		Carousel		=	function(args){

			/** Extract some of our arguments, falling back on default values where needed. */
			var	list		=	args.list,
				latency		=	args.latency	|| 600,
				easing		=	args.easing		|| Tween.EASE_IN_OUT,
				wrapNav		=	UNDEF !== args.wrap		? args.wrap   : TRUE,
				keyNav		=	UNDEF !== args.keyNav	? args.keyNav : TRUE,


				/** Assorted pointers */
				THIS		=	this,
				listItems	=	list.children,


				/**
				 * Slides the carousel (hopefully smoothly) to the desired position.
				 * @param {Number} value
				 */
				scrollTo	=	function(value){
					if(!scrolling){
						scrolling = TRUE;

						new Tween({
							target:		list,
							curve:		easing,
							property:	SCROLL_LEFT,
							from:		list[SCROLL_LEFT],
							duration:	latency,
							to:			MATH.max(0, MATH.min(value, list[SCROLL_WIDTH] - list[OFFSET_WIDTH])),
							onDone:		function(){ scrolling = FALSE; }
						});
					}
				},


				/**
				 * Helper function to set the carousel's position relatively, rather than absolutely.
				 * @param {Number} offset
				 */
				scrollBy	=	function(offset){
					scrollTo(list[SCROLL_LEFT] + offset);
				},


				
				/** Slides the carousel to the previous cell situated off-screen. */
				back	=	function(wrap){
					
					var item, itemOffset,
						currentOffset	= list[SCROLL_LEFT],
						i				= listItems.length - 1;


					/** If we've scrolled back as far as we can, skip to the end. */
					if(!currentOffset && wrap)
						return scrollTo(NUM.MAX_VALUE);


					for(; i >= 0; --i){
						item			= listItems[i];
						itemOffset		= item[OFFSET_LEFT];

						if(itemOffset < currentOffset)
							return scrollBy(-(WIN[INNER_WIDTH] - (item[OFFSET_WIDTH] - (currentOffset - itemOffset))));
					}

					/** All else fails, just jump back to 0, ajaja. #ScrewMaths */
					scrollTo(0);
				},




				/** Slides the carousel to the next cell situated off-screen. */
				next	=	function(wrap){
					
					for(var item, itemOffset, itemWidth,
							windowWidth		= WIN[INNER_WIDTH],
							currentOffset	= list[SCROLL_LEFT],
							l				= listItems.length,

							i = 0; i < l; ++i){
								item		=	listItems[i];
								itemOffset	=	item[OFFSET_LEFT],
								itemWidth	=	item[OFFSET_WIDTH];
								
								if(itemOffset + itemWidth > (currentOffset + windowWidth))
									return scrollTo(itemOffset);
							}


					/** If there's nothing out of sight, that kind of implies we're at the end. Jump back to start. */
					if(wrap) scrollTo(0);
				},



				/** Internal use only */
				scrolling	=	FALSE;




			/** Configure event listeners */
			args.back[ ADD_LISTENER ](POINT_EVENT, function(e){
				back(wrapNav);
				e.preventDefault();
				return FALSE;
			});

			args.next[ ADD_LISTENER ](POINT_EVENT, function(e){
				next(wrapNav);
				e.preventDefault();
				return FALSE;
			});


			/** Set an event listener to realign the carousel if the viewport's changed dimensions. */
			WIN[ ADD_LISTENER ](RESIZE, function(){

				setTimeout(function(){
					
					var	offset	=	list[SCROLL_LEFT],
						i		=	listItems.length - 1,
						item, itemOffset;

					for(; i >= 0; --i){
						item		=	listItems[i];
						itemOffset	=	item[OFFSET_LEFT];

						if(itemOffset+2 < offset){
							scrollTo(itemOffset);
							break;
						}
					}

				}(500));

			}.debounce(50));
			
			
			/** If keyboard navigation's enabled, add a listener to move the slider in response to keystrokes */
			!keyNav || WIN[ ADD_LISTENER ]("keyup", function(e){
				var	key	=	e.keyCode;
					 if(37 === key) back(wrapNav);
				else if(39 === key) next(wrapNav);
			});


			/** Expose some methods for external use */
			THIS.back		=	back;
			THIS.next		=	next;
			THIS.scrollTo	=	scrollTo;
			THIS.scrollBy	=	scrollBy;
		};


	/** Export */
	WIN.Carousel = Carousel;

}());
