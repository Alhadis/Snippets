function random(min, max){
	return Math.floor(Math.random() * max - min + 1) + min;
}

function percent(value, outOf, startAt){
	var startAt	=	(startAt == undefined) ? 0 : startAt;
	return ((value-startAt) / (outOf-startAt)) * 100;
}

function percentOf(percentage, outOf, startAt){
	return ((percentage / 100) * (outOf - ((startAt == undefined) ? 0 : startAt)));
}

/** Measures the arctangent between two points (the angle required for one point to face another). */
function angleTo(a, b){
	return (Math.atan2(b[1] - a[1], a[0] - b[0])) * 180 / Math.PI;
}

/** Measures the distance between two points. */
function distance(a, b){
	return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

/** Converts radians to degrees. */
function radToDeg(value){
	return value * 180 / Math.PI;
}

/** Converts degrees to radians. */
function degToRad(value){
	return value * Math.PI / 180;
}


/** Applies De Casteljau's algorithm to an array of points to ascertain the final midpoint. */
function deCasteljau(points, p){
	var a, b, i, p	=	p || .5,
		midpoints	=	[];

	while(points.length > 1){

		for(i = 0; i < points.length - 1; ++i){
			a	=	points[i];
			b	=	points[i+1];

			midpoints.push([
				a[0] + ((b[0] - a[0]) * p),
				a[1] + ((b[1] - a[1]) * p)
			]);
		}

		points		=	midpoints;
		midpoints	=	[];
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
	var val	=	value.toString();
	if(val.length < min)
		val	=	Array(min - val.length + 1).join("0") + val;
	return val;
}




/**
 * Formats a number of bytes for human-readable output.
 * @param {Number} input - Number of bytes.
 * @return {String} A reader-friendly representation of filesize.
 */
function formatBytes(input){
	var bytes = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
	for(val in bytes) if(input >= 1024) input = input / 1024; else break;
	return Math.round(input*100)/100+" "+bytes[val];
}



/**
 * Parses a well-formed URL query string into an associative array.
 * 
 * @param {String} q - If supplied, will be used instead of the current document's own URL.
 * @return {Object} A hash enumerated with key/value pairs found in the parsed string.
 */
function unserialiseQuery(q){
	var q	=	q || document.location.search;
	if(!q) return {};
	q	=	q.replace(/^\?/, "").split(/&/g);
	for(var output = {}, i = 0; i < q.length; ++i){
		if(!i) continue;
		q[i]	=	q[i].split(/=/);
		output[q[i][0]]	=	q[i].slice(1).join("=");
	}
	return output;
}


/**
 * Returns the subproperty located on an object at the designated path.
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
	var	path	=	path.replace(/\[(['"])?([^\]]+)\1\]/g, ".$2").split(/\./g),
		prev	=	object, p, i = 0, l = path.length;
	for(; i < l; ++i){
		p	=	path[i];
		if(prev === undefined || !(p in prev)) return useLast ? prev : undefined;
		prev	=	prev[p];
		if(i >= l-1) return prev;
	}
	return undefined;
}



/**
 * Returns the English ordinal suffix for a number (-st, -nd, -rd, -th)
 *
 * @param {Number} n - A number (preferably an integer) to return the suffix for.
 * @return {String}
 */
function ordinalSuffix(n){
	return [,"st", "nd", "rd"][((n %= 100) > 10 && n < 20) ? 0 : (n % 10)] || "th";
}


/**
 * Returns a number of milliseconds from a string representing a time value in CSS.
 *
 * @param {String} t - A CSS time value such as "3200ms" or "4s".
 * @return {Number}
 */
function parseDuration(t){
	if(typeof t != "string")	return t;
	if(/\ds\s*$/i.test(t))		return parseFloat(t) * 1000;
	else						return parseFloat(t);
}



/**
 * Ascertains a browser's support for a CSS property.
 * 
 * @param {String} n - CSS property name, supplied in sentence case (e.g., "Transition")
 * @return {Boolean} TRUE if the browser supports the property in either prefixed or unprefixed form. 
 */
function cssSupport(n){
	var s	=	document.documentElement.style;
	if(n.toLowerCase() in s) return true;
	for(var p = "Webkit Moz Ms O Khtml", p = (p.toLowerCase() + p).split(" "), i = 0; i < 10; ++i)
		if(p[i]+n in s) return true;
	return false;
}




/**
 * Returns TRUE if a browser appears to support a given CSS unit.
 *
 * @param {String} unit - Name of a CSS unit (e.g., em, rem, vmax)
 * @return {Boolean}
 */
function cssUnitSupport(unit){
	try{
		var d			=	document.createElement("div");
		d.style.width	=	"32"+unit;
		return d.style.width == "32"+unit;
	}	catch(e){return false;}
}



/**
 * Returns the width of the scrollbars being displayed by this user's OS/device.
 * @return {Number}
 */
function getScrollbarWidth(){
	var el	=	document.createElement("div");
	el.style.width		=	"120px";
	el.style.height		=	"60px";
	el.style.overflow	=	"auto";
	el.innerHTML		=	Array(150).join(" W ");
	(document.body || document.documentElement).appendChild(el);

	var output	=	el.offsetWidth - el.scrollWidth;
	el.parentNode.removeChild(el);
	return output;
}



/** Exports a table's data as an array of object literals. */
HTMLTableElement.prototype.extract	=	function(){

	/** Iterator variables */
	var i, l,

	/** Arrays to load our data into. */
		headers	=	[],
		data	=	[],


	/** Gather our column names */
	th		=	this.tHead.querySelectorAll("tr:first-child > th"),
	headers	=	[];
	for(i = 0, l = th.length; i < l; ++i)
		headers.push(th[i].textContent.trim());


	/** Next, start collecting our data. */
	for(i = 0, l = this.tBodies.length; i < l; ++i){
		(function(body, data){
			var	row		=	0,
				numRows	=	body.children.length,
				cells, numCells, c, item;

			for(; row < numRows; ++row){
				cells		=	body.children[row].children,
				c			=	0,
				numCells	=	cells.length,
				item		=	{};
				for(; c < numCells; ++c)
					item[headers[c]]	=	cells[c].textContent.trim();
				data.push(item);
			}

		}(this.tBodies[i], data));
	}

	return data;
};



/**
 * Inclusive string splitting method. Similar to String.prototype.split, except
 * matching results are always included as part of the returned array.
 *
 * @param {RegExp} pattern - The pattern to split the string by.
 * @this {String}
 * @return {Array}
 */
String.prototype.isplit	=	function(pattern){
	var	output			=	[],
		startFrom		=	0,
		match;
	while(match = pattern.exec(this)){
		output.push(this.substring(startFrom, pattern.lastIndex - match[0].length), match[0]);
		startFrom	=	pattern.lastIndex;
	}
	if(startFrom < this.length)
		output.push(this.substring(startFrom, this.length));
	return output;
};



/**
 * Converts a string to title case using crude/basic English capitalisation rules.
 *
 * @this {String}
 * @return {String}
 */
String.prototype.toTitleCase	=	function(){
	var ignore	=	(function(o){
		var h	=	{};
		for(var i in o) h[o[i]] = true;
		return h;
	}("the a an and but or nor of to in on for with to".split(" "))),

	o	=	this.toLowerCase().replace(/\b(\w)(\w+)?/gi, function(word, firstLetter, remainder, index, input){
		
		/** Matching a single letter. */
		if(remainder === undefined){
			return firstLetter.toUpperCase();
		}
		if(	/** Ignore certain words that're supposed to be left lowercase between words. */
			ignore[word] ||

			/** Beware of contractions. */
			("'" === input[index-1] && /\w'$/.test(input.substring(index, 0)))
		)	return word;

		return firstLetter.toUpperCase() + remainder;
	})

	/** Make sure "I" is always capitalised! */
	.replace(/\bi\b/g, "I");

	return o[0].toUpperCase() + o.slice(1);
};



/**
 * Truncates a block of text to a designated number of characters or words, returning the split result as an array.
 * Default behaviour is to split the text at 25 characters, breaking words if need be.
 *
 * @param {String} Text to operate on.
 * @param {Object} Options for fine-tuning the truncation result. Possible options are:
 *	-	by:			{Enum}		Whether to measure text based on word or character limit (Values: "char" or "word").
 *	-	limit:		{Number}	Maximum number of words/characters permitted before breaking.
 *	-	cutoff:		{Mixed}		Decides where and if to break a word to meet the character limit.
 *	-	I'll finish this off later, probably...
 */
function truncate(string){
	if(arguments.length < 2 || !string) return [string || ""];

	/** Default arguments. */
	var args	=	{
		limit:		25,
		by:			"char",
		cutoff:		"break",
		trim:		true
	};


	/** If passed a number as our second argument, simply set the limit parameter. */
	if("number" === typeof arguments[1])
		args.limit	=	arguments[1];


	/** Otherwise, simply merge our supplied arguments into our defaults. */
	else for(var i in arguments[1])
		args[i]	=	arguments[1][i];
	

	/** Lowercase our string-typed arguments for easier comparison. */
	args.by			=	args.by.toLowerCase();
	args.cutoff		=	"string" === typeof args.cutoff ? args.cutoff.toLowerCase() : +(args.cutoff);



	/** Trim leading/trailing whitespace from our string */
	if(args.trim)
		string	=	string.replace(/(^\s+|\s+$)/g, "");



	/** Truncating based on word count. */
	if("word" === args.by){
		var words	=	string.split(/\s+/);

		if(words.length <= args.limit) return [string];

		return [
			words.slice(0, args.limit).join(" "),
			words.slice(args.limit).join(" ")
		];
	}



	/** Truncating based on character count (default behaviour). */
	else{
		if(string.length < args.limit) return [string];


		/** Break text mid-word; or, the character at the cutoff point is whitespace anyway. */
		if(!args.cutoff || "break" === args.cutoff || /\s/.test(string[args.limit])) return [
			string.substring(0, args.limit),
			string.substring(args.limit)
		];


		/** Some word-preservation behaviour is in order, so let's dig a little closer into the string's contents. */
		var before		=	string.substring(0, args.limit),
			after		=	string.substring(args.limit),
			lastStart	=	before.match(/(\s*)(\S+)$/),
			lastEnd		=	after.match(/^\S+/);



		/** Always include the last word in the untruncated half of the string. */
		if("after" === args.cutoff) return [
			string.substring(0,	before.length + lastEnd[0].length),
			string.substring(	before.length + lastEnd[0].length)
		];


		/** Never include the final word in the untruncated result. */
		else if("before" === args.cutoff) return [
			string.substring(0,	before.length - lastStart[0].length),
			string.substring(	before.length - lastStart[0].length)
		];


		/** Otherwise, use an arbitrary threshold point to determine where the threshold should lie. */
		else{
			var lastWord	=	lastStart[2] + lastEnd;

			/** If supplied a floating point number, interpret it as a percentage of the affected word's length. */
			if(args.cutoff > 0 && args.cutoff < 1)
				args.cutoff	=	Math.round(lastWord.length * args.cutoff);


			/** Word's cutoff length is still less than the desired truncation limit. Include the word in the first half. */
			if(args.limit > (before.length - lastStart[2].length)+args.cutoff) return [
				string.substring(0,	before.length - lastStart[0].length),
				string.substring(	before.length - lastStart[0].length)
			];

			/** Otherwise, do the opposite of what the above comment just said. */
			return [
				string.substring(0,	before.length + lastEnd[0].length),
				string.substring(	before.length + lastEnd[0].length)
			];
		}
	}

	return [string];
}


/**
 * Returns the number of words in a string. Hyphenation is ignored: "twenty-two" will be read as two words instead of one.
 * @param {String} input - Text to measure the word count of.
 * @return {Number}
 */
function wordCount(input){
	var words	=	input.replace(/[^\w-_]+/g, " ").replace(/^\s+|\s+$/g, "").split(/\s+/g);
	return words[0] ? words.length : 0;
}



/**
 * Executes a callback function on every text node found within an element's descendants.
 * 
 * @param {Element} el - Element to parse the contents of.
 * @param {Function} fn - Callback executed on each text node. Passed two args: the text node itself, and the currentl depth level.
 * @param {Number} depth - Internal use only. Current number of recursion levels.
 * 
 * @return {Element} The HTML element originally passed to the function.
 */
function walkTextNodes(el, fn, depth){
	depth	=	depth || 0;

	var children	=	Array.prototype.slice.call(el.childNodes, 0);
	for(var n, l = children.length, i = 0; i < l; ++i){
		n	=	children[i];
		if(n.nodeType === Node.TEXT_NODE)
			fn.call(this, n, depth);
		else if(n.nodeType === Node.ELEMENT_NODE)
			walkTextNodes(n, fn, depth+1);
	}
	return el;
};


/**
 * Injects <wbr /> elements into any lengthy words found in each text node found within an element's descendants.
 *
 * @uses walkTextNodes
 * @param {Element} element - DOM element to operate on.
 * @param {Number} limit - Number of characters to traverse in a single word before inserting a breakpoint.
 */
function injectWordBreaks(element, limit){

	walkTextNodes(element, function(node){
		var original	=	node;
		var terminators	=	'.,+*?$|#{}()\\^\\-\\[\\]\\\\\/!%\'"~=<>_:;\\s';
		var splitAt		=	new RegExp("([^" + terminators + "]{" + limit + "})", "g");
		
		/** Collect a list of insertion points. */
		var breakPoints	=	[];
		while(splitAt.exec(node.data))
			breakPoints.push(splitAt.lastIndex);
	
		for(var otherHalf, i = breakPoints.length - 1; i >= 0; --i){
			otherHalf	=	node.splitText(breakPoints[i]);
			node.parentNode.insertBefore(document.createElement("wbr"), otherHalf);
		}
	});
}


/**
 * Checks if the user agent is a particular version of Internet Explorer.
 *
 * @param {String} version - The version to check against.
 * @param {String} operand - Type of comparison to perform. Use basic JavaScript operators: <, >=, !=, etc.
 * @return {Boolean}
 */
function isIE(version, operand){
	var operands	=	{
		"<":	"lt ",
		"<=":	"lte ",
		">":	"gt ",
		">=":	"gte ",
		"!=":	"!"
	};

	var div			=	document.createElement("div");
	div.innerHTML	=	"<!--[if "+(operands[operand] || "")+"IE "+version+"]><i></i><![endif]-->";
	return div.getElementsByTagName("i").length;
}




/**
 * Converts a camelCased string to its kebab-cased equivalent.
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
 *	<a href="#open-gallery">Browse gallery</a>
 *	hashActions({ openGallery: function(){ galleryNode.classList.add("open"); } });
 * 
 * @param {Object} actions - An object map of callbacks assigned by key.
 */
function hashActions(actions){
	var addEvent	=	document.addEventListener || function(e,f){this.attachEvent("on"+e,f);};
	for(var id in actions) (function(id, callback){
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

	/** If called without any arguments, or if an empty value's passed as our name parameter, return a hash of EVERY available cookie. */
	if(!name){
		var cookies	=	document.cookie.split(/;\s*/g),
			output	=	{},
			cutoff, i, len;
		for(i = 0, len = cookies.length; i < len; ++i)
			if(cutoff = cookies[i].indexOf("="))
				output[cookies[i].substr(0, cutoff)] = decodeURIComponent(cookies[i].substr(cutoff+1));
		return output;
	}


	/** Getter */
	if(undefined === value){
		cookies	=	document.cookie.split(/;\s*/g),
		cutoff	=	name.length + 1;

		for(var i = 0, len = cookies.length; i < len; ++i)
			if(name+"=" === cookies[i].substr(0, cutoff))
				return decodeURIComponent(cookies[i].substr(cutoff));
		return null;
	}


	/** Setter */
	else{
		options	=	options || {};

		/** Delete a cookie */
		if(null === value){
			value			=	"";
			options.expires	=	-1;
		}

		/** Expiry date */
		if(options.expires){
			var expiry	=	options.expires,

			/** If we weren't passed a Date instance as our expiry point, typecast the expiry option to an integer and use as a number of days from now. */
			expiry	=	(!expiry.toUTCString ? new Date(Date.now() + (86400000 * expiry)) : expiry).toUTCString();
		}

		document.cookie	=	name+"="+encodeURIComponent(value) + (expiry ? "; expires="+expiry : "") 
			+	(options.path ? "; path="+options.path : "")
			+	(options.domain ? "; domain="+options.domain : "")
			+	(options.secure ? "; secure" : "");
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
	var	node	=	document.createElement(nodeType),
		absorb	=	function(a, b){
			for(i in b)
				if(Object(a[i]) === a[i] && Object(b[i]) === b[i])
					absorb(a[i], b[i]);
				else a[i] =	b[i];
		};
	if(obj) absorb(node, obj);
	return node;
}



/**
 * Generates a base64-encoded 4x4-size PNG image of a designated RGBA value.
 *
 * @param {Number} r - Red component (0-255)
 * @param {Number} g - Green component (0-255)
 * @param {Number} b - Blue component (0-255)
 * @param {Number} a - Alpha value (0-255: transparent to opaque)
 *
 * @return {String} A base64-encoded PNG image without a leading data URI prefix (no "data:image/png;base64,"...)
 */
function rgba(r, g, b, a){
	var	chr		=	String.fromCharCode,
		fill	=	function(mult, str){ return Array(mult+1).join(str || "\0"); },
		hton	=	function(i){ return String.fromCharCode(i >>> 24, i >>> 16 & 255, i >>> 8 & 255, i & 255); },


		/** Binary output */
		img		=	"\x89PNG\15\12\32\12\0\0\0\15IHDR\0\0\0\4\0\0\0\4\10\6\0\0\0\xA9\xF1\x9E~\0\0\0O",

		/** IDAT (Image Data) chunk. */
		idat	=	"IDAT\10\35\1D\0\xBB\xFF",
		data	=	"\1" + chr(r) + chr(g) + chr(b) + chr(a) + fill(12) + "\2" + fill(2, fill(16) + "\2") + fill(16),

		crc1	=	hton(function(data){
			/** Addler's algorithm */
			for(var	a = 1, b = i = 0, l	= data.length, k = 65521; i < l; ++i)
				a	=	(a + data.charCodeAt(i)) % k,
				b	=	(b + a) % k;
			return b << 16 | a;
		}(data)),

		crc2	=	hton(function(data){
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

		}(	img + idat+data+crc1+crc2 +	fill(4)+"IEND\xAEB`\x82" ));
}



/** Compressed version for use in production sites. */
function rgba(r,n,t,o){var x=String.fromCharCode,e=function(r,n){return Array(r+1).join(n||"\0")},a=function(r){return String.fromCharCode(r>>>24,r>>>16&255,r>>>8&255,255&r)},f="\x89PNG\15\12\32\12\0\0\0\15IHDR\0\0\0\4\0\0\0\4\10\6\0\0\0\xA9\xF1\x9E~\0\0\0O",u="IDAT\10\35\1D\0\xBB\xFF",c="\1"+x(r)+x(n)+x(t)+x(o)+e(12)+"\2"+e(2,e(16)+"\2")+e(16),h=a(function(r){for(var n=1,t=i=0,o=r.length,x=65521;o>i;++i)n=(n+r.charCodeAt(i))%x,t=(t+n)%x;return t<<16|n}(c)),C=a(function(r){for(var n=-1,t=0;t<r.length;++t)for(var o=256|r.charCodeAt(t);1!=o;o>>>=1)n=n>>>1^(1&(n^o)?3988292384:0);return~n}(u+c+h));return function(r){for(var n="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=5,x=8*r.length+5;x>o;o+=6)n+=t[(r.charCodeAt(~~(o/8)-1)<<8|r.charCodeAt(~~(o/8)))>>7-o%8&63];for(;n.length%4;n+="=");return n}(f+u+c+h+C+e(4)+"IEND\xAEB`\x82")}




/** Decodes a UTF-8 string into a stream of single-byte sequences. */
function UTF8Decode(data){
	for(var char = String.fromCharCode, data = data.replace(/\r\n/g, "\n"), s = "", c, i = 0, l = data.length; i < l; ++i){
		c	=	data.charCodeAt(i);
		if(c < 128)							s	+=	char(c);
		else if((c > 127) && (c < 2048))	s	+=	char((c >> 6)	| 192) + char((c & 63)			| 128);
		else								s	+=	char((c >> 12)	| 224) + char(((c >> 6) & 63)	| 128) + char((c & 63) | 128);
	}
	return s;
};

/** Encodes a sequence of single-byte characters as a UTF-8 string. */
function UTF8Encode(data){
	var	s	=
		c	=	"",
		i	=	0,

		length	=	data.length,
		at		=	"charCodeAt",
		char	=	String.fromCharCode;

	while(i < length){
		c	=	data[at](i);
		if(c < 128){						s	+=	char(c); ++i;	}
		else if((c > 191) && (c < 224)){	s	+=	char(((c & 31) << 6)	| (data[at](i+1) & 63));	i += 2;	}
		else{								s	+=	char(((c & 15) << 12)	| ((data[at](i+1) & 63) << 6) | (data[at](i+2) & 63)); i += 3; }
	}

	return s;
};



/** Encodes a string using MIME Base64 */
function base64Encode(data){

	/** Convert UTF-8 strings to whatever "normal" encoding is needed for JavaScript to safely manipulate at binary-level. */
	data	=	(function(data){
		for(var char = String.fromCharCode, data = data.replace(/\r\n/g, "\n"), s = "", c, i = 0, l = data.length; i < l; ++i){
			c	=	data.charCodeAt(i);
			if(c < 128)							s	+=	char(c);
			else if((c > 127) && (c < 2048))	s	+=	char((c >> 6)	| 192) + char((c & 63)			| 128);
			else								s	+=	char((c >> 12)	| 224) + char(((c >> 6) & 63)	| 128) + char((c & 63) | 128);
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
	var	a = b = c = d = s =	"",

	char	=	String.fromCharCode,
	codex	=	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	data	=	data.replace(/[^A-Za-z0-9\+\/=]/g, ""),
	i		=	0,
	l		=	data.length;

	while(i < l){
		a	=	codex.indexOf(data[i++]),
		b	=	codex.indexOf(data[i++]),
		c	=	codex.indexOf(data[i++]),
		d	=	codex.indexOf(data[i++]);
						s	+=	char((a << 2) | (b >> 4));
		if(64 !== c)	s	+=	char(((b & 15) << 4) | (c >> 2));
		if(64 !== d)	s	+=	char(((c & 3) << 6) | d);
	}

	/** Re-encode the data as UTF-8 */
	s	=	(function(data){
		var	s = c = "",
			i		=	0,
			length	=	data.length,
			at		=	"charCodeAt",
			char	=	String.fromCharCode;

		while(i < length){
			c	=	data[at](i);
			if(c < 128){						s	+=	char(c); ++i;	}
			else if((c > 191) && (c < 224)){	s	+=	char(((c & 31) << 6)	| (data[at](i+1) & 63));	i += 2;	}
			else{								s	+=	char(((c & 15) << 12)	| ((data[at](i+1) & 63) << 6) | (data[at](i+2) & 63)); i += 3; }
		}

		return s;
	}(s));

	return s;
}



/**
 * Format a string using one or more values.
 *
 * Replicates PHP's own implementation of the sprintf function, albeit with slightly more lenient error handling.
 * @return {String}
 */
String.prototype.sprintf	=	function(){
	var output		=	"", m,
		argValue,
		argMod,
		argType,
		argIndex	=	0,
		lastIndex	=	0,
		tokens		=	/%(?=[-+%\d\$bcdeEfFgGosuxX]|(?: |0|'.))(\d+\$)?([-+]*)( |0|'.)?([-+]*)(\d+)?(\.\d+)?([%bcdeEfFgGosuxX])?/g;


	while(m = tokens.exec(this)){
		var matchedToken	=	m[0],
			argument		=	m[1],
			signs			=	(m[2] || "") + (m[4] || ""),
			plus			=	signs.indexOf("+") >= 0,
			alignLeft		=	signs.indexOf("-") >= 0,

			padding			=	m[3] || " ",
			width			=	m[5] || 0,
			precision		=	m[6],
			type			=	m[7],
			argMod			=	"";


			/** Check for a custom padding character. */
			if("'" === padding.charAt(0))
				padding		=	padding.charAt(1);

			/** If a precision specifier was supplied, coerce it to a scalar value */
			if(precision && precision.length > 1)
				precision	=	precision.substr(1);


		/** Append the previous string segment to our formatted output. */
		if(m.index) output	+=	this.substring(lastIndex, m.index);
		lastIndex			=	m.index + matchedToken.length;


		/** Argument indexing */
		if(undefined === argument){
			argValue	=	arguments[argIndex];
			++argIndex;
		}

		else{
			argValue	=	arguments[parseInt(argument)-1];
			if(undefined === argValue) argValue	=	"";
		}


		/** Percentage literal */
		if("%" === type)	output	+=	"%";


		/** String */
		else if("s" === type){
			argMod		=	String(argValue);
			if(precision)
				argMod	=	argMod.substr(0, precision);
		}


		/** Integer-type specifiers */
		else if(/[ducoxXb]/.test(type)){
			argMod		=	parseInt(argValue) || 0;

			/** If aligning left and padding with zeroes, pad with spaces instead. Weird PHP behaviour, whatever. */
			if(alignLeft && "0" === padding)
				padding	=	" ";

			/** Decimal (as Integer) */
			if("d" === type)		argMod	=	(plus && argMod >= 0 ? "+" : "") + argMod.toString();


			/** Unsigned integer */
			else if("u" === type)	argMod	=	(parseInt(argMod) >>> 0);


			/** ASCII codepoint (as Integer) */
			else if("c" === type){
				output	+=	String.fromCharCode(parseInt(argMod));
				continue; /** Skip padding, etc */
			}

			/** Octal */
			else if("o" === type)	argMod	=	argMod.toString(8);


			/** Hexadecimal value */
			else if("x" === type || "X" === type){
				argMod	=	parseInt(argMod).toString(16);
				if("X" === type)
					argMod	=	argMod.toUpperCase();
			}

			/** Binary (as Integer) */
			else if("b" === type) argMod	=	(argMod >>> 0).toString(2);
		}



		/** Assume it's a double-type specifier */
		else{
			argMod		=	parseFloat(argValue) || 0.0,
			precision	=	precision || 6,
			plus		=	plus && argMod >= 0 ? "+" : "";

			/** Float */
			if("f" === type || "F" === type)
				argMod	=	argMod.toFixed(precision);


			/** Scientific notation */
			else if("e" === type || "E" === type)
				argMod	=	argMod.toExponential(precision),
				argMod	=	("E" === type) ? argMod.toUpperCase() : argMod.toLowerCase();


			/** "Shorter of %e and %f". Which is just a weird way of saying "Yeah, it's almost the same as %f". */
			else if("g" === type || "G" === type)
				argMod	=	argMod.toPrecision(precision)

				/** Drop any trailing zeroes (as long as it's not exponential notation). */
				.replace(/^(\d+(?=[\.\d]+))((?:\.0+)|(?:(\.\d*[1-9]+)(0+)))$/m, "$1$3");
			
			argMod	=	plus + argMod;
		}


		/** Check for padding */
		argMod	=	String(argMod);
		if(argMod.length < width){
			argMod	=	[Array((width - argMod.length)+1).join(padding), argMod],
			argMod	=	(alignLeft ? argMod.reverse() : argMod).join("");
		}

		output	+=	argMod;
	}

	if(lastIndex < this.length)
		output	+=	this.substr(lastIndex);

	return output;
};



/**
 * Returns a formatted version of the date instance using PHP-style date syntax.
 *
 * @param {String} format - Format of the generated date string.
 * @param {Boolean} UTC - Whether to convert the date to UTC before formatting.
 * @return {String}
 */
Date.prototype.format	=	function(format, UTC){

	/** Formatted string. */
	var	output	=	"",


	/** Mapped strings */
		days	=	["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		months	=	["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

	/** Pre-cached values */
		day		=	UTC ? this.getUTCDay()			:	this.getDay(),
		date	=	UTC ? this.getUTCDate()			:	this.getDate(),
		month	=	UTC ? this.getUTCMonth()		:	this.getMonth(),
		year	=	UTC ? this.getUTCFullYear()		:	this.getFullYear(),
		time	=										this.getTime(),
		hour	=	UTC ? this.getUTCHours()		:	this.getHours(),
		minute	=	UTC ? this.getUTCMinutes()		:	this.getMinutes(),
		second	=	UTC ? this.getUTCSeconds()		:	this.getSeconds(),
		ms		=	UTC ? this.getUTCMilliseconds()	:	this.getMilliseconds(),
		tz		=	UTC ? 0 : this.getTimezoneOffset(),
		tzStr	=	UTC ? "+0000"	: ((tz <= 0 ? "+" : "-") + ("0000" + ((Math.floor((v = Math.abs(tz)) / 60) * 100) + v % 60)).substr(-4)),
		tzStrC	=	UTC ? "+00:00"	: tzStr.substr(0, 3) + ":" + tzStr.substr(-2),
		leap	=	!(year % 4) && !(!(year % 100) && year % 400),
		dayInYear,


	/** Iterator variables */
		char, v,
		escaped	=	false,
		index	=	0;


	for(;;){
	
		char	=	format[index];
		++index;


		/** End of string. */
		if(undefined === char){
			if(escaped) output	+=	"\\";
			break;
		}
		
		if(escaped){
			output	+=	char;
			escaped	=	false;
		}

		else switch(char){

			default:{
				output	+=	char;
				break;
			}

			/** Backslash. Be sure to ignore any recognised characters on the next iteration. */
			case "\\":{
				escaped	=	!escaped;
				break;
			}

			/** Day of the month, 2 digits with leading zeros: 01 to 31 */
			case "d":{
				output	+=	(date < 10 ? "0" : "") + date;
				break;
			}


			/** A textual representation of a day, three letters: Mon through Sun */
			case "D":{
				output	+=	(days[day] || "").substr(0, 3);
				break;
			}


			/** Day of the month without leading zeros: 1 to 31 */
			case "j":{
				output	+=	date;
				break;
			}


			/** A full textual representation of the day of the week: Sunday through Saturday */
			case "l":{
				output	+=	days[day] || "";
				break;
			}


			/** ISO-8601 numeric representation of the day of the week: 1 (for Monday) through 7 (for Sunday) */
			case "N":{
				output	+=	day || 7;
				break;
			}


			/** English ordinal suffix for the day of the month, 2 characters: st, nd, rd or th. Works well with j */
			case "S":{
				output	+=	[,"st", "nd", "rd"][(date > 10 && date < 20) ? 0 : (date % 10)] || "th";
				break;
			}

			/** Numeric representation of the day of the week: 0 (for Sunday) through 6 (for Saturday) */
			case "w":{
				output	+=	day;
				break;
			}

			/** The day of the year (starting from 0): 0 through 365 */
			case "z":{
				dayInYear	=	dayInYear || Math.floor((time - new Date(year, 0)) / 86400000);
				output		+=	dayInYear;
				break;
			}


			/** ISO-8601 week number of year, weeks starting on Monday: e.g., 42 (the 42nd week in the year) */
			case "W":{
				v		=	new Date(year, month, date - (day || 7) + 3);
				output	+=	Math.round((v - new Date(v.getFullYear(), 0, 4)) / 86400000 / 7) + 1;
				break;
			}


			/** A full textual representation of a month, such as January or March */
			case "F":{
				output	+=	months[month] || "";
				break;
			}

			/** Numeric representation of a month, with leading zeros: 01 through 12 */
			case "m":{
				output	+=	(month < 9 ? "0" : "") + (month + 1);
				break;
			}

			/** A short textual representation of a month, three letters: Jan through Dec */
			case "M":{
				output	+=	(months[month] || "").substr(0, 3);
				break;
			}

			/** Numeric representation of a month, without leading zeros: 1 through 12 */
			case "n":{
				output	+=	month+1;
				break;
			}

			/** Number of days in the given month: 28 through 31 */
			case "t":{
				output	+=	[31, leap? 29:28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
				break;
			}
			
			/** Whether it's a leap year: 1 if it is a leap year, 0 otherwise. */
			case "L":{
				output	+=	leap? "1" : "0";
				break;
			}

			/**
			 * TODO: ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W)
			 * belongs to the previous or next year, that year is used instead. Examples: 1999 or 2003
			 */
			case "o":{
				return "Y";
				break;
			}

			/** A full numeric representation of a year, 4 digits 	Examples: 1999 or 2003 */
			case "Y":{
				output	+=	year;
				break;
			}
			
			/** A two digit representation of a year: Examples: 99 or 03 */
			case "y":{
				output	+=	(year + "").substr(-2);
				break;
			}

			/** Lowercase Ante meridiem and Post meridiem: am or pm */
			case "a":{
				//	JavaScript will never return a hour greater than 23, so we needn't concern ourselves with checking "hour === 24" to determine AM.
				output	+=	hour < 12 ? "am" : "pm";
				break;
			}
			
			/** Uppercase Ante meridiem and Post meridiem: AM or PM */
			case "A":{
				output	+=	hour < 12 ? "AM" : "PM";
				break;
			}


			/**
			 * Swatch Internet time: 000 through 999
			 * @url http://www.swatch.com/templates/assets/js/rwd/main.js
			 */
			case "B":{
				output	+=	("000" + Math.floor((hour * 3600 + (minute + 60 + tz) * 60 + second) / 86.4) % 1000).slice(-3);
				break;
			}


			/** 12-hour format of an hour without leading zeros: 1 through 12 */
			case "g":{
				output	+=	(hour - (hour >= 12 ? 12 : 0)) || 12;
				break;
			}
			
			/** 24-hour format of an hour without leading zeros: 0 through 23 */
			case "G":{
				output	+=	hour;
				break;
			}


			/** 12-hour format of an hour with leading zeros: 01 through 12 */
			case "h":{
				output	+=	("0" + ((hour - (hour >= 12 ? 12 : 0)) || 12)).substr(-2);
				break;
			}

			/** 24-hour format of an hour with leading zeros: 00 through 23 */
			case "H":{
				output	+=	(hour < 10 ? "0" : "") + hour;
				break;
			}

			/** Minutes with leading zeros: 00 to 59 */
			case "i":{
				output	+=	(minute < 10 ? "0" : "") + minute;
				break;
			}

			/** Seconds, with leading zeros: 00 through 59 */
			case "s":{
				output	+=	(second < 10 ? "0" : "") + second;
				break;
			}
			
			/** Microseconds. Since JavaScript Date objects don't store time data at any level finer than milliseconds, we'll default to 000000. */
			case "u":{
				output	+=	"000000";
				break;
			}


			/**
			 * Timezone identifier: 	UTC, GMT, Atlantic/Azores, etc
			 *
			 * We can't accurately replicate PHP's behaviour here, as it bases timezones based on region/location, something not accessible JavaScript
			 * (at least without having to bring in something heavy-duty like HTML5's Geolocation API). We'll settle for something a bit more minimalist instead.
			 */
			case "e":
			case "T":{
				output	+=
					
					/** Check the stringified form of the date object to pull a timezone abbreviation from the trailing component e.g., "(EST)". */
					(this.toTimeString().match(/\(([^)]+)\)\s*$/) || [])[1] ||

					/* If we can't match the timezone's abbreviation from the Date's string function, fall back on showing the offset in hours instead. */
					("UTC" + tzStr);
				break;
			}


			/** TODO: Whether or not the date is in daylight saving time 	1 if Daylight Saving Time, 0 otherwise. */
			case "I":{
				return "0";
				break;
			}
			
			/** Difference to Greenwich time (GMT) in hours: e.g., +0200 */
			case "O":{
				output	+=	tzStr;
				break;
			}

			/** Difference to Greenwich time (GMT) with colon between hours and minutes. 	Example: +02:00 */
			case "P":{
				output	+=	tzStrC;
				break;
			}


			/** Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT) */
			case "U":{
				output	+=	time;
				break;
			}

			/** Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive. 	-43200 through 50400 */
			case "Z":{
				output	+=	(tz <= 0 ? Math.abs(tz) : -tz) * 60;
				break;
			}
			
			/** ISO 8601 date:	2004-02-12T15:19:21+00:00 */
			case "c":{
				output	+=	year + "-"
						+	(month	< 11 ? "0" : "")	+	(month+1)
				+	"-"	+	(date	< 10 ? "0" : "")	+	date
				+	"T"	+	(hour	< 10 ? "0" : "")	+	hour
				+	":"	+	(minute	< 10 ? "0" : "")	+	minute
				+	":"	+	(second	< 10 ? "0" : "")	+	second
						+	tzStrC;
				break;
			}


			/** RFC 2822 formatted date 	Example: Thu, 21 Dec 2000 16:01:07 +0200 */
			case "r":{
				output		+=	days[day].substr(0, 3)
					+ ", "	+	(date	< 10 ? "0" : "") + date
					+ " "	+	months[month].substr(0, 3)
					+ " "	+	year
					+ " "	+	(hour	< 10 ? "0" : "")	+	hour
					+ ":"	+	(minute < 10 ? "0" : "")	+	minute
					+ ":"	+	(second < 10 ? "0" : "")	+	second
					+ " "	+	tzStr;
				break;
			}
		}
	}

	return output;
};