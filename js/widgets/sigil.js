(function(){
	"use strict";

	/*< Mungeable aliases */
	var DOC		=	document,
		WIN		=	window,
		TRUE	=	true,
		FALSE	=	false,
		UNDEF,
		/*>*/


	/**
	 * The Sigil class clones an existing SVG element into an HTML element to use as a background.
	 *
	 * Although simple in its function, the class aims to reduce extra HTML requests (CSS background-images),
	 * eliminate the need for copy+pasted or hardcoded SVG code, and allow inline SVGs to be styled with
	 * inherited CSS (as well as to better respond to user interaction, particularly mouse events).
	 *
	 * Before creating a Sigil instance, the developer should populate the class's static .types hash with SVG
	 * references (each looked up using a unique string identifier). This is achieved by calling the "Sigil.read"
	 * method on an HTML element which contains the SVG elements to assign as "blueprints". Each "blueprint" needs
	 * an ID attribute describing it (e.g., id="australia-map"), otherwise the SVG element is skipped and excluded
	 * from the Sigil.types hash.
	 *
	 * Developers are also free to construct a Sigil instance using a direct SVG reference; e.g., "new Sigil(container, svgElement)".
	 * This may be a preferred option if only one Sigil needs to be drawn.
	 *
	 * @param {HTMLElement} el - Containing HTML element
	 * @param {String|SVGSVGElement} type - Either a string pointing to an SVG blueprint stored in Sigil.types, or an actual <svg> object
	 * @param {Object}	opts - Hash of optional parameters to further control the behaviour and generation of the Sigil.
	 * @param {String}	opts.wrapper - Name of HTML tag to create to wrap container's existing contents with. Will do nothing if given an empty value, or if no child nodes exist.
	 * @param {Boolean}	opts.wrapAfter - If set, inserts the wrapped content after the injected SVG element, instead of before. Relevant only if a wrapper is used.
	 * @param {Boolean}	opts.classAddType - If set, will add the glyph's type ID as an HTML class to the containing element.
	 * @param {RegExp}	opts.classTypeMask - Deletes substrings from the glyph's type ID before it's applied as an HTML class.
	 * @constructor
	 */
	Sigil	=	function(el, type, opts){

		/** Sanity check: ensure we're working with an HTML element before doing anything. */
		if(!el || !(el instanceof HTMLElement))
			throw new TypeError("Cannot create Sigil object without valid HTMLElement container.");


		var	THIS	= this,

			/** Whether an SVGElement was passed directly. */
			isSVG	= type instanceof SVGSVGElement,

			mould, replica,
			opts	=	opts || {},


			/** Figure out if we're using a wrapper element or not. If left undefined, defaults to a <span> element. */
			wrapper	=	opts.wrapper,
			wrapper	=	UNDEF === wrapper ? "span" : (wrapper || FALSE),


			/** RegExp used to remove characters from the type ID before assigning it as an HTML class to the container. */
			typeMask	=	opts.classTypeMask,


			/** Option to enable proportional scaling. */
			autoRatio	=	opts.autoRatio,
			autoRatio	=	UNDEF === autoRatio ? TRUE : autoRatio;




		/** We have a recognised sigil type, or we have a literal SVG element reference. */
		if(mould = (isSVG ? type : Sigil.types[type])){


			/** Check if wrapping of child nodes is required/necessary. */
			if(wrapper && el.childNodes.length){

				/** Create a new wrapper to hold the previous contents of the sigil'd element. */
				wrapper = DOC.createElement(wrapper || "span");


				/** Move child nodes to the newly-created wrapper. */
				while(el.firstChild)
					wrapper.appendChild(el.firstChild);
			}

			else wrapper = FALSE;



			/** Draw a copy of the SVG sigil in the original element. */
			replica	=	mould.cloneNode(TRUE);
			replica.removeAttribute("id");
			el.appendChild(replica);

			/** Add the (now-wrapped) original contents; assuming we had a wrapper. */
			if(wrapper)
				THIS.wrapper = opts.wrapAfter ? el.insertBefore(wrapper, replica) : el.appendChild(wrapper);


			THIS.svg = replica;
			

			/** Add the sigil's ID as an HTML class to the containing element if instructed. */
			if(!isSVG && opts.classAddType)
				el.className += " "+(typeMask ? type.replace(typeMask, " ") : type);


			/** Add a ratio controller, unless we're told not to. */
			if(autoRatio){
				autoRatio = el.insertBefore(DOC.createElement("div"), el.firstChild);
				autoRatio.className			=	"sigil-ratio";
				autoRatio.style.paddingTop	=	parseInt(replica.getAttribute("height")) / parseInt(replica.getAttribute("width")) * 100 + "%";
			}
		}
	};



	/**
	 * Hashes a bunch of references to SVG elements to the Sigil class's .types property.
	 *
	 * @param {HTMLElement} el - Container element holding the SVG elements to store as blueprints
	 * @return {Function} Reference to the Sigil class, allowing method chaining if needed.
	 * @see Sigil
	 */
	Sigil.read	=	function(el){
		for(var SVGs	=	el.getElementsByTagName("svg"),
				SVG,
				name	=	"",
				i		=	0,
				l		=	SVGs.length,
				types	=	Sigil.types || {};
				i < l;
				++i){

			SVG		=	SVGs[i];

			/** Element has a unique ID that hasn't been defined as a blueprint yet. */
			if((name = SVG.id) && !types[name])
				types[name]	=	SVG;			
		}

		/** Write the amended/generated list back to the Sigil class */
		Sigil.types	=	types;
		return Sigil;
	};


	/** Store whether or not the user's browser supports embedded SVG. */
	Sigil.SVGSupported	=	(function(){
		var e		=	DOC.createElement("div"),
			svgEl	=	WIN.SVGSVGElement;
		e.innerHTML	=	"<svg></svg>";
		return !!(svgEl && e.firstChild instanceof svgEl)
	}());


	/** Export */
	WIN.Sigil	=	Sigil;
}());
