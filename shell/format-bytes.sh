#!/bin/bash
# Formats a number of bytes for human-readable output.


# Display help if called with -h or --help
if [[ `echo "$*" | grep -E '(\s|^)(--help|-h)(\s|$)'` != '' ]]; then

B=$(tput bold)	# Bold type
b=$(tput sgr0)	# Normal formatting
U=$(tput smul)	# Underline - Start
u=$(tput rmul)	# Underline - Stop


echo "${B}
NAME
     format-bytes${b} -- Formats a number of bytes for human-readable output.

${B}SYNOPSIS
     format-bytes ${b}[${B}-lpk${b}] [${B}-d${b} ${U}decimal-length${u}] [${B}-f${b} ${U}file${u}] [${U}bytes${u}]

${B}DESCRIPTION${b}
     The ${B}format-bytes${b} utility takes a number of bytes either from a file, command line, or
     standard input, and formats them using the most reader-friendly unit of measurement.
     For instance, the following line yields a result of \"4.4 MB\" (or \"4.4 MBs\" if the -p
     option is set):

          $ format-bytes 4358361

     If ${U}bytes${u} is omitted, the program reads from standard input instead:

          $ echo '4358361' | format-bytes


     The following options are available:

     ${B}-d${b}  ${U}num${u}      Specifies maximum decimal length (${U}num${u} digits after the decimal point).

     ${B}-f${b}  ${U}file${u}     Read bytes from a file's size instead of an arbitrary amount.

     ${B}-l${b}           Use long unit names (\"Kilobytes\" instead of \"KB\", etc).

     ${B}-p${b}           Pluralises short units when necessary; useful only if ${B}-l${b} is off. Note that
                  byte units will never be pluralised, so the program won't generate an
                  uncomfortable-looking result like \"480 Bs\".

     ${B}-k${b}           By default, ${B}format-bytes${b} strips any redundant zeroes after the decimal point
                  as a result of meeting the required decimal length (set by the ${B}-l${b} option).
                  Setting ${B}-k${b} overrides this behaviour so formatted values like \"20 KB\" will
                  be printed as \"20.00 KB\". Note this also affects \"partial\" decimal values
                  like \"20.30 KB\" (which would ordinarily be formatted as \"20.3 KB\" with this
                  option off).

${B}EXAMPLES${b}
     Basic usage:
           $ format-bytes 1600           # 1.56 KB

     Use longer measurement units:
           $ format-bytes -l 1600        # 1.56 Kilobytes

     Add pluralisation for short units (no effect if ${B}-l${b} is set):
           $ format-bytes -p 1600        # 1.56 KBs

     Read from a file's size instead:
           $ format-bytes -f README.md
";
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
	d)	length=$OPTARG		;;	# Specifies maximum decimal length (digits after the decimal point)
	f)	filename=$OPTARG	;;	# Read bytes from a file's size instead of an arbitrary amount.
	l)	use_long=1			;;	# Use long unit names ("Kilobytes" instead of "KBs", etc)
	p)	pluralise_short=1	;;	# Pluralises short units when necessary; useful only if -l is off
	k)	keep_zeroes=1		;;	# Preserves useless zeroes to produce output like "1.00 KB"
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
