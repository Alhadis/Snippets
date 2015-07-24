#!/bin/sh

IFS=
alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ - 1234567890 - abcdefghijklmnopqrstuvwxyz";
reset=$(tput sgr0);
max=256


# Show only the first 16 colours by default
count=15

# Parse any options we were given
while getopts alc: option; do
	case $option in
	a)	count=$max				;;	# Show all colours
	l)	count=$max				;;	# Synoynm for -a: displays a long rainbow
	c)	count=$((OPTARG - 1))	;;	# Displays an arbitrary number of colours
	esac
done;


[ $count -le 0 ] && { count=0; }

for((i = 0; i <= $count; i++)); do
	colour=$(tput setaf $i);
	space=" ";
	[ $i -lt 10 ] && { space="  "; }
	[ $i -gt 99 ] && { space=""; }
	echo "${reset}${space}$i   ${colour}${alphabet}";
done;

echo $reset;
