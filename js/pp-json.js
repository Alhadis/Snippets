#!/usr/local/bin/node --es_staging
"use strict";

let mutilate  = true;
let colourise = true;
let indent    = "\t";

let str       = "";
process.stdin.setEncoding("utf8");
process.stdin.on("readable", () => {
	let chunk = process.stdin.read();
	if(chunk !== null)
		str += chunk;
});

process.stdin.on("end", () => {
	let output = JSON.stringify(JSON.parse(str), null, indent);
	
	/** Unquote property identifiers in object literals */
	if(mutilate){
		let pattern = new RegExp(indent + '"([\\w\\$]+)":', "g");
		output      = output.replace(pattern, indent + "$1:");
	}
	
	if(colourise){
		const GREEN = "\x1B[38;5;2m";
		const RESET = "\x1B[0m";
		const GREY  = "\x1B[38;5;8m";
		
		/** Strings */
		output = output.replace(/("([^\\"]|\\.)*")/g, GREEN+"$1"+RESET);
		
		/** Numerals */
		output = output.replace(/(\d+,)$/gm, GREEN+"$1"+RESET);
		
		/** URLs */
		const UNDERLINE_ON  = "\x1B[4m";
		const UNDERLINE_OFF = "\x1B[24m";
		output = output.replace(/(\s*(https?:)?\/\/([^:]+:[^@]+@)?([\w-]+)(\.[\w-]+)*(:\d+)?(\/\S+)?\s*(?="))/gm, UNDERLINE_ON+"$1"+UNDERLINE_OFF)
		
		/** Greyed-out unimportant bits */
		output = output
			.replace(new RegExp("^((?:"+indent+")*)([\\[\\{\\}\\]],?)", "gm"), "$1"+GREY+"$2"+RESET)
			.replace(/((?:\[\]|\{\})?,)$/gm, GREY+"$1"+RESET)
			.replace(/(\[|\{)$/gm, GREY+"$1"+RESET);
		
	}
	
	process.stdout.write(output + "\n");
});
