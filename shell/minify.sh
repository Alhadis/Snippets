#!/bin/sh

# Stylesheets
cat css/fonts.css css/global.css css/main.css | cleancss --skip-advanced -o min/main.css


# JavaScript
uglifyjs js/main.js --mangle -o min/main.js
