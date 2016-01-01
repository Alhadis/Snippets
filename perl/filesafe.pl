#!/usr/bin/perl -w
use utf8;
use strict;
use open qw< :std :utf8>;

# Replace unsafe filename characters with similar-looking Unicode approximates
for my $i (@ARGV){
	$i =~ s/\.{3}/…/g;
	$i =~ s/\?!/⁈/g;
	$i =~ s/\?{2}/⁇/g;
	$i =~ s/\.$/․/g; # Directories can't end in full-stops
	$i =~ s{ / }{\x{2002}∕\x{2002}}g;
	$i =~ s{/}{ ∕ }g;
	$i =~ tr/:""''<>/꞉“”‘’﹤﹥/;
	print $i;
}
