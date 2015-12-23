#!/usr/bin/perl
use warnings;
use strict;
use open qw/:std :utf8/;


# Slurp mode
$/=undef;

while(<>){
	s/'/"/g;
	s/\x20{4}/\t/g;
	s/\.([-\w]+):before\s*\{\s+content:\s*("\\\w+");\s*\}/\.$1::before\t\t\t\{\tcontent: $2;\t\}/gmi;
	s/"\\([0-9A-Fa-f]{2})"/'"'.chr(hex($1)).'"'/gmei;
	s/ (?=\{\n)|^\.icon-rot::before\s*\{[^\}]+\}//gm;
	s/\.icon-/.i./g;
	s/(?<=[\t:])(?=url)/ /g;
	s/\.eot\?([^'"]+)#iefix/\.eot#iefix/g;
	s/\?${1}//g;
	s/\[class\^="icon-"\][^{]+\{[^\}]+\}\n{2}//gmi;
	s/src:\t /src: /g;
	print STDOUT;
}
