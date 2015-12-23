#!/usr/bin/perl
use warnings;
use strict;
use utf8;
use open         qw< :std :utf8 >;
use charnames    qw< :full >;
use feature      qw< unicode_strings >;
use Getopt::Long qw<:config auto_abbrev>;

# Parse options
my $decimal=0;
my $newlines=0;
my $separator="";
GetOptions(
	"decimal"     => \$decimal,
	"newlines"    => \$newlines,
	"separator=s" => \$separator
);

# Set "newlines-mode" if -n was set
if($newlines){
	$separator = "\n";
}


# Compile a list of characters using each codepoint
my @chars = ();
my $codepoint;
foreach(@ARGV){
	$codepoint = $_;
	
	# Treat arguments as hexadecimal strings unless indicated otherwise
	if(!$decimal){
		$codepoint =~ s/^(U\+)?//ig;
		$codepoint = hex($codepoint);
	}
	
	push @chars, chr($codepoint);
}


# Send the compiled result to STDOUT
print STDOUT join $separator, @chars;
print STDOUT "\n";
