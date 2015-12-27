#!/usr/local/bin/node --es_staging
"use strict";

const BOLD			= "\x1B[1m";
const RESET			= "\x1B[0m";
const UNDERLINE		= "\x1B[4m";
const BASE_URL		= "http://www.metal-archives.com/search/ajax-advanced/searching/bands/";

const ERROR_ARGS		= 1;
const ERROR_NO_RESULTS	= 2;
const ERROR_JSON_BAD	= 3;
const ERROR_JSON_WEIRD	= 4;


/** Load core NodeJS modules */
let process			= require("process");
let queryString		= require("querystring");
let HTTP			= require("http");
let argv			= process.argv;

let country			= argv[2] || "";
let bandName		= argv.slice(3).join(" ") || "";


/** Invalid arguments passed */
if(country.length !== 2 || !country || !bandName){
	let scriptName	= argv[1].split("/").reverse()[0];

	console.info(`
${BOLD}USAGE${RESET}
	${scriptName} ${UNDERLINE}country${RESET} ${UNDERLINE}band-name${RESET}

${BOLD}PARAMETERS${RESET}
	country      2-letter country code
	band-name    Self-explanatory
`)
	process.exit(ERROR_ARGS);
}



function showError(string, details){
	return `${BOLD}${string.toUpperCase()}:
${"=".repeat(string.length+1)}${RESET}

${details}

`;
}

function parseResults(dataString){
	
	try{ var data = JSON.parse(dataString); }
	catch(e){
		console.error(`Couldn't parse JSON data: badly-formed.

${showError("Exception thrown", e)}
${showError("Response from server", dataString)}
`);
		return process.exit(ERROR_JSON_BAD);
	}

	
		
	if(!data.aaData){
		console.error(`Couldn't parse JSON data; property "aaData" not found.

${BOLD}RESPONSE FROM SERVER:${RESET}
${"‾".repeat("21")}

${dataString}

`);
		return process.exit(ERROR_JSON_WEIRD);
	}
	
	if(!data.aaData.length){
		console.error("No results found.");
		return process.exit(ERROR_NO_RESULTS);
	}
	
	data 		= data.aaData;
	let bands	= [];
	for(let i of data){
		let match = i[0].match(/^\s*<a href="[^"]+\/(\d+)"[^>]*>(.*?)<\/a>/i);

		if(!match){
			console.warn("Could not parse entry; skipping:\n" + JSON.stringify(i));
			continue;
		}

		bands.push({
			id:			match[1],
			name:		match[2],
			genre:		i[1],
			location:	i[2]
		})
	}
	
	bands.sort((a, b) => {
		if(a.id < b.id)	return -1;
		if(a.id > b.id) return 1;
		return 0;
	});
	
	let output = "<b>Not to be confused with:</b>";
	for(let i = 0; i < bands.length; ++i){
		let id			= bands[i].id;
		let genre		= bands[i].genre.trim();
		let location	= bands[i].location.trim();
		output += "\n• {"+id+"}" + ` (${genre} from ${location})`;
	}

	console.log(output);
}



let args			= queryString.stringify({
	bandName:			bandName,
	exactBandMatch:		1,
	genre:				"",
	country:			country.toUpperCase(),
	yearCreationFrom:	"",
	yearCreationTo:		"",
	status:				"",
	themes:				"",
	location:			"",
	bandLabelName:		"",
	sEcho:				1,
	iColumns:			3,
	sColumns:			"",
	iDisplayStart:		0,
	iDisplayLength:		200,
	mDataProp_0:		0,
	mDataProp_1:		1,
	mDataProp_2:		2,
	_:					Date.now()
});


var req		= HTTP.get(BASE_URL + "?" + args, result => {
	result.setEncoding("utf8");
	result.on("data", data => parseResults(data));
});
