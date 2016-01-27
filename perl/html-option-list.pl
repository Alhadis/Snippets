#!/usr/bin/env perl


=head1 NAME

B<html-option-list> - Generate a list of HTML <option> elements


=head1 SYNOPSIS

B<html-option-list> [B<-w> I<length>] [B<-b> I<string>] [B<-a> I<string>] [B<-n>] [B<-v>] [B<-i> I<tabs>] [B<--width> I<length>] [B<--before> I<string>] [B<--after> I<string>] [B<--newline>] [B<--new-line>] [B<--indent> I<tabs>] [B<--verbatim>]


=head1 DESCRIPTION

Generate a list of HTML <option> elements from a sequence of arguments, typically numeric.

Yes, that's really all.


=head1 OPTIONS

=over 6

=item B<-w> I<length>, B<--width> I<length>

Pad the displayed value with leading zeroes to ensure it satisfies a minimum length.


=item B<-b> I<string>, B<--before> I<string>

Prepend each <option> element with I<string>.


=item B<-a> I<string>, B<--after> I<string>

Append I<string> to each <option> element.


=item B<-n>, B<--newline>, B<--new-line>

Append a line-break character (I<U+000A>) after each <option>, as though B<--after>=$'\n' were entered in the arguments. Overrides B<--after>.


=item B<-i> I<num>, B<--indent> I<num>

Indent each <option> with I<num> tabs. Overrides B<--before>.


=item B<-v>, B<--verbatim>

Pad numeric values with zeroes, but don't use the unpadded value as a I<value> attribute in the <option> element.

=back


=head1 EXAMPLES

Generate a list of numbers representing the days of the month, with leading zeroes affixed where necessary:

	html-option-list -w 2 {1..31}

Do the same as above, but "pretty-print" it so it's not crapped on one frikkin' long line:

	html-option-list -w 2 --newline --indent=1 {1..31}

=cut



use warnings;
use strict;
use feature "say";
use Getopt::Long qw(:config auto_abbrev);


# Initialise output string
my $output  = "";


# Process command-line options
my $width   = 0;
my $before  = "";
my $after   = "";
my $newline = 0;
my ($indent, $verbatim);
GetOptions("width=i" => \$width, "before=s" => \$before, "after=s" => \$after, "newline" => \$newline, "new-line" => \$newline, "indent=i" => \$indent, "verbatim" => \$verbatim);


# If --newline was enabled, set $after to... well, a new-line.
if($newline){ $after = "\n"; }


# Similarly, if $indent is specified, use its value as the number of tabs to set $before to.
if(defined($indent)){
	$before = "\t" x $indent;
}


# Define formatting string
my $format = $before . ($width > 1 ?
	'<option' . ($verbatim ? '' : ' value="%1$s"') . '>%1$0'.$width.'s</option>' :
	'<option>%1$s</option>'
) . $after;



# Start formatting arguments.
while(@ARGV){
	$_ = shift;
	printf $format, $_;
}
