#!/usr/bin/perl
use warnings;
use strict;
use utf8;


# I have an unhealthy obsession with regular expressions...

# These are all real examples I found in my spam folder, and I thought it'd be fun to write a pattern to match 'em all.
my @spam = (
	"Heyo, I am all alone bunny girl, looking for funny man friend to have a dating with ) \n Where are you from, do you speak english? \n \n reply me if you want to see photos with me. Bye )))",
	"Good day, I am a single funny puss, looking for real man friend to hang out :=) \n Where are you from, do you speak english? \n \n reply me if you need my photos. Bye-bye",
	"Best regards, I am a single charming puss, in search of real man to have a fun with ) \n Where are you from, do you speak english? \n \n reply me if you need photos of me. Bye-bye ;D",
	"How are you, I'm alone bunny puss, looking handsome friend to hang out :D \n Where are you from, do you speak english? \n \n please reply me if you want to see my photos. See you around :=)",
	"Good evening, I'm a lonely nice lass, in search of real man to have a date with ;D \n Where are you from, do you speak english? \n \n reply me if you need my photos. Have a nice time ;-)"
);


for my $shit (@spam){
	printf "NOT BLOCKED:\n%s\n\n", $shit
	unless $shit =~ m/
		
		# Greeting
		(
			H[ei]y[ao]    |
			Good\s*(\w+)  |
			How  \s* (are \s* | '? \s* re) you\?? |
			Best \s* regards
		) \s*
		
		
		# Girl or talking animal
		,?                           \s*
		I('m|\s*am)(\s*a\s*)?        \s*
		(all)?                       \s*
		(alone|single|lonely)        \s*
		([fb]unny|nice|charming)     \s*
		(girl|pussy?|lass)           \s*
		,?                           \s*
		
		
		# Motive
		(
			looking(\s*for)? |
			(in \s*)?
			search(ing)?
			(\s* of)?
		)                            \s*
		(real|funny|handsome)        \s*
		(man|boy)?                   \s*
		(friend)?                    \s*
		to                           \s* 
		(have)?                      \s*
		(a)?                         \s*
		(dating|hang\s*out|fun|date) \s*
		(with)?                      \s*
		
		
		# Emoticon
		(
			\)+
			|
			[;:][-= ]*[D)]+
		)? \s*
		
		# Question
		Where              \s*
		are                \s*
		you                \s*
		from               \s*
		,?                 \s*
		do                 \s*
		you                \s*
		speak              \s*
		english\?          \s*    # Yes, and fluent Perl
		
		(please)?          \s*
		reply              \s*
		(to)?              \s*
		me                 \s*
		if                 \s*
		you                \s*
		(want|need)        \s*
		(to)?              \s*
		(see)?             \s*
		(my)?              \s*
		(photos|pictures)  \s*
		(
			(of|with)?     \s*
			me             \s*
		)?                 \s*
		\.?                \s*
		
		(
			See \s*
			you \s*
			around
			|
			Have( \s* a)? \s*
			\w{2,}        \s+
			(\w+)?
			|
			Bye \s*
			(\s*-?bye)?
		)
	/xi;
} 
