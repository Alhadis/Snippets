#!/usr/bin/env perl

# Convert soft-tabs into proper tabs
my $columns = shift() || 2;
while(<>){
	s|^( {$columns})+|"\t" x (length($&)/$columns)|ge;
	print $_;
}
