#!/bin/bash
# Because I really, really, really hate these useless files.

IFS=${IFS/ /}


# Check for "-h" or "--home" long-option
[[ `echo "$*" | grep -E '(\s|^)(--home|-h)(\s|$)'` != '' ]] && {
	dsclean "$HOME" 2>/dev/null;
	exit;
}


# Parse any options.
verbose=1

while getopts q option; do
	case $option in
	q) verbose=0 ;; # Suppresses all feedback
	esac
done
shift $((OPTIND - 1))



# Track how many files are deleted, and how many bytes we've saved. Just because.
total_filesize=0
skipped=0
removed=0


# Formatting variables
B=$(tput bold)              # Bold type
b=$(tput sgr0)              # Normal formatting
blue=$(tput setaf 12)       # Blue-coloured
arrow="${B}${blue}==>${b}"  # Arrow


# Display some feedback if we're running in verbose mode.
[ $verbose = 1 ] && { echo "$arrow${B} STARTING CLEAN:${b}"; }


# Right. Search and destroy.
for i in $(find ${1:-.} -name "*.DS_Store" -type f); do

	filesize=$(stat -f "%z" $i);
	directory=$(dirname $i);
	dirmod=$(stat -f "%Sm" -t "%Y%m%d%H%M.%S" $directory)


	# Kill the file.
	unlink $i 2>/dev/null && {

		# Deleted successfully.
		if [ $verbose = 1 ]; then printf '    Removed: %s (%s bytes)\n' $i $filesize; fi
		total_filesize=$(( $total_filesize + $filesize ))
		removed=$(( $removed + 1 ))
		
		# Restore the original modification time of the file's containing directory.
		touch -t $dirmod $directory

	} || {
		
		# File isn't writable (read-only or insufficient permissions). Skip it.
		[ $verbose = 1 ] && { printf "    Skipped: %s\n" $i; }
		skipped=$(( $skipped + 1 ))
	}

done;



# Generate a feedback string to pass to stdout
[ $verbose = 1 ] && {
	echo "$arrow${B} SUMMARY:${b}";

	feedback=$(printf "    %s file%s removed" $removed $([ $removed != 1 ] && echo 's'))

	# If at least one file was deleted, include how many bytes were saved in total.
	[ $removed -gt 0 ] && {

		# Use format-bytes if available.
		hash format-bytes 2>/dev/null && {
			total_filesize_f=$( format-bytes -p $total_filesize )
		} || {
			total_filesize_f=$( printf '%s bytes' $total_filesize )
		}

		feedback+=$( printf ' (%s total)' "$total_filesize_f" )
	};
	
	printf '%s\n' "$feedback";


	# If there were any files skipped for whatever reason, include those too.
	[ $skipped -gt 0 ] && { printf '    %s file%s skipped\n' $skipped $([ $skipped != 1 ] && echo 's'); };
};
