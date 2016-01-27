#!/usr/bin/env perl

# Sets the access and modification times of a file using a Unix timestamp.
#
# This could probably have been written using a simple shell-script; however,
# I've kinda cracked the shits with Bash's handling of timestamps and
# formatting.

use warnings;
use strict;
use feature "say";


# Queried filename
my $filename = shift(@ARGV);


# If a timestamp was provided, use it to set $filename's modification/access times.
if(my $timestamp = shift(@ARGV)){
	utime $timestamp, $timestamp, $filename;
}

# Otherwise, just return the file's current modification time.
else{
	my @stats = stat($filename);
	say $stats[9];
}
