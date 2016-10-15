#!/usr/bin/env node


/**
 * Synthesise case-insensitivity for a regexp string.
 *
 * JavaScript doesn't support scoped modifiers like (?i),
 * so this method seeks to approximate the next best thing.
 *
 * @param {String} input
 * @param {Boolean} noFuzz
 * @return {String}
 */
function caseKludge(input, noFuzz){
	
	let output = input.split("").map((s, index, array) => {
		
		if(/[A-Z]/.test(s)){
			const output = "[" + s + s.toLowerCase() + "]";
			const prev = array[index - 1];
			
			// Camel-case
			if(!noFuzz && prev && /[a-z]/.test(prev))
				return "[\\W_\\S]*" + output;
			
			return output;
		}
		
		if(/[a-z]/.test(s))
			return "[" + s.toUpperCase() + s + "]";
		
		if(noFuzz)
			return s.replace(/([/\\^$*+?{}\[\]().|])/g, "\\$1");
		
		if("0" === s)
			return "[0Oo]";
		
		if(/[\W_ \t]?/.test(s))
			return "[\\W_ \\t]?";
		
		return s;
	
	}).join("");
	
	if(!noFuzz)
		output = output.replace(/\[Oo\]/g, "[0Oo]");
	
	return output.replace(/(\[\w{2,3}\])(\1+)/g, (match, first, rest) => {
		return first + "{" + ((rest.length / first.length) + 1) + "}"
	});
}


// More beastly variant:

/**
 * Mutilate a case-insensitive regex so it can be embedded inside one that isn't.
 *
 * @param {String|RegExp} input
 * @return {String}
 */
function caseKludge(input){
	let output = "";
	
	/** Only work off string data */
	if("[object RegExp]" === ({}).toString.call(input))
		input = input.source;
	
	let index = 0;
	let inClass = false;
	let classed;
	
	for(;;){
		const cp = input.codePointAt(index);
		
		/** End of string */
		if(undefined === cp) break;
		
		++index;
		
		switch(cp){
			
			/** Backslash */
			case 0x22:
				
				/** Escaped character */
				if(index < input.length){
					output += "\\" + input[index];
					++index;
					continue;
				}
				break;
			
			/** Opening bracket */
			case 0x5B:
				inClass = true;
				classed = [];
				output += "[";
				break;
			
			/** Closing bracket */
			case 0x5D:
				const inverted = invertRange(classed);
				classed = classed.join("");
				output += (classed !== inverted ? classed + inverted : classed) + "]";
				inClass = false;
				break;
			
			/** Anything else... */
			default:
				const char = input[index - 1];
				
				/** Only do this confusing garbage outside a character class */
				if(!inClass){
					if     (cp > 0x40 && cp < 0x5B) output += "[" + char + char.toLowerCase() + "]";
					else if(cp > 0x60 && cp < 0x7B) output += "[" + char + char.toUpperCase() + "]";
					else output += char;
				}
				
				else classed.push(char);
				break;
		}
	}
	
	return output;
}



function invertRange(chars){
	let swapped = [];
	
	/** Do a preliminary pass to accommodate character ranges */
	for(let i = 0, l = chars.length; i < l; ++i){
		const c = chars[i];
		
		/** Add a character range */
		if("-" === c && i > 0 && i+1 !== l)
			swapped.push([ swapped.pop(), chars[i++ + 1] ]);
		
		else swapped.push(c);
	}
	
	/** Now flatten and transform the resolved pieces */
	swapped = swapped.map(s => {
		
		if("string" === typeof s){
			const cp = s.codePointAt(0);
			if(cp > 0x40 && cp < 0x5B) return s.toLowerCase();
			if(cp > 0x60 && cp < 0x7B) return s.toUpperCase();
			return s;
		}
		
		/** Handle a character class */
		let output = "";
		let beforeRange = "";
		let afterRange  = "";
		
		/** First, check if the range touches [A-z] */
		let [a, b] = s;
		let x = a.codePointAt(0);
		let y = b.codePointAt(0);
		
		/** Nothing to worry about here */
		if(x < 0x41 && x > 0x7A && y < 0x41 && y > 0x7A) return s.join("");
		
		/** Range begins before "A" */
		if(x < 0x41){
			const separator = 0x3F === x ? "" : "-";
			beforeRange = x !== 64 ? a + separator + "@" : "@";
			
			/** Escape dash if that's what's used to start the range */
			if(0x2D === x) beforeRange = "\\" + beforeRange;
			
			x = 0x40;
			a = "A";
		}
		
		/** Range terminates after "z" */
		if(y > 0x7A){
			const separator = 0x7C === y ? "" : "-";
			afterRange = b !== "{" ? "{" + separator + (b === "-" ? "\\"+b : b) : "{";
			y = 0x7A;
			b = "z";
		}
		
		/** Shortcuts for likely ranges */
		if(x === 0x41 && y === 0x7A) return beforeRange + "A-z" + afterRange;
		if(x === 0x41 && y === 0x5A) return beforeRange + "a-z" + afterRange;
		if(x === 0x61 && y === 0x7A) return beforeRange + "A-Z" + afterRange;
		
		/** Calculate contingent characters manually */
		let chars = [];
		for(let i = x; i <= y; ++i)
			chars.push(String.fromCharCode(i < 0x5B ? i + 32 : (i > 0x60 ? i - 32 : i)));
		
		return beforeRange + chars.sort().join("")
			.replace(/([A-Z])[A-Z]+([A-Z])/g, "$1-$2")
			.replace(/([a-z])[a-z]+([a-z])/g, "$1-$2")
			+ afterRange
	});
	
	
	return swapped.join("").replace(/([\[\\\]])/g, "\\$1")
}


let test = process.argv[2] || "abcdef[A-K]abcdef";
console.log("BEFORE: " + test);
console.log("AFTER:  " + caseKludge(test));
