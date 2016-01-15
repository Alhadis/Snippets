#!/usr/bin/perl -w
use utf8;
use strict;
use open qw< :std :utf8>;


# Replace unsafe filename characters with similar-looking Unicode approximates
sub filesafe{
	my $i = $_[0];
	$i =~ s/\.{3}/…/g;
	$i =~ s/\?!/⁈/g;
	$i =~ s/\?{2}/⁇/g;
	$i =~ s/\.$/․/g; # Directories can't end in full-stops
	$i =~ s{ / }{\x{2002}∕\x{2002}}g;
	$i =~ s{/}{ ∕ }g;
	$i =~ s/"([^"]*)"/“$1”/g;
	$i =~ tr/:"<>/꞉”﹤﹥/;
	return $i;
}



# Process command-line arguments if we have any
if($#ARGV >= 0){
	my @cleaned = ();
	for my $i (@ARGV){
		push @cleaned, filesafe $i;
	}
	print join $", @cleaned;
}


# Otherwise, read from standard input
else{
	while(<STDIN>){ print filesafe $_; }
	exit;
}
