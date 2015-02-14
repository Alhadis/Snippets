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