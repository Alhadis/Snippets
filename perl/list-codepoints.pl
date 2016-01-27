#!/usr/bin/env perl
use strict;
use warnings;

use utf8;
use open        qw< :std :utf8 >;
use charnames   qw< :full >;
use feature     qw< unicode_strings >;


my $filename = 'Unique Characters.txt';
my $file     = undef;

open($file, "< :encoding(UTF-8)", $filename)
	or die("ERROR: Can't locate " . $filename);

my ($codepoint, $line);
while(<$file>){
	$line       = $_;
	$codepoint  = ord($line);
	printf '%s	U+%1$X	%s', $codepoint, $line
}
