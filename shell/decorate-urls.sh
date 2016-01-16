#!/bin/sh

# Pattern-matching
protocols='(((https?|ssh|git|ftps?|rsync|file|svn):\/\/)|mailto:|data:)'
validchar='[^] \t\r\n\f)\x27">]+'

# Formatting
before='\x1B[4;32m'
after='\x1B[0m'

sed -r -e "s/${protocols}${validchar}/${before}&${after}/g" $1;
