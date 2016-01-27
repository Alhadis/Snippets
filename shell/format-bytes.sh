#!/bin/bash
# Formats a number of bytes for human-readable output.


# Display help if called with -h or --help
if [[ `echo "$*" | grep -E '(\s|^)(--help|-h)(\s|$)'` != '' ]]; then
	file=$(basename "$0");
	man "$file" || {
		tput setaf 9;
		>&2 printf 'ERROR: Could not locate manual page for "%s".\n' $(basename $file);
		tput sgr0;
		exit 1;
	};
exit; fi

# End of help/documentation




# Option defaults
length=2
filename=
use_long=0
pluralise_short=0
keep_zeroes=0


# Begin parsing our options
while getopts d:f:lpk option; do
	case $option in
	d)  length=$OPTARG      ;; # Specifies maximum decimal length (digits after the decimal point)
	f)  filename=$OPTARG    ;; # Read bytes from a file's size instead of an arbitrary amount.
	l)  use_long=1          ;; # Use long unit names ("Kilobytes" instead of "KBs", etc)
	p)  pluralise_short=1   ;; # Pluralises short units when necessary; useful only if -l is off
	k)  keep_zeroes=1       ;; # Preserves useless zeroes to produce output like "1.00 KB"
	esac
done
shift $((OPTIND - 1))


# Number of bytes to format into a human-readable value
input=$1

# If a file was specified, use its size as the number of bytes to format.
if [ ! -z $filename ]; then
	input=$(stat -f "%z" $filename)
fi



# Use Unix's basic calculator for handling the calculations.
output=($(echo "scale=20
	define r(v, p){
		auto o
		o = scale
		scale = p
		v /= 1;
		scale = o;
		return (v);
	}

	x = $input;
	u = 0;

	while(1){
		if(x < 1024) break;
		x = x / 1024;
		u = u + 1;
		if(u == 8) break;
	}

	x; u++;
" | bc -s))


# Extract the calculated decimal, rounded off to X number of places (with any trailing zeroes stripped: e.g., "1.00" or "2.20").
value=$(printf "%.${length}f" ${output[0]} | sed -E 's/0+$//' | sed -E 's/\.$//')


# Attach the appropriate byte unit.
short_units=("B" "KB" "MB" "GB" "TB" "PB" "EB" "ZB" "YB");
long_units=("Byte" "Kilobyte" "Megabyte" "Gigabyte" "Terabyte" "Petabyte" "Exabyte" "Zettabyte" "Yottabyte")
unit_index=${output[1]}
unit_name=${short_units[$unit_index]}


# Check whether the value equates to 1 or not.
singular=($(echo "scale=$length; y=0; if(x=$value == 1){y=1}; y;" | bc -s))


plural='s'

# Check if we need to pluralise the formatted unit's name.
if ([ $singular == 1 ] || ([ $use_long != 1 ] && ([ $pluralise_short != 1 ] || [ $unit_index == 0 ]))); then
	plural='';
fi


# Check if we've been asked to print the byte unit's full name, instead of an abbreviation.
if [ $use_long != 0 ]; then
	unit_name=${long_units[$unit_index]};
fi



value=$(printf "%.${length}f" $value)

if [ $keep_zeroes == 0 ]; then
	value=$(printf %s $value | sed -E 's/0+$//' | sed -E 's/\.$//')
fi

printf "$value ${unit_name}${plural}\n" $value
