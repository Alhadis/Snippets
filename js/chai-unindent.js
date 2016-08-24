"use strict";

const Chai = global.chai || require("chai");
const {util} = Chai;


let overwritten;
let unindentPattern;


/** Unindent a value if it's a string, and Chai.unindent has been called */
function trimIfNeeded(input){
	if(unindentPattern && "[object String]" === Object.prototype.toString.call(input)){
		unindent.noTrim || (input = input.replace(/^(?:[\x20\t]*\n)*|(?:\n[\x20\t]*)*$/gi, ""));
		return input.replace(unindentPattern, "");
	}
	return input;
}


/**
 * Strip leading tabulation from string blocks when running "equal" method.
 *
 * Enables use of ES6 template strings like triple-quoted strings (Python/CoffeeScript).
 *
 * @param {Number} columns - Number of leading tabs to strip from each line
 * @param {String} char - What defines a "tab". Defaults to a hard tab.
 */
function unindent(columns, char = "\t"){
	
	/** If Chai.unindent hasn't been run yet, overwrite the necessary methods */
	if(!overwritten){
		overwritten = true;
		
		for(const method of ["equal", "string"]){
			Chai.Assertion.overwriteMethod(method, function(__super){
				return function(input, ...rest){
					__super.apply(this, [ trimIfNeeded(input), ...rest ]);
				}
			});
		}
	}
	
	unindentPattern = columns
		? new RegExp("^(?:"+char+"){0,"+columns+"}", "gm")
		: null;
};

Chai.unindent = unindent;
