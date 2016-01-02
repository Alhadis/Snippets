#!/usr/bin/perl
#
# Strips irrelevent metadata from tracklists copied from Discogs, and corrects
# the site's crap/incorrect capitalisation.
#

use utf8;
use strict;
use warnings;
use open qw/:std :utf8/;

use Lingua::EN::Titlecase;
use Data::Dumper;


# Slurp mode
$/=undef;


my $tc = Lingua::EN::Titlecase->new();
while(<>){
	s/^\s*|\s*$//g;    # Strip leading and trailing whitespace
	s/^[^\t]+$//gm;    # Delete any line without a tab character; it'll be junk
	s/\t+\x{20}*(Show lyrics|Instrumental)\t*$//gmi; # Might as well accommodate MA too
	s/\t+[:\d]*$//gm;  # Drop track durations from the end of each line
	s/\n{2,}/\n/g;     # Collapse consecutive newlines into a single line-break
	
	# Drop track numbers, if any
	s/^\w+\.?\t//gm;
	
	# Check for band names prepended to titles
	s/^\x{2013}([^\t]+)\t([^\n]+)(?:\n|$)((?:\x{2013}\1\t[^\n]+(?:\n|$))*)/
		my $result    = $1."\n\t".$2."\n";
		my $remainder = "";
		
		if(defined $3){
			$remainder  = $3;
			$remainder =~ s!^\x{2013}$1\t+!\t!gm;
		}
		
		$result . $remainder;
	/gmex;
	
	# Title-case
	my @lines   = map { $tc->title($_); } split /\n+/, $_;
	my $results = join "\n", @lines;
	
	# Inject double-lines between artists for split tracklists
	$results =~ s/((?:^|\n)\t+[^\n]+(?:\n(?=\w)|$))/$1\n/g;
	
	# Make sure the last word of each title is always uppercased
	$results =~ s/([\w']+$)/\u$1/gm;
	
	print $results;
}

print "\n";
