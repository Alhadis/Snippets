(function(){
	"use strict";
	
	/*<*/
	var	DOC			=	document,
		WIN			=	window,
		NUMBER		=	Number,
		TRUE		=	true,
		FALSE		=	false,
		UNDEF,

		/** Aliased methods/properties */
		each		=	Array.prototype.forEach,
		html		=	DOC.documentElement,

		/** Lengthy/repeated method names. */
		query		=	"querySelector",
		queryAll	=	query+"All",
		getByClass	=	"getElementsByClassName",


		/** Appropriate event types for interacting with document's content */
		pointStart	=	"mousedown",
		/*>*/




		/**
		 * Basic class for managing a tabbed interface.
		 *
		 * No attempt is made to arrange the targeted container into any tab-like structure. That is, it's assumed the affected
		 * element is already marked-up and styled to resemble a sequence of content blocks preceded by a navigation element.
		 * In essence, this class is primarily responsible for toggling CSS classes for hiding/exposing content, and assigning
		 * the event listeners responsible for doing so.
		 *
		 * @param {HTMLElement} el - The node that encloses both the navigation element and the container holding each panel of tabbed content.
		 * @param {Object} opts - Supplementary hash of options
		 * @param {String} opts.activeClass - CSS class applied to active tab and associated nav item. Defaults to "active".
		 * @param {Boolean} opts.autoHeight - If set, will automatically set the height of the `panels` node to fit the height of the selected tab.
		 * @param {String|HTMLElement} opts.nav - A selector matching an element within `el`, or an explicit reference to a DOM element.
		 * @param {String|HTMLElement} opts.panel - As with opts.nav, but specifies the element enclosing each region of content to display/hide.
		 * @constructor
		 */
		Tabs	=	function(el, opts){

			var	THIS	=	this,
			
				/** Resolve any options that we were handed. */
				opts			=	opts || {},
				activeClass		=	opts.activeClass || "active",
				
				/** Enable automatic scaling of container's height */
				autoHeight		=	opts.autoHeight,
				autoHeight		=	UNDEF === autoHeight ? TRUE : autoHeight,


				/** Navigation container: allow both nodes and selector strings to be passed in. */
				nav			=	opts.nav,
				nav			=	UNDEF		=== nav			? el.firstElementChild	: nav,
				nav			=	"string"	=== typeof nav	? el[ query ](nav)		: nav,

				/** Element enclosing each panel of tabbed content. */
				panelsNode	=	opts.panels,
				panelsNode	=	UNDEF		=== panelsNode			? nav.nextElementSibling	: panelsNode,
				panelsNode	=	"string"	=== typeof panelsNode	? el[ query ](panelsNode)	: panelsNode,


				/** Actual list of panels, expressed as a live HTMLCollection. */
				panels		=	panelsNode.children,

				/** Similarly, change nav to point to its immediate descendants for quicker lookup. */
				nav			=	nav.children,


				/** Index of the currently-active panel. */
				active,


				/** Method for fitting the container's height to that of the currently-selected panel. */
				fit	=	function(){
					panelsNode.style.height	=	panels[active].scrollHeight + "px";
				};


			/** Define property getter/setters */
			Object.defineProperties(THIS, {

				/** Read-only properties */
				node:	{get:	function(){ return el;		}},
				nav:	{get:	function(){	return nav;		}},
				panels:	{get:	function(){ return panels;	}},


				/** Writable properties */
				active:{
					get:	function(){ return active; },
					set:	function(i){

						/** Make sure we're being assigned a valid numeric value. */
						if(i !== active && !NUMBER.isNaN(i = parseInt(+i))){
							active	=	i;

							/** Remove the "active-class" from the previous elements. */
							each.call(el[ queryAll ]("."+activeClass), function(o){
								o.classList.remove(activeClass);
							});

							if(autoHeight) fit();

							/** Reapply the "active class" to our newly-selected elements. */
							nav[i].classList		.add(activeClass);
							panels[i].classList		.add(activeClass);
						}
					}
				}
			});


			/** Attach event listeners */
			each.call(nav, function(o, index){
				o.addEventListener(pointStart, function(e){
					THIS.active	=	index;
					e.preventDefault();
					return FALSE;
				});
			});


			/** Set the active/initial panel */
			THIS.active	=	opts.active || 0;

			/** Expose some internal functions as instance methods */
			THIS.fit	=	fit;
		};


	/** Polyfills */
	NUMBER.isNaN	=	NUMBER.isNaN || function(i){ return "number" === typeof i && i !== i; }


	/** Export */
	WIN.Tabs	=	Tabs;
}());