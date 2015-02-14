(function(){
"use strict";


var RecordJar	=	function(input){

	/** Allow RecordJars to be constructed instantiated "statically" (without the "new" operator). */
	if(undefined === this || this.constructor !== RecordJar)
		return new RecordJar(input);

	this.records	=	[];

	/** Mirror the record array's length property in the RecordJar instance. */
	Object.defineProperty(this, "length", {
		get:	function(){ return this.records.length; },
		set:	function(i){ this.records.length = i; }
	});

	this.parse(input);
};


/** Default properties/methods. */
RecordJar.prototype	=	{
	constructor:	RecordJar,


	/** Used when typecasting the jar back to a string value. */
	maxLineLength:	78,


	/** Whether to align the left edge of a folded text block with the column the first character started at. */
	prettyFold:	true,


	/**
	 * Breaks a stream of text apart into records and pushes the results onto the RecordJar's .records array.
	 * @param {String} input - String content to parse.
	 */
	parse:	function(input){
		var	records	=	(input || "").split(/(?:^|\n)%%[^\n]*(?:\n|$)/g),
			record,

			i	=	0,
			l	=	records.length;

		/** Don't bother doing anything with blank values. */
		if(1 === l && !records[0]) return;


		/** Start cycling through each record block. */
		for(; i < l; ++i){

			record	=	(function(record){
				
				/** Check if folding's present in this record block before splitting it apart line-by-line. */
				if(-1 !== record.indexOf("\\\n"))

					/** We'll use a callback to handle line-folding in case we've an escaped backslash as the line's last character. */
					record	=	record.replace(/(\\+)\n\s*/g, function(match, slashes){
						var l	=	slashes.length;
						return (l % 2) ? slashes.substr(0, l-1) : match;
					});



				var	output	=	{},
					fields	=	record.split(/\n+/g),
					i		=	0,
					l		=	fields.length,

					/** Iterator junk */
					field, name, value;


				for(; i < l; ++i){

					/** Split our "name: value" pair apart by the first colon. */
					if(field = fields[i].match(/^([^:]+):\s*(.*)$/m)){
						name	=	field[1],
						value	=	field[2];

						/** If a field with this name was already assigned to the record, turn it into an array of values. */
						if(name in output){
							if("string" === typeof output[name])
								output[name]	=	[output[name]];
							output[name].push(value);
						}

						/** Assign the value to our budding record object. */
						else output[name]	=	value;
					}

					/** Uh, seems we weren't given a properly-formatted string... */
					else if(l === 1) return;
				}

				return output;
			}(records[i]));

			/** Make sure we're not admitting blank records to our array. */
			if(record) this.records.push(record);
		}
	},




	/**
	 * Adds one or more objects to the RecordJar's .records array.
	 * Strings are treated as raw record-jar streams and parsed accordingly.
	 */
	push:	function(){
		var args	=	arguments,
			i		=	0,
			l		=	args.length;
		for(; i < l; ++i) "string" === typeof args[i] ? this.parse(args[i]) : this.records.push(args[i]);
		return this.records.length;
	},



	/**
	 * Recompiles the text-based representation of the RecordJar.
	 * @return {String}
	 */
	toString:	function(){
		var output		= "",
			i			= 0, r, j, f, field,
			l			= this.records.length,
			maxLength	= this.maxLineLength;

		for(; r = "", i < l; ++i){
			for(j in this.records[i]){
				field	=	this.records[i][j];

				/** If it isn't an array, wrap it in one to facilitate adding multiple values. */
				if("[object Array]" !== Object.prototype.toString.call(field))
					field	=	[field];

				for(f = 0; f < field.length; ++f)
					r += (function(name, value){
						var joiner	=	": ",
							line	=	name + joiner + value;

						/** Check if our concatenated line would spill past the limit set by our instance's maxLineLength property. */
						if(line.length > maxLength)
							line	=	name + joiner + (function(line, before){
								var output	=	line.wordWrap(maxLength - before.length);

								for(var i = 1, l = output.length; i < l; ++i)
									output[i]	=	before + output[i];

								return output.join("\\\n");

							}(value, Array(+(this.prettyFold ? name.length+3 : 1)).join(" ")));

						return line + "\n";
					}).call(this, j, field[f]);
			}
			if(r) output	+= (output ? "%%\n" : "")+r;
		}
		return output;
	}
};



/** Export */
window.RecordJar	=	RecordJar;

}());