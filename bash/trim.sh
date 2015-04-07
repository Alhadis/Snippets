#!/bin/bash

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

     The trimmed text is echoed to standard output by default. Use ${B}-o${b} to write the results to disk,
     or ${B}-w${b} to modify the file the text was originally sourced from using ${B}-f${b}.

${B}OPTIONS${b}
     ${B}Processing control${b}
       -l              Trim only the left-hand side of each line
       -r              Trim only the right-hand side
       -t ${U}TRIM_CHARS${u}   Regex for trimming each side of a text row. Defaults to '[\t\x20]+' (tabs, spaces)

     ${B}Input/Output${b}
       -f ${U}FILE${u}         Use the specified file's content as input
       -w              If -f was set, write the modified data back to the source file
       -o ${U}OUTPUT${u}       Path to write the trimmed text to. If omitted, echoes straight to standard input. Ignored if -w is used
       -c              Operate directly on the contents of the system's clipboard, ignoring all further arguments

     ${B}Other${b}
       -h, --help      Display this help page and exit
";
exit; fi

# Subroutine that handles the final line-trimming once input's been resolved.
do_trim(){
	finished=

	# Callback triggered when we've finished cycling through our input; or if interactive input's been interrupted by user.
	end(){
		printf %s%s $output $L;
		if [ ! $finished ]; then
			trap 1 2
			finished=1
			exit;
		fi
	}

	# Start listening for an interrupt signal.
	trap end 2;

	# Begin processing standard input
	output=''
	eol=$'\n'"Z"
	while read -r L || [ $({ eol=''; }) ]; do
		line=$((printf %s%s $L $eol) | sed -E $pattern);
		output+=${line/%Z/};
	done

	finished=1
	end
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
while getopts lrt:f:wo:c option; do
	case $option in
	l)	mode=$(( $mode ^ 1 ))	;;	#	-l	Trim only the left-hand side of each line
	r)	mode=$(( $mode ^ 2 ))	;;	#	-r	Trim only the right-hand side
	t)	chars=$OPTARG			;;	#	-t	Specify a custom regex to use when trimming characters from each side
	f)	file=$OPTARG			;;	#	-f	Use the specified file's content as input
	w)	writeback=1				;;	#	-w	Write over the source file if -f was enabled
	o)	output=$OPTARG			;;	#	-o	Write trimmed content to given file
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

	# If the -w flag was set, write the modified contents back to the file (assuming it's writable).
	if [ $writeback ] && [ -w $file ]; then
		cat $file | do_trim | tee $file;

	# File couldn't be written to (lack of permission, or the resource was read-only).
	else
		error "ERROR: File not writable. Sending to standard output instead."
		do_trim < $file;
	fi;
	


# If supplied arguments, concatenate them altogether and trim 'em.
elif [ $# -gt 0 ]; then
	for i in $*; do
		printf '%s\n' "$i" | do_trim;
	done


# Otherwise, just collect from user's terminal input.
else do_trim; fi
