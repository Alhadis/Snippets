/**
 * TODO: Write real documentation.
 * TODO: Refactor function to extend String.prototype.
 */

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