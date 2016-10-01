function random(min, max){
	return Math.floor(Math.random() * max - min + 1) + min;
}

function percent(value, outOf, startAt){
	var startAt = undefined === startAt ? 0 : startAt;
	return ((value - startAt) / (outOf - startAt)) * 100;
}

function percentOf(percentage, outOf, startAt){
	return ((percentage / 100) * (outOf - (undefined === startAt ? 0 : startAt)));
}

/** Measure the arctangent between two points (the angle required for one point to face another). */
function angleTo(a, b){
	return (Math.atan2(b[1] - a[1], a[0] - b[0])) * 180 / Math.PI;
}

/** Measure the distance between two points. */
function distance(a, b){
	return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

/** Convert radians to degrees. */
function radToDeg(value){
	return value * 180 / Math.PI;
}

/** Convert degrees to radians. */
function degToRad(value){
	return value * Math.PI / 180;
}


/**
 * Convert an integer to bijective hexavigesimal notation (alphabetic base-26).
 *
 * @param {Number} int - A positive integer above zero
 * @return {String} The number's value expressed in uppercased bijective base-26
 */
function bijectiveBase26(int){
	const sequence    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const length      = sequence.length;
	
	if(int <= 0)      return int;
	if(int <= length) return sequence[int - 1];
	
	
	let index  = (int % length) || length;
	let result = [sequence[index - 1]];
	
	while((int = Math.floor((int - 1) / length)) > 0){
		index = (int % length) || length;
		result.push(sequence[index - 1]);
	}
	
	return result.reverse().join("")
}


/** Apply De Casteljau's algorithm to an array of points to ascertain the final midpoint. */
function deCasteljau(points, p){
	var a, b, i,
	midpoints = [],
	p         = p || 0.5;
	
	while(points.length > 1){
		
		for(i = 0; i < points.length - 1; ++i){
			a = points[i];
			b = points[i+1];
			
			midpoints.push([
				a[0] + ((b[0] - a[0]) * p),
				a[1] + ((b[1] - a[1]) * p)
			]);
		}
		
		points      = midpoints;
		midpoints   = [];
	}

	return [points[0], a, b];
}



/**
 * Add leading zeros when necessary.
 *
 * @param {Number} value - The number being formatted.
 * @param {Number} min - The minimum required length of the formatted number.
 */
function zeroise(value, min){
	var val = value.toString();
	if(val.length < min)
		val = Array(min - val.length + 1).join("0") + val;
	return val;
}


/**
 * Clamp a value to ensure it sits within a designated range.
 *
 * Called with no arguments, this function returns a value to fall
 * between 0 - 1, offering a useful shorthand for validating multipliers.
 *
 * @param {Number} input - Value to operate upon
 * @param {Number} min - Lower threshold; defaults to 0
 * @param {Number} max - Upper threshold; defaults to 1
 * @return {Number}
 */
function clamp(input, min, max){
	return Math.min(Math.max(input, min || 0), undefined === max ? 1 : max);
}



/**
 * Return TRUE if a variable is a Number or number-like String.
 * 
 * The string-checking is intentionally restricted to "basic" notation only: strings
 * using advanced notation like hexadecimal, exponential or binary literals are ignored.
 * E.g., "0b11100100", "0xE4" or "3.1536e+10" would, if supplied as strings, test as FALSE.
 * 
 * @param {Mixed} i - Value to inspect
 * @return {Boolean}
 */
function isNumeric(i){
	return "" !== i && +i == i && (String(i) === String(+i) || !/[^\d\.]+/.test(i));
}


/**
 * Format a number of bytes for human-readable output.
 * @param {Number} input - Number of bytes.
 * @return {String} A reader-friendly representation of filesize.
 */
function formatBytes(input){
	var val, bytes = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
	for(val in bytes) if(input >= 1024) input = input / 1024; else break;
	return Math.round(input*100)/100+" "+bytes[val];
}



/**
 * Break a path into separate components.
 *
 * The elements of the returned array are:
 *    0:    Original input string
 *    1:    Protocol with :// appended
 *    2:    Directory path (including hostname/domain)
 *    3:    Filename
 *    4:    ?query=string
 *    5:    #Hash
 *
 * @param {String} path - Directory path or URI (either absolute or relative)
 * @return {Array}
 */
function parseURL(path){
	return path.match(/^([^\/#\?]*:?\/\/)?(\/?(?:[^\/#\?]+\/)*)?([^\/#\?]+)?(?:\/(?=$))?(\?[^#]*)?(#.*)?$/);
}



/**
 * Locate the root directory shared by multiple paths.
 *
 * @param {Array} paths - A list of filesystem paths
 * @return {String} root
 */
function findBasePath(paths){
	const POSIX = paths[0].indexOf("/") !== -1;
	let matched = [];
	
	/** Spare ourselves the trouble if there's only one path */
	if(1 === paths.length){
		matched = (paths[0].replace(/[\\/]+$/, "")).split(/[\\/]/g);
		matched.pop();
	}
	
	/** Otherwise, comb each array */
	else{
		const rows   = paths.map(d => d.split(/[\\/]/g));
		const width  = Math.max(...rows.map(d => d.length));
		const height = rows.length;
		
		let x, y;
		X: for(x = 0; x < width; ++x){
			const str = rows[0][x];
			for(let y = 1; y < height; ++y)
				if(str !== rows[y][x]) break X;
			matched.push(str);
		}
	}

	return matched.join(POSIX ? "/" : "\\");
}



/**
 * Check if a string is a valid 16-digit credit card number.
 *
 * Non-alphanumeric separators like hyphens or spaces are ignored when determining validity.
 *
 * @param {String} input
 * @return {Boolean}
 */
function isValidCCNumber(input){
	return /^([^\dA-Za-z]*\d[^\dA-Za-z]*){16}$/.test(input);
}



/**
 * Generate a regex to match a string, bypassing intermediate punctuation.
 *
 * E.g., "CoffeeScript" matches "coffee-script", "cOfFeE sCRiPT" or even
 * "C0FFEE.SCRIPT". Useful when words have multiple possible spellings.
 *
 * @param {String} input - A string, such as "reStructuredText" or "dBASE"
 * @param {Function} format - Desired output format (String or RegExp)
 * @return {String|RegExp}
 */
function fuzzyRegExp(input, format = RegExp){
	
	/** Don't bother doing anything if this isn't a string */
	if("[object String]" !== ({}).toString.call(input))
		return input;
	
	const output = input
		.replace(/([A-Z])([A-Z]+)/g, (a, b, c) => b + c.toLowerCase())
		.split(/\B(?=[A-Z])|[-\s]/g)
		.map(i => i.replace(/([/\\^$*+?{}\[\]().|])/g, "\\$1?"))
		.join("[\\W_ \\t]?")
		.replace(/[0Oo]/g, "[0o]");
	
	/** Author's requested the regex source, return a string */
	if(String === format)
		return output;
	
	/** Otherwise, crank the fuzz */
	return new RegExp(output, "i");
}



/**
 * Generate a RegEx from its string-based representation.
 *
 * Useful for "deserialising" a regex from JSON. Optional flags can be given
 * to override trailing modifiers found in the source, if any.
 *
 * @example "/\\S+/i"       -> /\S+/i
 * @example "\\d+\\.\\d+$"  -> /\d+\.\d+$/
 * @param  {String} src
 * @param  {String} flags
 * @return {RegExp} regex
 */
function regexFromString(src, flags){
	src = (src || "").toString();
	if(!src) return null;
	
	const matchEnd = src.match(/\/([gimuy]*)$/);
	
	/** Input is a "complete" regular expression */
	if(matchEnd && /^\//.test(src))
		return new RegExp(
			src.replace(/^\/|\/([gimuy]*)$/gi, ""),
			flags != null ? flags : matchEnd[1]
		);
	
	return new RegExp(src, flags);
}



/**
 * Escape special regex characters within a string.
 *
 * @example "file.js" -> "file\\.js"
 * @param {String} input
 * @return {String}
 */
function escapeRegExp(input){
	return input.replace(/([/\\^$*+?{}\[\]().|])/g, "\\$1");
}



/**
 * Align a string by padding it with leading/trailing whitespace.
 *
 * @param {String} input
 * @param {Number} width - Character width of the container
 * @param {Number} axis  - Multiplier specifying axis of alignment:
 *                           0.0: Left-aligned
 *                           0.5: Centred
 *                           1.0: Right-aligned
 *                         The default is 0.5 (centre-aligned).
 * @param {String} char - Chracter to pad with. Defaults to space (U+0020)
 * @return {String}
 */
function alignText(input, width, axis, char){
	axis           = undefined === axis ? 0.5 : axis;
	char           = char || " ";
	let emptySpace = width - input.length;
	
	/** Bail early if there's nothing to do here */
	if(emptySpace < 1) return input;
	
	let left  = emptySpace * axis;
	let right = emptySpace - left;
	
	return char.repeat(Math.round(left)) + input + char.repeat(Math.round(right));
}



/**
 * Parse a value into a query string.
 *
 * If given an object, its properties are broken up into "&key=value" pairs,
 * with any arrays expanded into "&key[0]=value&key[1]=value" sequences. Any
 * other value types are coerced into their stringified forms.
 *
 * The result is prepended with a question mark, unless empty.
 *
 * @param {Object|} input
 * @return {String}
 */
function parseQuery(input){
	
	/** Sanity check */
	if(!input) return "";
	
	const encode   = encodeURIComponent;
	const toString = ({}).toString;
	
	/** Input is an object of some description */
	if("[object Object]" === toString.call(input)){
		let result = "";
		
		for(let i in input){
			
			/** This property is assigned an array: expand it */
			if("[object Array]" === toString.call(input[i]))
				result += "&" + input[i].map((item, index) => {
					return encode(i) + "["+index+"]=" + encode(item);
				}).filter(e => undefined !== e).join("&");
			
			/** Just add another "&name=value" pair */
			else result += "&"+encode(i)+"="+encode(input[i]);
		}
		input = result;
	}
	
	/** Return the stringified result, adding a "?" if needed */
	return (input + "").replace(/^[?&]*(?=.)/, "?");
}



/**
 * Parse a well-formed URL query string into an object hash.
 * 
 * @param {String} q - If supplied, will be used instead of the current document's own URL.
 * @return {Object} A hash enumerated with key/value pairs found in the parsed string.
 */
function unserialiseQuery(q){
	q = q || document.location.search;
	if(!q) return {};
	q = q.replace(/^\?/, "").split(/&/g);
	for(var q, output = {}, i = 0; i < q.length; ++i){
		if(!i) continue;
		q[i]   = q[i].split(/=/);
		output[q[i][0]] = q[i].slice(1).join("=");
	}
	return output;
}


/**
 * Return the subproperty located on an object at the designated path.
 *
 * For instance, to access a nested value of "App.config.pages[0].dialogue.title.innerText", simply pass that
 * exact string sequence (minus "App.") to the function's second argument, with App passed to the first.
 * Both dot and array-like accessor notation are supported.
 *
 * @param {Object} object - The subject to scan the properties of
 * @param {String} path - An accessor string pointing to the desired property.
 * @param {Boolean} useLast - If TRUE, will return the last valid value in an accessor chain if an invalid property was encountered.
 * @return {Mixed} The referenced value, or undefined if the path pointed to an invalid property.
 */
function resolveProperty(object, path, useLast){
	var path = path.replace(/\[(['"])?([^\]]+)\1\]/g, ".$2").split(/\./g);
	var prev = object, p, i = 0, l = path.length;
	for(; i < l; ++i){
		p    = path[i];
		if(prev === undefined || !(p in prev)) return useLast ? prev : undefined;
		prev = prev[p];
		if(i >= l-1) return prev;
	}
	return undefined;
}


/**
 * Recursively alphabetise the enumerable properties of an object.
 *
 * This function returns a copy of the original object with all properties
 * listed in alphabetic order, rather than enumeration order. The original
 * object is unmodified.
 *
 * @param {Object}  input
 * @param {Boolean} strictCase - If TRUE, will order case-sensitively (capitals first)
 * @return {Object}
 */
function alphabetiseProperties(input, strictCase){
	let stringTag = Object.prototype.toString.call(input);
	
	/** Regular JavaScript object; enumerate properties */
	if("[object Object]" === stringTag){
		let keys = Object.keys(input);
		
		keys = strictCase ? keys.sort() : keys.sort((a, b) => {
			let A = a.toLowerCase();
			let B = b.toLowerCase();
			if(A < B) return -1;
			if(A > B) return 1;
			return 0;
		});
		
		let result = {};
		for(let i of keys)
			result[i] = alphabetiseProperties(input[i]);
		return result;
	}
	
	/** This is an array; make sure the properties of its values are sorted too */
	else if("[object Array]" === stringTag)
		return Array.prototype.map.call(input, e => alphabetiseProperties(e));
	
	/** Just return it untouched */
	return input;
}



/**
 * Generate an ID-safe slug from a name.
 *
 * @param {String} name
 * @return {String} slug
 */
function slug(name){
	return (name || "").toString()
		.toLowerCase()
		.replace(/[^\w$]/gi, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "")
}



/**
 * Return the English ordinal suffix for a number (-st, -nd, -rd, -th).
 *
 * @param {Number} n - A number (preferably an integer) to return the suffix for.
 * @return {String}
 */
function ordinalSuffix(n){
	return [,"st", "nd", "rd"][((n %= 100) > 10 && n < 20) ? 0 : (n % 10)] || "th";
}


/**
 * Return a number of milliseconds from a string representing a time value in CSS.
 *
 * @param {String} t - A CSS time value such as "3200ms" or "4s".
 * @return {Number}
 */
function parseDuration(t){
	if(typeof t != "string") return t;
	if(/\ds\s*$/i.test(t))   return parseFloat(t) * 1000;
	else                     return parseFloat(t);
}



/**
 * Ascertain a browser's support for a CSS property.
 * 
 * @param {String} n - CSS property name, supplied in sentence case (e.g., "Transition")
 * @return {Boolean} TRUE if the browser supports the property in either prefixed or unprefixed form. 
 */
function cssSupport(n){
	s = document.documentElement.style;
	if(n.toLowerCase() in s) return true;
	for(var s, p = "Webkit Moz Ms O Khtml", p = (p.toLowerCase() + p).split(" "), i = 0; i < 10; ++i)
		if(p[i]+n in s) return true;
	return false;
}




/**
 * Check if a browser appears to support a given CSS unit.
 *
 * @param {String} unit - Name of a CSS unit (e.g., em, rem, vmax)
 * @return {Boolean}
 */
function cssUnitSupport(unit){
	try{
		var d         = document.createElement("div");
		d.style.width = "32"+unit;
		return d.style.width == "32"+unit;
	} catch(e){return false;}
}



/**
 * Check if the browser understands a given CSS selector.
 *
 * Not supported in IE6-7 (which always report TRUE, even for unsupported selectors).
 *
 * @param {String} s - Selector to test support for. E.g., "input:checked"
 * @return {Boolean}
 */
function cssSelectorSupport(s){
	var o,
	d = document,
	b = d.body,
	r = s+"{}",
	s = b.appendChild(d.createElement("style")),
	h = s.sheet;

	h ? (s.textContent = r, h = s.sheet) : ((h = s.styleSheet).cssText = r);
	o = 0 !== (h.cssRules || h.rules).length;
	b.removeChild(s);
	return o;
}



/**
 * Return the name of the WebGL rendering context supported by the browser, if any.
 *
 * If no support is detected whatsoever, an empty string is returned.
 *
 * @return {String}
 */
function getWebGLSupport(){
	var c, i  = 0,
	canvas    = document.createElement("canvas"),
	contexts  = "webgl experimental-webgl moz-webgl webkit-3d".split(" ");

	/** Cycle through each known WebGL context type trying to break something */
	for(; i < 4; ++i) try{
		c = canvas.getContext(contexts[i]);
		if(c) return contexts[i];
	} catch(e){}
	return "";
}



/**
 * Return the width of the scrollbars being displayed by this user's OS/device.
 *
 * @return {Number}
 */
function getScrollbarWidth(){
	var result,
	DOC    = document,
	el     = DOC.createElement("div"),
	style  = el.style,
	size   = 120;

	style.width     =
	style.height    = size+"px";
	style.overflow  = "auto";
	el.innerHTML    = Array(size*5).join(" W ");
	(DOC.body || DOC.documentElement).appendChild(el);

	result  = el.offsetWidth - el.scrollWidth;
	el.parentNode.removeChild(el);
	return result;
}



/**
 * Export a table's data as an array of object literals.
 *
 * @param {HTMLTableElement} table
 * @return {Array}
 */
function extractTableData(table){

	/** Iterator variables */
	var i, l,

	/** Arrays to load our data into. */
		headers = [],
		data    = [],


	/** Gather our column names */
	th = table.tHead ? table.tHead.querySelectorAll("tr:first-child > th") : table.tBodies[0].querySelectorAll("tr:first-child > td");
	for(i = 0, l = th.length; i < l; ++i)
		headers.push(th[i].textContent.trim());


	/** Next, start collecting our data. */
	for(i = 0, l = table.tBodies.length; i < l; ++i){
		(function(body, data, start){
			var row     = start,
				numRows = body.children.length,
				cells, numCells, c, item;

			for(; row < numRows; ++row){
				cells       = body.children[row].children,
				c           = 0,
				numCells    = cells.length,
				item        = {};
				for(; c < numCells; ++c)
					item[headers[c]] = cells[c].textContent.trim();
				data.push(item);
			}

		}(table.tBodies[i], data, +(!table.tHead && !i)));
	}

	return data;
}



/**
 * Build a dictionary object from the terms of a description list.
 *
 * If more than one <dd> tag falls under a single term, the term is assigned an array of strings instead.
 * If a duplicate definition is encountered, its values are added to the array of the original.
 *
 * @param {HTMLDListElement} dl       Description list to build a dictionary from
 * @param {Boolean}          useHTML  Use a <dd>'s HTML source instead of its purely-textual content.
 * @param {Function|RegExp}  filter   Callback to execute on each definition term's name. If a RegExp
 *                                    is supplied, it's used to delete matches from the term instead.
 *                                    If omitted, the parameter defaults to a regex that strips trailing
 *                                    colons (e.g., producing {Name: "..."} from "<dt>Name:</dt>"
 * @return {Object}
 */
function buildDict(dl, useHTML, filter){
	var filter  = filter || /(^\s*|\s*:\s*$)/g,
		output  = {},
		items   = dl.childNodes,
		i = 0, l = items.length, term, value, el;


	/** If given a regex, convert it into a callback to delete the characters it matches */
	if(filter instanceof RegExp || "string" === typeof filter)
		filter = (function(pattern){
			return function(s){ return s.replace(pattern, ""); }
		}(filter));


	for(; i < l; ++i){
		el = items[i];
		
		/** Skip if this node isn't a <dt> or <dd> element */
		if(!{DT:1, DD:1}[el.tagName]) continue;

		/** Starting a new description/definition term */
		if("DT" === el.tagName)
			term = filter(el.textContent);

		/** Adding a description to an existing term */
		else{
			value = useHTML ? el.innerHTML : el.textContent;

			/** If this isn't the first definition assigned to a term, convert its assigned value to an array */
			if("string" === typeof output[term])
				output[term] = [output[term]];

			undefined === output[term]
				? output[term] = value        /** No definitions have been assigned to this term yet */
				: output[term].push(value);   /** Something's been defined under this term before */
		}
	}
	
	return output;
}



/**
 * Inclusive string splitting method. Similar to String.prototype.split, except
 * matching results are always included as part of the returned array.
 *
 * Always make sure a pattern's global flag is enabled!
 *
 * @param {String} input
 * @param {RegExp} pattern - Pattern to split the string by.
 * @return {Array}
 */
function isplit(input, pattern){
	
	/** Safety check to avoid infinite recursion */
	if(!pattern.global) throw "isplit: Pattern's global flag must be set"
	
	var output    = [],
		startFrom = 0,
		match;
	while(match = pattern.exec(input)){
		output.push(input.substring(startFrom, pattern.lastIndex - match[0].length), match[0]);
		startFrom = pattern.lastIndex;
	}
	if(startFrom < input.length)
		output.push(input.substring(startFrom, input.length));
	return output;
}



/**
 * Convert a string to title-case using crude/basic English capitalisation rules.
 *
 * @param {String} input
 * @return {String}
 */
function toTitleCase(input){
	var ignore = (function(o){
		var h = {};
		for(var i in o) h[o[i]] = true;
		return h;
	}("the a an and but or nor of to in on for with to".split(" "))),

	o = input.toLowerCase().replace(/\b(\w)(\w+)?/gi, function(word, firstLetter, remainder, index, input){
		
		/** Matching a single letter. */
		if(undefined === remainder)
			return firstLetter.toUpperCase();
		
		if( /** Ignore certain words that're supposed to be left lowercase between words. */
			ignore[word] ||

			/** Beware of contractions. */
			("'" === input[index-1] && /\w'$/.test(input.substring(index, 0)))
		) return word;

		return firstLetter.toUpperCase() + remainder;
	})

	/** Make sure "I" is always capitalised! */
	.replace(/\bi\b/g, "I");

	return o[0].toUpperCase() + o.slice(1);
}



/**
 * Wrap a string to a specified line length.
 *
 * Words are pushed onto the following line, unless they exceed the line's total length limit.
 *
 * @param {String} input - Block of text to wrap
 * @param {Number} length - Number of characters permitted on each line.
 * @return {Array} An array of fold points, preserving any new-lines in the original text.
 */
function wordWrap(input, length){
	for(var length = length || 80, output = [], match, nl, i = 0, l = input.length; i < l; i += length){
		var segment = input.substring(i, i+length);
		
		/** Segment contains at least one newline. */
		if(-1 !== (nl = segment.lastIndexOf("\n"))){
			output.push(segment.substring(0, nl+1));
			segment = segment.substring(nl+1);
		}
		
		/** We're attempting to cut on a non-whitespace character. Do something. */
		if(/\S/.test(input[(i+length)-1]) && (match = segment.match(/\s(?=\S+$)/))){
			output.push(segment.substr(0, i + length > l ? l : (match.index+1)));
			i = (i - (match.input.length - match.index))+1;
		}
		else output.push(segment);
	}
	return output;
}



/**
 * Return the number of words in a string.
 *
 * Hyphenation is ignored: "twenty-two" will be read as two words instead of one.
 *
 * @param {String} input - Text to measure the word count of.
 * @return {Number}
 */
function wordCount(input){
	var words = input.replace(/[^\w-_]+/g, " ").replace(/^\s+|\s+$/g, "").split(/\s+/g);
	return words[0] ? words.length : 0;
}



/**
 * Execute a callback function on every text node found within an element's descendants.
 * 
 * @param {Element}  el    - Element to parse the contents of.
 * @param {Function} fn    - Callback executed on each text node. Passed two args: the text node itself, and the current depth level.
 * @param {Number}   depth - Internal use only. Current number of recursion levels.
 * 
 * @return {Element} The HTML element originally passed to the function.
 */
function walkTextNodes(el, fn, depth){
	depth = depth || 0;

	for(var children = Array.prototype.slice.call(el.childNodes, 0), n, l = children.length, i = 0; i < l; ++i){
		n = children[i];
		if(n.nodeType === Node.TEXT_NODE)
			fn.call(this, n, depth);
		else if(n.nodeType === Node.ELEMENT_NODE)
			walkTextNodes(n, fn, depth+1);
	}
	return el;
};


/**
 * Inject <wbr /> elements into any lengthy words found in each text node found within an element's descendants.
 *
 * @uses walkTextNodes
 * @param {Element} element - DOM element to operate on.
 * @param {Number} limit - Number of characters to traverse in a single word before inserting a breakpoint.
 */
function injectWordBreaks(element, limit){

	walkTextNodes(element, function(node){
		var original = node,
		terminators  = '.,+*?$|#{}()\\^\\-\\[\\]\\\\\/!%\'"~=<>_:;\\s',
		splitAt      = new RegExp("([^" + terminators + "]{" + limit + "})", "g"),
		breakPoints  = [];

		/** Collect a list of insertion points. */
		while(splitAt.exec(node.data))
			breakPoints.push(splitAt.lastIndex);
	
		for(var otherHalf, i = breakPoints.length - 1; i >= 0; --i){
			otherHalf = node.splitText(breakPoints[i]);
			node.parentNode.insertBefore(document.createElement("wbr"), otherHalf);
		}
	});
}



/**
 * Strip any text nodes from the immediate descendants of an element.
 * 
 * @param {Element} el - Subject element to operate on.
 * @param {Boolean} emptyOnly - Whether to limit deletion to whitespace nodes only.
 * @return {Element}
 */
function pruneTextNodes(el, emptyOnly){
	if(!el || !el.childNodes.length) return el;
	el.normalize();

	var i = el.lastChild;
	var r = /^\s*$/;

	/** If the last node's a textNode, shoot it. */
	if(3 === i.nodeType && (!emptyOnly || r.test(i.data))){
		el.removeChild(i);
		i = el.lastChild;
		if(!i) return el;
	}

	/** Run through each child node and nuke whatever isn't an element. */
	while(i = i.previousSibling)
		if(3 === i.nodeType && (!emptyOnly || r.test(i.data))) el.removeChild((i = i.nextSibling).previousSibling);

	return el;
};



/**
 * Return the containing element of a node that matches the given selector.
 *
 * If the node itself matches, it'll be returned unless ignoreSelf is set.
 *
 * @param {Node} node - A document node to inspect the hierarchy of
 * @param {String} selector - A CSS selector string
 * @param {Boolean} ignoreSelf - If given a truthy value, only the parents of a node will be queried
 * @return {Element} The closest matching element, or NULL if none of the node's parents matched the selector.
 */
function inside(node, selector, ignoreSelf){
	var match,
	parent     = ignoreSelf ? node.parentNode : node,
	matches    = document.querySelectorAll(selector),
	numMatches = matches.length;

	if(numMatches) while(parent){
		for(match = 0; match < numMatches; ++match)
			if(matches[match] === parent) return parent;
		parent = parent.parentNode;
	}
	return null;
}



/**
 * Return the deepest node within an element's descendants.
 *
 * @param {HTMLElement} el
 * @return {Node}
 */
function deepest(el){
	var children = el.querySelectorAll("*");
	var branches = [];
	var length   = children.length, i;
	
	/** Return the original element if there were no children */
	if(!length) return el;
	
	for(i = 0; i < length; ++i){
		var child  = children[i];
		var depth  = 0;
		var parent = child.parentNode;
		
		while(parent !== el){
			++depth;
			parent = parent.parentNode;
		}
		
		branches.push([depth, child]);
	}
	
	/** Ascertain which child had the greatest depth */
	depth = [-1, null];
	for(i = 0, length = branches.length; i < length; ++i){
		child = branches[i];
		if(child[0] > depth[0])
			depth = child;
	}
	
	return depth[1];
}



/**
 * Extract a DOM element from a chunk of HTML source.
 * 
 * @param {String} input
 * @return {Array} An array of DOM nodes
 */
function parseHTMLFragment(input){
	var output   = [];
	var fragment = document.createDocumentFragment();
	var queryTag;
	
	
	/**
	 * Not all elements are created equal. Table elements in particular need
	 * to be injected into a <table>. E.g., "<tr><td>Test</td></tr>" will be
	 * stripped down to just "Test".
	 *
	 * Sniff the apparent type of the first HTML tag matched in the string.
	 * Wrap the input with missing tags that're required to parse the contents
	 * accurately.
	 *
	 * It won't do justice to malformed HTML, but that won't be parsed accurately anyway.
	 */
	var tagType = (input.match(/^[^<]*<([-\w]+)/) || [,""])[1].toLowerCase();
	
	switch(tagType){
		
		case "thead":
		case "tbody":
		case "tfoot":
		case "caption":
			input = "<table>" + input + "</table>";
			break;
		
		case "tr":
			input = "<table><tbody>" + input + "</tbody></table>";
			break;
		
		case "th":
		case "td":
			input = "<table><tbody><tr>" + input + "</tr></tbody></table>";
			break;
		
		default:
			tagType = "";
			break;
	}
	
	var root = fragment.appendChild(document.createElement("div"));
	root.insertAdjacentHTML("afterbegin", input);
	
	
	/** Switch the root element if we modified the input markup */
	if(tagType && (tagType = root.querySelector(tagType)))
		root = tagType.parentNode;
	
	
	/** Cycle through the parsed nodes and detach them into an array */
	while(root.firstChild)
		output.push(root.removeChild(root.firstChild));
	
	/** Return a JavaScript array (rather than a NodeList/HTMLCollection) */
	return output;
}



/**
 * Node-only helper function to return the entirety of standard input.
 *
 * @return {Promise}
 */
function readStdin(){
	return new Promise(resolve => {
		let input = "";
		process.stdin.setEncoding("UTF8");
		process.stdin.on("readable", () => {
			const chunk = process.stdin.read();
			null !== chunk ? input += chunk : resolve(input);
		})
	});
}



/**
 * Asynchronously load a resource.
 *
 * Node-only.
 *
 * @param {String} url - URL or filesystem path
 * @param {String} encoding - Defaults to "utf8"
 * @return {Promise}
 * @public
 */
function load(url, encoding = "utf8"){
	return new Promise((resolve, reject) => {
		const protocol = url.match(/^https?/);
		
		/** Remote resource: HTTPS or HTTP */
		if(protocol){
			let result = "";
			const {get} = require(protocol[0].toLowerCase());
			const request = get(url, response => {
				if(response.statusMessage !== "OK")
					return reject(response);
				encoding && response.setEncoding(encoding);
				response.on("data", s => result += s);
				response.on("end", () => resolve(result));
			});
			request.on("error", e => reject(e));
		}
		
		/** Assume parameter to be a filesystem path */
		else{
			const fs = require("fs");
			fs.readFile(url, {encoding}, (error, data) => {
				if(error) return reject(error);
				return resolve(data.toString());
			});
		}
	});
}



/**
 * Check if the user agent is a particular version of Internet Explorer.
 *
 * @param {String} version - The version to check against.
 * @param {String} operand - Type of comparison to perform. Use basic JavaScript operators: <, >=, !=, etc.
 * @return {Boolean}
 */
function isIE(version, operand){
	var operands = {
		"<":   "lt ",
		"<=":  "lte ",
		">":   "gt ",
		">=":  "gte ",
		"!=":  "!"
	},

	div            = document.createElement("div");
	div.innerHTML  = "<!--[if "+(operands[operand] || "")+"IE "+version+"]><i></i><![endif]-->";
	return div.getElementsByTagName("i").length;
}




/**
 * Convert a kebab-cased-string into a camelCasedString.
 *
 * @param {String} input
 * @return {String}
 */
function kebabToCamelCase(input){
	return input.toLowerCase().replace(/([a-z])-+([a-z])/g, function(match, a, b){
		return a + b.toUpperCase();
	});
}



/**
 * Convert a camelCased string to its kebab-cased equivalent.
 * Hilariously-named function entirely coincidental.
 * 
 * @param {String} string - camelCasedStringToConvert
 * @return {String} input-string-served-in-kebab-form
 */
function camelToKebabCase(string){

	/** Don't bother trying to transform a string that isn't well-formed camelCase. */
	if(!/^([a-z]+[A-Z])+[a-z]+$/.test(string)) return string;

	return string.replace(/([a-z]+)([A-Z])/g, function(match, before, after){return before + "-" + after;}).toLowerCase();
}



/**
 * Allow an easy way of triggering JavaScript callbacks based on a hash an anchor tag points to.
 * 
 * This also allows "hotlinking" to said actions by including the hash as part of the requested URL.
 * For instance, the following would allow a gallery to be opened on page load:
 *
 *  <a href="#open-gallery">Browse gallery</a>
 *  hashActions({ openGallery: function(){ galleryNode.classList.add("open"); } });
 *
 * @param {Object} actions - An object map of callbacks assigned by key.
 */
function hashActions(actions){
	var id, addEvent = document.addEventListener || function(e,f){this.attachEvent("on"+e,f);};
	for(id in actions) (function(id, callback){
		for(var id = camelToKebabCase(id), links = document.querySelectorAll('a[href="#' + id + '"]'), l = links.length, i = 0; i < l; ++i)
			addEvent.call(links[i], "click", function(e){
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				callback.call(this, e);
				return false;
			});

		/** Trigger the action's callback if its ID is in the document's hash. */
		if(document.location.hash === "#"+id) callback();
	}(id, actions[id]));
}



/**
 * Get or set the value of a cookie with the designated name.
 *
 * @param {String} name - Cookie's name
 * @param {String} value - Value to assign to cookie. Passing NULL deletes the cookie.
 * @param {Object} options - An object literal containing optional parameters to use when setting the cookie (expires/path/domain/secure).
 * @return {String} The cookie's existing value if a value wasn't passed to the function.
 */
function cookie(name, value, options){
	var cutoff, i, l, expires,
	cookies = document.cookie,
	rSplit  = /;\s*/g,
	output  = {},
	decode  = decodeURIComponent;

	/** If called without any arguments, or if an empty value's passed as our name parameter, return a hash of EVERY available cookie. */
	if(!name){
		for(cookies = cookies.split(rSplit), i = 0, l = cookies.length; i < l; ++i)
			if(cookies[i] && (cutoff = cookies[i].indexOf("=")))
				output[cookies[i].substr(0, cutoff)] = decode(cookies[i].substr(cutoff+1));
		return output;
	}


	/** Getter */
	if(undefined === value){
		for(cookies = cookies.split(rSplit),
			cutoff  = name.length + 1,
			i       = 0,
			l       = cookies.length;
			i < l; ++i)
			if(name+"=" === cookies[i].substr(0, cutoff))
				return decode(cookies[i].substr(cutoff));
		return null;
	}


	/** Setter */
	else{
		options = options || {};
		expires = options.expires;

		/** Delete a cookie */
		if(null === value)
			value   = "",
			expires = -1;

		if(expires)
			/** If we weren't passed a Date instance as our expiry point, typecast the expiry option to an integer and use as a number of days from now. */
			expires = (!expires.toUTCString ? new Date(Date.now() + (86400000 * expires)) : expires).toUTCString();

		document.cookie = name+"="+encodeURIComponent(value) + (expires ? "; expires="+expires : "") 
			+ (options.path   ? "; path="   + options.path   : "")
			+ (options.domain ? "; domain=" + options.domain : "")
			+ (options.secure ? "; secure"  : "");
	}
}



/**
 * Wrapper for creating a new DOM element, optionally assigning it a hash of properties upon construction.
 *
 * @param {String} nodeType - Element type to create.
 * @param {Object} obj - An optional hash of properties to assign the newly-created object.
 * @return {Element}
 */
function New(nodeType, obj){
	function absorb(a, b){
		for(const i in b)
			if(Object(a[i]) === a[i] && Object(b[i]) === b[i])
				absorb(a[i], b[i]);
			else a[i] = b[i];
	};
	const node = document.createElement(nodeType);
	if(obj) absorb(node, obj);
	return node;
}



/**
 * Curried method to append multiple nodes at once.
 *
 * @example addTo(node)(el1, el2, …)
 * @example node = addTo(node)(…)[0]
 * @return {Function}
 */
function addTo(parent){
	let count = 0;
	let target = parent;
	
	const fn = (...nodes) => {
		let lastElement;
		
		for(let node of nodes){
			if("string" === typeof node)
				node = document.createTextNode(node);
			else if(node)
				lastElement =
				fn[++count] = node;
			node && target.appendChild(node);
		}
		
		target = lastElement || target;
		return fn;
	};
	fn[count] = target;
	return fn;
}



/**
 * Use a Symbol to store references between objects.
 *
 * Gives new meaning to the term "symbolic link".
 *
 * @param {Symbol} symbol
 * @param {Object} objects
 */
function link(symbol, objects){
	for(const key in objects){
		const obj = objects[key];
		if(obj == null) continue;
		let copyTo = obj[symbol] || {};
		obj[symbol] = Object.assign(copyTo, objects);
	}
}


/**
 * Generate a base64-encoded 4x4-size PNG image of a designated RGBA value.
 *
 * @param {Number} r - Red component (0-255)
 * @param {Number} g - Green component (0-255)
 * @param {Number} b - Blue component (0-255)
 * @param {Number} a - Alpha value (0-255: transparent to opaque)
 *
 * @return {String} A base64-encoded PNG image without a leading data URI prefix (no "data:image/png;base64,"...)
 */
function rgba(r, g, b, a){
	var chr = String.fromCharCode,
	fill    = function(mult, str){ return Array(mult+1).join(str || "\0"); },
	hton    = function(i){ return String.fromCharCode(i >>> 24, i >>> 16 & 255, i >>> 8 & 255, i & 255); },

	/** Binary output */
	img     = "\x89PNG\15\12\32\12\0\0\0\15IHDR\0\0\0\4\0\0\0\4\10\6\0\0\0\xA9\xF1\x9E~\0\0\0O",

	/** IDAT (Image Data) chunk. */
	idat    = "IDAT\10\35\1D\0\xBB\xFF",
	data    = "\1" + chr(r) + chr(g) + chr(b) + chr(a) + fill(12) + "\2" + fill(2, fill(16) + "\2") + fill(16),

	crc1    = hton(function(data){
		/** Addler's algorithm */
		for(var a = 1, b = i = 0, l = data.length, k = 65521; i < l; ++i)
			a  = (a + data.charCodeAt(i)) % k,
			b  = (b + a) % k;
		return b << 16 | a;
	}(data)),

	crc2    = hton(function(data){
		/** CRC32 */
		for(var c = ~0, i = 0; i < data.length; ++i)
			for(var b = data.charCodeAt(i) | 0x100; b != 1; b >>>= 1)
				c = (c >>> 1) ^ ((c ^ b) & 1 ? 0xEDB88320 : 0);
		return ~c;
	}(idat + data + crc1));


	/** Stitch the IDAT chunk together and write the IEND chunk to wrap it up. */
	return (function(data){

		/** Base64-encode that bitch. */
		for(var enc = "", c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 5, n = data.length * 8 + 5; i < n; i += 6)
			enc += c[(data.charCodeAt(~~(i/8)-1) << 8 | data.charCodeAt(~~(i/8))) >> 7 - i%8 & 63];
		for(; enc.length % 4; enc += "=");
		return enc;

	}( img + idat+data+crc1+crc2 + fill(4)+"IEND\xAEB`\x82" ));
}





/** Decodes a UTF-8 string into a stream of single-byte sequences. */
function UTF8Decode(data){
	for(var char = String.fromCharCode, data = data.replace(/\r\n/g, "\n"), s = "", c, i = 0, l = data.length; i < l; ++i){
		c = data.charCodeAt(i);
		if(c < 128)                       s += char(c);
		else if((c > 127) && (c < 2048))  s += char((c >> 6)  | 192) + char((c & 63)        | 128);
		else                              s += char((c >> 12) | 224) + char(((c >> 6) & 63) | 128) + char((c & 63) | 128);
	}
	return s;
};

/** Encodes a sequence of single-byte characters as a UTF-8 string. */
function UTF8Encode(data){
	var s   = "",
	c       = "",
	i       = 0,

	length  = data.length,
	at      = "charCodeAt",
	char    = String.fromCharCode;

	while(i < length){
		c   = data[at](i);
		if(c < 128){                      s += char(c); ++i; }
		else if((c > 191) && (c < 224)){  s += char(((c & 31) << 6)  | (data[at](i+1) & 63)); i += 2; }
		else{                             s += char(((c & 15) << 12) | ((data[at](i+1) & 63) << 6) | (data[at](i+2) & 63)); i += 3; }
	}

	return s;
};



/** Encodes a string using MIME Base64 */
function base64Encode(data){

	/** Convert UTF-8 strings to whatever "normal" encoding is needed for JavaScript to safely manipulate at binary-level. */
	data = (function(data){
		for(var char = String.fromCharCode, data = data.replace(/\r\n/g, "\n"), s = "", c, i = 0, l = data.length; i < l; ++i){
			c = data.charCodeAt(i);
			if(c < 128)                      s += char(c);
			else if((c > 127) && (c < 2048)) s += char((c >> 6)  | 192) + char((c & 63)        | 128);
			else                             s += char((c >> 12) | 224) + char(((c >> 6) & 63) | 128) + char((c & 63) | 128);
		}
		return s;
	}(data));


	/** Apply the actual base64 encoding */
	for(var enc = "", c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 5, n = data.length * 8 + 5; i < n; i += 6)
		enc += c[(data.charCodeAt(~~(i/8)-1) << 8 | data.charCodeAt(~~(i/8))) >> 7 - i%8 & 63];
	for(; enc.length % 4; enc += "=");
	return enc;
}



/** Decodes a base64-encoded string */
function base64Decode(data){
	var a, b, c, d, s = "",

	char   = String.fromCharCode,
	codex  = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	data   = data.replace(/[^A-Za-z0-9\+\/=]/g, ""),
	i      = 0,
	l      = data.length;

	while(i < l){
		a  = codex.indexOf(data[i++]),
		b  = codex.indexOf(data[i++]),
		c  = codex.indexOf(data[i++]),
		d  = codex.indexOf(data[i++]);
		s += char((a << 2) | (b >> 4));
		if(64 !== c)   s += char(((b & 15) << 4) | (c >> 2));
		if(64 !== d)   s += char(((c &  3) << 6) | d);
	}

	/** Re-encode the data as UTF-8 */
	s = (function(data){
		var s  = "",
		c      = "",
		i      = 0,
		length = data.length,
		at     = "charCodeAt",
		char   = String.fromCharCode;
		
		while(i < length){
			c  = data[at](i);
			if(c < 128){                      s += char(c); ++i; }
			else if((c > 191) && (c < 224)){  s += char(((c & 31) <<  6) |  (data[at](i+1) & 63)); i += 2; }
			else{                             s += char(((c & 15) << 12) | ((data[at](i+1) & 63) << 6) | (data[at](i+2) & 63)); i += 3; }
		}
		
		return s;
	}(s));

	return s;
}



/**
 * Stop a function from firing too quickly.
 *
 * Returns a copy of the original function that runs only after the designated
 * number of milliseconds have elapsed. Useful for throttling onResize handlers.
 *
 * @param {Function} fn - Original function to debounce
 * @param {Number} limit - Threshold to stall execution by, in milliseconds.
 * @param {Boolean} soon - If TRUE, will call the function *before* the threshold's elapsed, rather than after.
 * @return {Function}
 */
function debounce(fn, limit, soon){
	var started, context, args, timer,
	limit   = limit < 0 ? 0 : limit,

	delayed = function(){

		/** Get the time between now and when the function was first fired. */
		var timeSince = Date.now() - started;

		if(timeSince >= limit){
			if(!soon) fn.apply(context, args);
			if(timer) clearTimeout(timer);
			timer = context = args = null;
		}

		else timer = setTimeout(delayed, limit - timeSince);
	};


	/** Debounced copy of the original function. */
	return function(){
		context = this,
		args    = arguments;

		if(!limit)
			return fn.apply(context, args);

		started = Date.now();
		if(!timer){
			if(soon) fn.apply(context, args);
			timer = setTimeout(delayed, limit);
		}
	};
}



/**
 * Run a callback once an image's dimensions are accessible.
 *
 * The function will also be executed if an image fails to load, and should
 * serve as no indicator of the image's actual loading status. Note that IE
 * doesn't fire this event if the user cancels the loading of a webpage
 * before an image has a chance to begin loading.
 *
 * @param {HTMLImageElement} img - Image element to monitor
 * @param {Function} fn - Callback to execute
 */
function onSizeKnown(img, fn){
	
	/** Huzzah, nothing to do here! Everybody go home early! */
	if((isReady = function(){ return img.complete || img.naturalWidth || img.naturalHeight })()){
		fn.call(null, img); return;
	}
	
	var isReady;
	var eventTypes = ["abort", "error", "load"];
	var check   = function(e){(isReady() || (e && e.type === "error")) && done()};
	var done    = function(){
		clearInterval(intervalID);
		for(i = 0; i < 3; ++i) img.removeEventListener(eventTypes[i], check);
		fn.call(null, img);
	}
	
	var intervalID = setInterval(check, 20), i;
	for(i = 0; i < 3; ++i) img.addEventListener(eventTypes[i], check)
}



/**
 * Generate a generic AST based on line indentation.
 *
 * The returned array is populated with objects, which are in turn enumerated with
 * 1-2 properties: "name" (holding the line's textual content, sans whitespace),
 * and "children" (an array of child objects holding the same data).
 *
 * The parent/child relationships are described by their leading indentation.
 *
 * NOTE: Only proper indentation is considered (hard tabs). "Soft tabs" will NOT work.
 *
 * @param {String}
 * @return {Array}
 */
function tokeniseOutline(str){
	
	/** Drop leading and trailing blank lines */
	str = str.replace(/^([\x20\t]*\n)*|(\n\s*)*$/g, "");
	
	/** Define how many leading tabs to ignore based on the first line's indentation */
	let indent = str.match(/^[\t\x20]+(?=\S)/);
	if(indent)
		str = str.replace(new RegExp("^"+indent[0], "gm"), "");
	
	
	/** Start going through lines */
	let lines        = str.split(/\n+/g);
	let results      = [];
	let currentLevel = 0;
	let previousItem;
	
	for(let l of lines){
		let level = l.match(/^\t*/)[0].length;
		let name  = l.replace(/^\t+/, "");
		let item  = {
			level:  level,
			name:   name,
			toJSON: function(){
				let result = Object.assign({}, this);
				delete result.parent;
				return result;
			}
		};
		

		/** Indenting */
		if(level > currentLevel){
			item.parent = previousItem;
			(previousItem.children = previousItem.children || []).push(item);
			currentLevel = level;
		}
		
		/** Outdenting */
		else if(level < currentLevel){
			while(previousItem){
				if(previousItem.level <= level){
					currentLevel = previousItem.level;
					previousItem.parent
						? previousItem.parent.children.push(item)
						: results.push(item);
					item.parent = previousItem.parent;
					break;
				}
				previousItem = previousItem.parent;
			}
		}
		
		
		/** New sibling */
		else{
			if(level){
				previousItem = previousItem.parent;
				previousItem.children.push(item)
				item.parent = previousItem;
			}
			else results.push(item)
		}
		
		previousItem = item;
	}
	
	return results;
}
