#!/bin/sh

IFS=
text="ABCDEFGHIJKLMNOPQRSTUVWXYZ - 1234567890 - abcdefghijklmnopqrstuvwxyz";
reset=$(tput sgr0);
max=$(tput colors);
count=$max;


# Bail if coloured output's not supported
[ "$max" -lt 1 ] && {
	>&2 echo "ERROR: Terminal doesn't support coloured output. Aborting.";
	exit 1;
};


# Print a solid-colour bar to STDOUT
bar () {
	length=${1:-80}
	char=$(echo "\xe2\x96\x88")
	echo $(printf "%${length}s" '' | tr ' ' $char)
}

# Prints a usage message and exits
usage () {
	name=$(basename "$0");
	echo "usage: $name [-alb] [c <count>] [t <text>]";
}




# Show only the first 16 colours by default
count=15

# Parse any options we were given
while getopts alc:t:b option; do
	case $option in
	a)	count=$max				;;	# Show all colours
	l)	count=$max				;;	# Synoynm for -a: displays a long rainbow
	c)	count=$((OPTARG - 1))	;;	# Display an arbitrary number of colours
	t)	text=$OPTARG			;;	# Use a custom string to display each row
	b)	text=$(bar 73)			;;	# Use a solid-coloured bar instead of text
	?)	>&2 usage; exit 1;		;;	# Unknown option: print usage message and exit
	esac
done;


# Cap the colour-count to the terminal's maximum number of possible colours
[ $count -gt $max ] && { count=$max; }


for((i = 0; i <= $count; i++)); do
	colour=$(tput setaf $i);
	space=" ";
	[ $i -lt 10 ] && { space="  "; }
	[ $i -gt 99 ] && { space=""; }
	echo "${reset}${space}$i   ${colour}${text}";
done;

echo $reset;
