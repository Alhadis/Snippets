#!/usr/bin/perl
use warnings;
use strict;
use utf8;

# Slurp mode
$/=undef;

# Status constants
my %statuses = (
	'Active'       => 1,
	'On hold'      => 2,
	'Split-up'     => 3,
	'Unknown'      => 4,
	'Changed name' => 5,
	'Disputed'     => 6
);


print STDOUT "ID	Name	Genre	Location	Status";
while(<>){
	s/^.*?"aaData":\s+\[//ms;
	s/\}\s+$//;
	s/\[(\n\t{3})"<a href='[^']+\/(\d+)'>(.*?)<\/a>"/[$1$2,$1"$3"/gi;
	
	while(my ($key, $value) = each %statuses){
		s/"<span class=\\"\w+\\">$key<\/span>"/$value/gi;
	}
	
	s/((?:^|\n)\t+[\]\[],?)+//g;
	s/,\n\t+/\t/g;
	s/(?<=\n)\t+//g;
	print $_;
}
