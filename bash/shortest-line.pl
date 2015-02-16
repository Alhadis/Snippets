#!/usr/bin/env perl
# Prints the line number, content, and length of the shortest line in a file.
use warnings;
use strict;


# Read our arguments.
my $filename	=	shift(@ARGV);


# Open the file whose path was passed in from command prompt.
my $file		=	undef;
open($file, "< :encoding(UTF-8)", $filename)
	or die "ERROR: Couldn't open file \"$filename\" for reading.";


# Cycle through each of the file's lines and ascertain which is the longest.
my $line_length				=	0;
my $line_number				=	0;
my $shortest_line_length	=	undef;
my $shortest_line_number	=	0;
my $shortest_line_text		=	"";
my $line_text;

while(<$file>){
	$_				=~	s{\n+$}{};
	$line_length	=	length($_);

	# If we've not yet set a base length to measure against, set it now.
	if(!defined($shortest_line_length)){
		$shortest_line_length	=	$line_length;
	}

	if($line_length < $shortest_line_length && $line_length > 0){
		$shortest_line_length	=	$line_length;
		$shortest_line_number	=	$line_number;
		$shortest_line_text		=	$_;
	}
	++$line_number;
}

printf "	Text:    %s\n", $shortest_line_text;
printf "	Row:     %d\n", $shortest_line_number;
printf "	Length:  %d\n", $shortest_line_length;
