#!/usr/bin/perl
use warnings;
use strict;

# Clean an SVG file
sub clean_svg{
	local $/=undef;      # Slurp mode
	local $^I = "";      # Enable in-place editing
	
	my $filename = $_[0];
	open(my $input, "+<", $filename) or die "ERROR: Can't open " . $filename;
	while(<>){
		
		# Unix-style newlines only, please. Thanks Adobe.
		s/\r\n/\n/g;
		
		# Start nuking shit
		s/(<style type="text\/css">\n\t\.st0\{[^\}]+\}\n<\/style>\n| class="st0")//g;
		s/<\?xml.+?\?>\n//g;                     # XML declaration not needed
		s/<!DOCTYPE[^>]+>//gi;                   # Neither are DOCTYPES, fuckin' hell mate
		s/<!--.+?-->\n//g;                       # Nobody gives a shit how it was generated
		s/ id="[^"]+"//gi;                       # ID not needed, either
		s/ enable-background="[^"]+"//gi;        # The 'fuck is this shit?
		s/enable-background:new( \d+){4};?//gi;
		s/ style=""//gi;                         # Drop empty style attributes if no other properties were specified
		s/ xml:space="preserve"//gi;             # This isn't needed, either
		s/ xmlns:xlink="[^"]+"//gi;              # ... or this
		
		# Clean up the whitespace a little bit
		s/\n\t+/ /g;
		s/\x20{2,}/ /g;
		s/ "\/>/"\/>/g;
		s/^\n|\n+$//g;
		s/$/\n/g;
		print;
	}
}


foreach(@ARGV){
	clean_svg $_;
}
