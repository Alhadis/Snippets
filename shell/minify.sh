#!/bin/sh

# Switch to the script's current directory
cd `dirname $0`;


# Create the "min" directory if it doesn't already exist
[ ! -d min ] && { mkdir min; }


# Stylesheets
cat css/fonts.css css/global.css css/main.css | cleancss --skip-advanced -o min/min.css


# JavaScript
uglifyjs js/main.js --mangle -o min/min.js
