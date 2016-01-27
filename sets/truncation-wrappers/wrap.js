function truncate(string){
	if(arguments.length < 2 || !string) return [string || ""];

	/** Default arguments. */
	var args = {
		limit:   25,
		by:      "char",
		cutoff:  "break",
		trim:    true
	};


	/** If passed a number as our second argument, simply set the limit parameter. */
	if("number" === typeof arguments[1])
		args.limit = arguments[1];


	/** Otherwise, simply merge our supplied arguments into our defaults. */
	else for(var i in arguments[1])
		args[i]   = arguments[1][i];
	

	/** Lowercase our string-typed arguments for easier comparison. */
	args.by       = args.by.toLowerCase();
	args.cutoff   = "string" === typeof args.cutoff ? args.cutoff.toLowerCase() : +(args.cutoff);



	/** Trim leading/trailing whitespace from our string */
	if(args.trim)
		string    = string.replace(/(^\s+|\s+$)/g, "");



	/** Truncating based on word count. */
	if("word" === args.by){
		var words = string.split(/\s+/);

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
		var before     = string.substring(0, args.limit),
			after      = string.substring(args.limit),
			lastStart  = before.match(/(\s*)(\S+)$/),
			lastEnd    = after.match(/^\S+/);



		/** Always include the last word in the untruncated half of the string. */
		if("after" === args.cutoff) return [
			string.substring(0, before.length + lastEnd[0].length),
			string.substring(   before.length + lastEnd[0].length)
		];


		/** Never include the final word in the untruncated result. */
		else if("before" === args.cutoff) return [
			string.substring(0, before.length - lastStart[0].length),
			string.substring(   before.length - lastStart[0].length)
		];


		/** Otherwise, use an arbitrary threshold point to determine where the threshold should lie. */
		else{
			var lastWord = lastStart[2] + lastEnd;

			/** If supplied a floating point number, interpret it as a percentage of the affected word's length. */
			if(args.cutoff > 0 && args.cutoff < 1)
				args.cutoff = Math.round(lastWord.length * args.cutoff);


			/** Word's cutoff length is still less than the desired truncation limit. Include the word in the first half. */
			if(args.limit > (before.length - lastStart[2].length)+args.cutoff) return [
				string.substring(0, before.length - lastStart[0].length),
				string.substring(   before.length - lastStart[0].length)
			];

			/** Otherwise, do the opposite of what the above comment just said. */
			return [
				string.substring(0, before.length + lastEnd[0].length),
				string.substring(   before.length + lastEnd[0].length)
			];
		}
	}

	return [string];
}



function applyTruncations(string, layers){
	var breaks  = {},
		indices = [];

	for(var s, l, i = 0; i < layers.length; ++i){
		s = truncate(string, layers[i]);

		if(s.length > 1){
			l = s[0].length;

			if(undefined === breaks[l]){
				breaks[l] = layers[i].className;
				indices.push(l);
			}

			else breaks[l] += " " + layers[i].className;
		}
	}

	/** As tempting as it is to use a for/in loop to iterate over the enumerated breakpoints, we need to ensure each property 
	is iterated over in ascending order. Though unlikely, it's possible some agents may index the properties differently. */
	indices.sort();


	var prevWrap, outer, inner;
	for(i = indices.length - 1; i >= 0; --i){
		s = indices[i];

		inner             = document.createElement("span");
		inner.textContent = string.substring(s, prevWrap ? indices[i+1] : undefined);
		if(prevWrap) inner.appendChild(prevWrap);
		
		outer             = document.createElement("span");
		outer.className   = breaks[s];
		outer.appendChild(inner);

		prevWrap = outer;
	}
	

	var frag = document.createDocumentFragment();
	
	/** If prevWrap is still undefined, it means the original string wasn't long enough to warrant truncation. Insert it as a text node. */
	if(!prevWrap)
		frag.appendChild(document.createTextNode(string));

	else{
		frag.appendChild(document.createTextNode(string.substring(0, indices[0])));
		frag.appendChild(prevWrap);
	}
	return frag;
};


var lipsum = document.getElementById("lipsum").content.textContent;

var layers = [
	{className: "desktop-clip", by: "char", limit: 320, cutoff: "break"},
	{className: "mobile-clip",  by: "word", limit:  40, cutoff: "before"},
	{className: "mobile-clip",  by: "word", limit: 100, cutoff: "before"}
];
var result = applyTruncations(lipsum, layers);

document.getElementById("result").appendChild(result);
