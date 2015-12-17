#!/usr/local/bin/node --es_staging
"use strict";

let length   = +(process.argv[2] || 26);
let crypto   = require("crypto");
let palettes = [
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	"0123456789",
	`!"#$%&'()*+,-./:;<=>?@[]^_{|}~`
];

let size    = Math.max(128, length) * 2;
let random  = [
	crypto.randomBytes(size * size),
	crypto.randomBytes(size * size)
];

let output  = "";
let index   = 0;
while(output.length < length){
	let pointer = random[0][(index += 1) % random[0].length];
	let palette = palettes[pointer % palettes.length];
	output     += palette[ random[1][pointer] % palette.length ];
}

console.log(output);
