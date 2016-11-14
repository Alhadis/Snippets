"use strict";
module.exports = {statify, unstatify};

const fs = require("fs");


/**
 * Generate an instance of fs.Stats from an object.
 *
 * Instances of fs.Stats are returned unmodified.
 *
 * @param {Object} input
 * @return {Stats}
 */
function statify(input){
	if(!input) return null;
	
	if(input instanceof fs.Stats)
		return input;
	
	const output = Object.create(fs.Stats.prototype);
	for(const key in input){
		const value = input[key];
		
		switch(key){
			case "atime":
			case "ctime":
			case "mtime":
			case "birthtime":
				output[key] = !(value instanceof Date)
					? new Date(value)
					: value;
				break;
			default:
				output[key] = value;
		}
	}
	
	return output;
}



/**
 * Produce a simplified form of an fs.Stats object for serialisation.
 *
 * Date-type properties are replaced with Unix timestamps, and methods
 * (such as isSymbolicLink) are ignored. The input is unmodified.
 * 
 * @param {Stats|Object} input - An instance or approximation of fs.Stats
 * @return {Object}
 */
function unstatify(input){
	if(!input) return null;
	
	const output = {};
	for(const key in input){
		const value = input[key];
		
		switch(key){
			case "atime":
			case "ctime":
			case "mtime":
			case "birthtime":
				output[key] = value instanceof Date
					? value.getTime()
					: value;
				break;
			default:
				if("function" !== typeof value)
					output[key] = value;
		}
	}
	
	return output;
}
