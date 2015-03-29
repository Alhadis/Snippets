#!/usr/bin/env perl
# Helper script for extracting a MySQLWorkbench-friendly CSV file from a
# semicolon-delimited CSV from the Unicode CLDR. Mainly written for Perl
# practice.

use warnings;
use strict;


# Parses a single line of semicolon-delimited UnicodeData.csv
sub parse_line {
	
	# Optional flag to return the parsed/modified data in the same format as it was supplied.
	my $preserve_semicolons	=	$_[1];

	# Check if we should display feedback as we're parsing lines (debugging use only).
	my $quiet	=	!$_[2];


	# Break the row apart.
	my ($codepoint,
		$name,
		$general_category,
		$canonical_combining_class,
		$bidi_class,
		$decomposition,
		$numeric_value_decimal,
		$numeric_value_digit,
		$numeric_value_numeric,
		$bidi_mirrored,
		$unicode_1_name,
		$iso_comment,
		$simple_uppercase_mapping,
		$simple_lowercase_mapping,
		$simple_titlecase_mapping
	) = split(';', $_[0]);


	# Use decimals to represent what'll be the primary key in the MySQL table (which obviously won't take kindly to hexadecimal values).
	$codepoint	=	hex($codepoint);


	# Slice open the decomposition field and ensure the contents are properly formatted.
	if($decomposition){
		
		# Yeah, we're all cool here. Convert the hexadecimal codepoints to decimal form for easier lookup later.
		if($decomposition =~ m/(<[^>]+>)?((?:^|\s+)[A-F\d]{4,})+/){
			print "BEFORE: $decomposition\n" unless $quiet;
			$decomposition	=~	s/\b([A-F0-9]{4})\b/hex($1)/ge;
			print "AFTER: $decomposition\n" unless $quiet;
		}

		# Okay, raise an exception 
		else{
			warn "EXCEPTION, HOREH SHET: #$codepoint" unless $quiet;
		}
	}


	# Chomp any trailing newlines from the last column's value.
	chomp($simple_titlecase_mapping);

	# Handle the capitalisation mapping (which're also stored in UnicodeData in hexadecimal form).
	$simple_uppercase_mapping	=	hex($simple_uppercase_mapping) || '';
	$simple_lowercase_mapping	=	hex($simple_lowercase_mapping) || '';
	$simple_titlecase_mapping	=	hex($simple_titlecase_mapping) || '';

	# Recompile the row.
	my $result_format	=	$preserve_semicolons ? ("%s;" x 14 . "%s\n") : ('"%s",' x 14 . "\"%s\"\n");

	return sprintf($result_format,
		$codepoint,
		$name,
		$general_category,
		$canonical_combining_class,
		$bidi_class,
		$decomposition,
		$numeric_value_decimal,
		$numeric_value_digit,
		$numeric_value_numeric,
		$bidi_mirrored,
		$unicode_1_name,
		$iso_comment,
		$simple_uppercase_mapping,
		$simple_lowercase_mapping,
		$simple_titlecase_mapping
	);
};



# Open the damn file.
my $filename	=	shift(@ARGV) || 'UnicodeData.csv';
open(my $input, "< :encoding(UTF-8)", $filename)
	or die "ERROR: Couldn't locate or open requested filename.";


# Open a filehandle for dropping the modified contents into.
$filename	=~	s/(\.\w+)$/_2$1/;
open(my $output, "> $filename")
	or die "Couldn't find somewhere to take a dump.";



# Start rippin' lines like a junkie.
while(<$input>){

	# Replace the leading hexadecimal value of each row in a file with the decimal equivalent
	printf $output parse_line($_);
}
