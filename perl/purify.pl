#!/usr/bin/perl
use warnings;
use strict;
use utf8;
use feature "say";
use feature "unicode_strings";
use open (":std", "utf8");


# Draws a pretty green border
sub border {
	system("tput setaf 10");
	say "\n" . "=" x `tput cols`;
	system("tput sgr0");
}


# Draws a pretty, Homebrew-style coloured arrow with a punchy label
sub marker {

	# We'll add more elaborate feedback later.
	return;


	my($label, $colour) = @_;

	$colour   = $colour || 10;
	$label    = $label  || "";

	system("tput bold; tput setaf $colour");
	print "===> ";
	system("tput sgr0; tput bold");
	printf "%s\n", $label;
	system("tput sgr0");
}


# Enable slurp mode
$/=undef;

my $line;
while(<>){
	$line = $_;


	# First, expand encoded HTML entities
	marker('Expanding HTML entities');
	$line =~    s/&#(\d+);/chr($1);/ge;
	$line =~    s/&#x(\d+);/chr(hex($1))/ge;


	# Replacements: "End of Text" markers (U+0003) with newlines. Inserted by Adobe Illustrator in type-areas.
	marker('Replacing end-of-text markers with newlines');
	$line =~    s/\x{03}/\n/g;


	# Delete control characters and unused/deprecated codepoints
	marker('Deleting control characters and unused/deprecated codepoints');
	$line =~    s/[\x{00}-\x{08}\x{0B}\x{0C}\x{0E}-\x{1D}\x{1F}\x{7F}\x{80}-\x{84}\x{86}-\x{9A}\x{9C}-\x{9F}\x{AD}\x{180E}\x{200B}-\x{200D}\x{FEFF}\x{FFFE}\x{FFFF}\x{1FFFE}\x{1FFFF}\x{E0000}-\x{E007F}]//g;


	# Replacements: Non-printing characters
	marker('Fixing whitespace');
	$line =~    s/[\x{A0}\x{1E}\x{2000}-\x{200A}\x{202F}\x{205F}]/\x{20}/g;  # Spaces
	$line =~    s/[\x{85}\x{9B}\x{2028}\x{2029}]/\x{0A}/g;                   # Line feeds


	# Replacements: Characters inserted by word-processors
	marker('Fixing punctuation');
	$line =~    s/[\x{201C}\x{201D}]/\x{22}/g;                  # "
	$line =~    s/[\x{60}\x{B4}\x{2018}\x{2019}]/\x{27}/g;      # '
	$line =~    s/[\x{2010}-\x{2015}]/\x{2D}/g;                 # -
	$line =~    s/\x{2026}/.../g;                               # ...


	# Replacements: Unicode substitutes for reserved filename characters in Windows
	marker('Replacing substitutes for illegal filename characters');
	$line =~    s/\x{A789}/\x{3A}/g;                            # :
	$line =~    s/\x{2047}/\x{3F}/g;                            # ?
	$line =~    s/\x{2048}/\x{3F}\x{21}/g;                      # ?!
	$line =~    s/\x{2049}/\x{21}\x{3F}/g;                      # !?
	$line =~    s/\x{2024}/\x{2E}/g;                            # .
	$line =~    s/\x{2025}/\x{2E}/g;                            # ..
	$line =~    s/ \x{2215} /\x{2F}/g;                          # /
	$line =~    s/\x{2002}\x{2215}\x{2002}/ \x{2F} /g;          # / (Surrounding spaces)


	# Finally, normalise some oddities
	$line =~    s/''/"/g;
	$line =~    s/\x{20}{2,}/ /g;
	print STDOUT $line;
}
