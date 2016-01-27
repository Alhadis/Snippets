#!/usr/bin/perl

# This was such an unbelievable bitch to get my head around.
#
# Enough that my understanding of it warrants preservation
# in the exact form as when I first encountered it.

use warnings;
use strict;
use feature "say";
use Data::Dumper;

sub emblazon {
	my ($items) = @_;
	${$items}{Sword} .= ' and enhanced.';
}

my %items = (
	Sword   => 'Sharp',
	Shield  => 'Strong',
	Armour  => 'Sturdy'
);

emblazon \%items;
print Dumper \%items;
