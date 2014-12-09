(function(){

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


Function.noop	=	function(){};




var WordLimit	=	function(args){
	var	THIS		=	this, el,
		args		=	args || {};
	
	for(var i in args) THIS[i]	=	args[i];


	/** Bail if we weren't passed an input/textarea to operate on. */
	if(!(el = THIS.el)) throw new ReferenceError("Cannot instantiate a new WordLimit instance without a subject input element.");

	var on	=	function(el, events, fn){
		var	oldIE	=	"attachEvent" in el,
			method	=	oldIE ? el.attachEvent : el.addEventListener,
			prefix	=	oldIE ? "on" : "",
			events	=	events.split(/\s+/g),
			i		=	0,
			l		=	events.length;

		for(; i < l; ++i)
			method.call(el, prefix + events[i], fn, false);
		return el;
	};

	var	lastValue, overflow	=	false;

	on(THIS.el, "keyup focus blur change paste keydown", new function(e){
		if(el.value !== lastValue){
			lastValue	=	el.value;

			var words	=	THIS.splitWords(el.value);


			/** Number of words equals or exceeds our word limit. */
			if(words.length >= THIS.limit){

				if(!overflow){
					overflow	=	true;
					THIS.overflow();
				}

				/** Ensure text gets clipped to our set limit. */
				if(THIS.clip){
					el.value	=	THIS.truncate(el.value, THIS.limit);
					words		=	words.slice(0, THIS.limit);
				}
			}

			/** Word count's fallen back within the acceptable threshold again. */
			else if(overflow && words.length < THIS.limit){
				overflow	=	false;
				THIS.underflow();
			}

			/** Cancel the event's default behaviour too. */
			if(words.length > THIS.limit && e) e.preventDefault();

			/** Update the current word count for the user. */
			if(THIS.counter) THIS.updateCounter(el.value, words);
		}
		return this.constructor;
	});
	

	/** Check if we need to stop containing <form> elements from submitting if the input's content is too long. */
	if(THIS.blockInvalid){
		var form	=	(function(el){
			var parent	=	el;
			while((parent = parent.parentNode))
				if("FORM" === parent.tagName) return parent;
			return el;
		}(THIS.el));

		on(form, "submit", function(e){
			if(!THIS.isValid()){
				e.preventDefault();
				THIS.invalidated(e);
				return false;
			}
		});
	}
};


(function(a, b){for(var i in b) a[i] = b[i];}(

	WordLimit.prototype, {
		limit:			25,
		clip:			true,
		el:				null,
		counter:		null,

		overflow:		Function.noop,
		underflow:		Function.noop,
		invalidated:	Function.noop,


		/**
		 * RegEx used to break strings apart into separate words.
		 * Hint: To treat hyphenated words as one entity, use /[^\w-_'\u2019]+|['\u2019]{2,}/g
		 */
		rSplitBy:		/[^\w_'\u2019]+|['\u2019]{2,}/g,


		/** Breaks a string into an array of words. */
		splitWords:		function(value){
			var words	=	value.replace(this.rSplitBy, " ").replace(/^\s+|\s+$/g, "").split(/\s+/g);

			/** String.split will always return an array with at least one element, even an empty string. Don't be fooled. */
			if(words[0] === "") words	=	[];

			return words;
		},


		/**
		 * Set to FALSE if your form's already using special value checking/validation.
		 * @type {Boolean}
		 */
		blockInvalid:	true,

		/**
		 * Whether to keep the current word counts within the acceptable/expected range when formatting the word counter (prevents stuff like "-5 words remaining")
		 * @type {Boolean}
		 */
		capLimits:		true,


		/**
		 * Format string that fills the .textContent of the WordLimit's counter element.
		 *	%1: Words remaining
		 *	%2: Total words typed in
		 */
		counterFormat:	"%1",


		/** Updates the text displayed in the WordLimit's counter element. */
		updateCounter:	function(string, words){
			var remaining	=	this.limit - words.length,
				total		=	words.length;

			if(this.capLimits)
				remaining	=	Math.max(0, Math.min(remaining, this.limit));

			this.counter[("textContent" in this.el ? "textContent" : "innerText")]	=	this.counterFormat.replace(/%1/g, remaining).replace(/%2/g, total);
		},


		/** Helper method that checks if the content of the WordLimit's target input falls within an acceptable range. Use with external validation routines. */
		isValid:		function(){
			return this.splitWords(this.el.value).length <= this.limit;
		},


		/** Cuts a string off to a designated number of words. */
		truncate: function(input, limit){
			var	rTrim	=	/^[\s\xA0]+|[\s\xA0]+$/g,
				rWord	=	/[A-Za-z0-9]/,
				words	=	(input || "").replace(rTrim, "").isplit(this.rSplitBy),
				output	=	"",
				total	=
				i		=	0,
				l		=	words.length;

			for(; i < l; ++i){
				output	+=	words[i];
				if(total >= limit)			return output;
				if(rWord.test(words[i]))	++total;
			}
			return output.replace(rTrim, "");
		}
	}
));


/** Export */
window.WordLimit	=	WordLimit;

}());