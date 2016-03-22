#!/bin/sh

dryrun=
while getopts n option; do
	case $option in
		n) dryrun=1;;
	esac
done;
shift $((OPTIND - 1))

# Print usage message if no arguments were specified
[ $# -eq 0 ] && {
	echo >&2 "Usage: $0 [files...]"
	exit 1;
}


results=''
duplicates=''
kill_count=0
skipped=''


# Checks if a given file is a duplicate of a previously-checked file
check_file(){
	
	# Read the file's checksum
	checksum=$(md5 -q "$i" 2>/dev/null)
	
	# Bail if md5 exited with a non-zero status
	status=$?
	[ $status -ne 0 ] && { return $status; }

	
	# Have we run into this checksum before?
	echo $results | grep -Evo "$checksum:" >/dev/null && {
		results+="${checksum}: $i"$'\n'
	} || {
		duplicates+="${checksum}: $i"$'\n'
		
		# Annihilate the file unless we're running dry
		[ $dryrun ] || {
			
			[ -w "$i" ] && {
				rm "$i";
				kill_count=$(( $kill_count + 1 ));
			} || { skipped+="$i"$'\n'; }
		}
	}
}

# Runs check_file on the immediate contents of a directory
scan_directory(){
	files=$(find "$1" -type f -maxdepth 1)
	
	for i in $files; do check_file "$i"; done;
}


IFS=$'\n'
for i in $@; do
	
	# This is a directory
	[ -d "$i" ] && { scan_directory "$i"; };
	
	# Argument points to a regular file
	[ -f "$i" ] && { check_file "$i"; }

done;


# Formatting variables
BOLD=$(tput bold)
RESET=$(tput sgr0)
indent='s/^/    /g'

# There weren't any files to process
[ ! "$results" ] && [ ! $duplicates ] && {
	echo "${BOLD}NOTHING FOUND${RESET}";
	exit 2;
}

# Show which files were unique
[ "$results" ] && {
	echo "${BOLD}UNIQUE:${RESET}"
	printf %s "$results"    | sed "$indent";
}

# List the duplicates we found, if any
[ "$duplicates" ] && {
	echo "${BOLD}DUPLICATES:${RESET}"
	printf %s "$duplicates" | sort | sed "$indent";
}



# Print how many files were skipped
[ -n "$skipped" ] && {
	echo "${BOLD}SKIPPED:${RESET}"
	echo "$skipped" | sed "$indent"
}

# Show how many files were deleted, if any
[ $kill_count -gt 0 ] && {
	printf "${BOLD}REMOVED %s FILES${RESET}"$'\n' $kill_count;
}
