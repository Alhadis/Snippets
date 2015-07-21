#!/usr/bin/perl
use warnings;
use strict;
use feature "say";

use Data::Dumper;
use Math::Random::Secure "irand";
use Getopt::Long qw(:config auto_abbrev);


# Returns a random character from a string
sub randchar {
	my $string	=	$_[0];
	my $length	=	length $string;
	my $index;

	do{		$index = irand(256);	}
	while(	$index >= $length		);

	my $output	= substr $string, $index, 1;
	return $output;
}


# Scatters randomly-picked values from one array throughout another.
sub sprinkle {
	my ($string, $grains, $bias) = @_;
	my $length		=	(length $string) * ($bias || .5);
	my $num_grains	=	length $grains;

	for(my $i = 0; $i < $length; ++$i){
		substr($string, irand($length) - 1, 1) = randchar $grains;
	}
	return $string;
}



# Generates a powerful password
sub generate_password {

	# Assign arguments
	my ($length, $use_symbols, $use_similar) = @_;

	# Enforce a minimum length
	my $min_length = $use_symbols ? 4 : 3;
	if($length < $min_length){
		my $red		=	`tput setaf 9`;
		my $reset	=	`tput sgr0`;
		print STDERR "${red}ERROR: Password cannot be shorter than $min_length characters.${reset}\n";
		exit;
	}

	# Character strings
	my $letters		=	"ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	my $numbers		=	"0123456789";
	my $symbols		=	" !\"#\$%&'()*+,-./:;<=>?@[\]^_{|}~";

	# Strip similar-looking characters if --use-similar was disabled
	if(!$use_similar){
		$letters	=~	s{[ILO]}{}g;
		$numbers	=~	s{01}{};
	}
	
	my $num_letters = length($letters);
	my $num_numbers = length($numbers);
	my $num_symbols = length($symbols);


	# Start with a string of alphabetic characters only.
	my $password = "";
	my $char;
	for(my $i = 0; $i < $length; ++$i){
		$char		=	substr $letters, irand($num_letters), 1;
		$char		=	lc($char) unless irand(256) % 2;
		$password	.=	$char;
	}
	
	# Pepper it with numerals
	$password	=	sprinkle $password, $numbers;
	$password	=	sprinkle $password, $symbols unless !$use_symbols;

	return $password;
}


# Returns TRUE if a password string contains uppercase and lowercase letters, numbers and symbols (if used).
sub validate {
	our $use_symbols;
	my $s = $_[0];
	return $s =~ /[A-Z]/ && $s =~ /[a-z]/ && $s =~ /[0-9]/ && (!$use_symbols || $s =~ /[^A-Za-z0-9]/);
}



# Parse our command-line options
my $length		=	16;
my $use_symbols	=	1;
my $use_similar	=	1;
my $copy		=	0;
GetOptions("length=i" => \$length, "use-symbols=i" => \$use_symbols, "use-similar=i" => \$use_similar, "copy" => \$copy);


# Generate a password, dropping any that aren't strong enough.
my $password;
do{ $password = generate_password $length, $use_symbols, $use_similar; }
while(!validate $password);


# If --copy was passed, copy our password to the system clipboard (Mac OS/X only).
if($copy){
	my $bold	=	`tput bold`;
	my $green	=	`tput setaf 10`;
	my $reset	=	`tput sgr0`;
	$password	=~	s{"}{\\"}g;
	`printf %s "$password" | pbcopy;` unless !$copy;
	say "${bold}COPIED TO CLIPBOARD:${reset}  ${green}$password${reset}";
}

# Send to STDOUT
else{ say $password; }
