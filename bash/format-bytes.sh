#!/bin/bash
# Formats a number of bytes for human-readable output.


# Option defaults
length=2
filename=
use_long=0
pluralise=auto


# Begin parsing our options
while getopts d:f:lp: option; do
	case $option in
	d)	length=$OPTARG		;;	# Specifies maximum decimal length (digits after the decimal point)
	f)	filename=$OPTARG	;;	# Read bytes from a file's size instead.
	l)	use_long=1			;;	# Use long unit names ("Kilobytes" instead of "KBs", etc)
	p)	pluralise=$OPTARG	;;	# Forces pluralisation on/off, irrespective of actual value
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
	}

	x; u++;
" | bc -s))


# Extract the calculated decimal, rounded off to X number of places (with any trailing zeroes stripped: e.g., "1.00" or "2.20").
value=$(printf "%.${length}f" ${output[0]} | sed -E 's/0+$//' | sed -E 's/\.$//')


# Check whether the value equates to 1 or not.
singular=($(echo "scale=$length; y=0; if(x=$value == 1){y=1}; y;" | bc -s))


plural='s'

# Disable pluralised byte name if suppressed, or if value's singular and $pluralise is set to "auto"
if ( [ $pluralise == 0 ] || ([ $pluralise == auto ] && [ $singular == 1 ] )); then
	plural='';
fi




# Attach the appropriate byte unit.
short_units=("B" "KB" "MB" "GB" "TB" "PB" "EB" "ZB" "YB");
long_units=("Byte" "Kilobyte" "Megabyte" "Gigabyte" "Terabyte" "Petabyte" "Exabyte" "Zettabyte" "Yottabyte")
unit_index=${output[1]}
unit_name=${short_units[$unit_index]}


# Check if we've been asked to print the byte unit's full name, instead of an abbreviation.
if [ $use_long != 0 ]; then
	unit_name=${long_units[$unit_index]};
fi




printf "%.${length}f ${unit_name}${plural}\n" $value