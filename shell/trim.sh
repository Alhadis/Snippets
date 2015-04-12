#!/bin/sh

# Display help if called with -h or --help
if [[ `echo "$*" | grep -E '(\s|^)(--help|-h)(\s|$)'` != '' ]]; then

B=$(tput bold)	# Bold type
b=$(tput sgr0)	# Normal formatting
U=$(tput smul)	# Underline - Start
u=$(tput rmul)	# Underline - Stop


echo "${B}
NAME
     trim${b} -- Trim leading and trailing whitespace

${B}SYNOPSIS
     trim ${b}[-${B}lrc${b}] [-${B}t${b}] \"${U}string-1${u}\" [\"${U}string-2${u}\" ...]

${B}DESCRIPTION${b}
     The ${B}trim${b} utility simply strips leading and trailing whitespace from each line of a supplied string.
     If passed no arguments, the utility reads from standard input instead.

     The trimmed text is echoed to standard output by default. If either ${B}-c${b} or ${B}-wf${b} was passed, the modified
     content is instead written back to the clipboard or source file, respectively.

${B}OPTIONS${b}
     ${B}Processing control${b}
       -l              Trim only the left-hand side of each line
       -r              Trim only the right-hand side
       -t ${U}TRIM_CHARS${u}   Regex for trimming each side of a text row. Defaults to '[\t\x20]+' (tabs, spaces)

     ${B}Input/Output${b}
       -f ${U}FILE${u}         Use the specified file's content as input
       -w              If -f was set, write the modified data back to the source file, suppressing standard output
       -c              Operate directly on the contents of the system's clipboard, ignoring all further arguments

     ${B}Other${b}
       -h, --help      Display this help page and exit
";
exit; fi


# Subroutine that handles the final line-trimming once input's been resolved.
do_trim(){
	output=''
	stopchar=$'\n'Z;
	no_nl=

	while read -r L || {
		nl=$'\n'

		# Check if the final character of the original string WASN'T a newline.
		[ -n "$L" ] && [[ $nl != $(printf %s "$L" | tail -c1 | hexdump | cut -c 9- | head -n1) ]] && {
			no_nl=1
		};

		[ -n "$L" ];
	}; do
		line=$(printf %s%s $L $stopchar | sed -E $pattern);
		output+=${line/%Z};
		
		[ $no_nl ] && {
			output=${output/%$'\n'}
		};
	done;

	printf %s $output
}


# Basic wrapper for echoing an error message to stderr
error(){
	tput setaf 9
	>&2 echo $1
	tput sgr0
}


# Neuter the internal field separator.
IFS=''


# Declare some variables used later on.
chars='[ 	]+'
mode=255


# Assign any options that we were passed.
while getopts lrt:f:wc option; do
	case $option in
	l)	mode=$(( $mode ^ 1 ))	;;	#	-l	Trim only the left-hand side of each line
	r)	mode=$(( $mode ^ 2 ))	;;	#	-r	Trim only the right-hand side
	t)	chars=$OPTARG			;;	#	-t	Specify a custom regex to use when trimming characters from each side
	f)	file=$OPTARG			;;	#	-f	Use the specified file's content as input
	w)	writeback=1				;;	#	-w	Write over the source file if -f was enabled
	c)	clipboard=1				;;	#	-c	Read/write to and from system clipboard
	esac
done
shift $((OPTIND - 1))


# Invert our bitmask if asked to trim from a specific end.
if [ $mode != 255 ]; then mode=$(( ~$mode & 0xFF )); fi


# Determine which of a line's ends to trim.
start=$((	$mode & 1 ))
end=$((		$mode & 2 ))


# Construct a pattern to pass to sed.
if   [[ $start -gt 0 && $end -gt 0 ]];	then	pattern="^$chars|$chars$";
elif [[ $start -gt 0 ]];				then	pattern="^$chars";
elif [[ $end -gt 0 ]];					then	pattern="$chars$";
fi

# Resolve the final pattern to pass to the stream editor.
pattern='s/'$pattern'//g'



# Source our input from the system clipboard if -c was set.
if [ $clipboard ]; then pbpaste | do_trim | pbcopy


# We've been given a file to trim the contents of.
elif [ ! -z $file ]; then

	# -w flag was set
	if [ $writeback ]; then

		# Write the modified contents back to the file.
		if [ -w $file ]; then
			cat $file | do_trim | tee $file > /dev/null;

		# File couldn't be written to (lack of permission, or the resource was read-only).
		else
			error "ERROR: File not writable. Sending to standard output instead."
			do_trim < $file;
		fi


	# Not writing back to the file, so just send to standard output instead.
	else do_trim < $file; fi;
	


# If supplied arguments, concatenate them altogether and trim 'em.
elif [ $# -gt 0 ]; then
	for i in $*; do
		printf '%s\n' "$i" | do_trim;
	done


# Otherwise, just read from STDIN.
else
	input=''
	finished=

	# Callback triggered when stdin's finished being read, or user cancels interactive input
	end(){
		if [ ! $finished ]; then
			echo ${input/%$'\n'} | do_trim
			trap 1 2
			finished=1
			exit;
		fi
	}

	trap end 2;
	while read -r L; do
		input+=$L$'\n'
	done;

	finished=1
	echo ${input/%$'\n'} | do_trim
fi
