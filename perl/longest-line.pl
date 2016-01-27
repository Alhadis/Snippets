#!/usr/bin/env perl
# Prints the line number, content, and length of the longest line in a file.
use warnings;
use strict;


# Read our arguments.
my $filename = shift(@ARGV);


# Open the file whose path was passed in from command prompt.
my $file     = undef;
open($file, "< :encoding(UTF-8)", $filename)
	or die "ERROR: Couldn't open file \"$filename\" for reading.";


# Cycle through each of the file's lines and ascertain which is the longest.
my $line_length             = 0;
my $line_number             = 0;
my $longest_line_length     = 0;
my $longest_line_number     = 0;
my $longest_line_text       = "";

while(<$file>){
	chomp($_);
	$line_length = length($_);

	if($line_length > $longest_line_length){
		$longest_line_length = $line_length;
		$longest_line_number = $line_number;
		$longest_line_text   = $_;
	}
	++$line_number;
}

printf "	Text:    %s\n", $longest_line_text;
printf "	Row:     %d\n", $longest_line_number;
printf "	Length:  %d\n", $longest_line_length;
