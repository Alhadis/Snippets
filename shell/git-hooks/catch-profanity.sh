#!/bin/sh
set +o posix

#
# Exit with a non-zero error code if a profanity's found in a file.
#
# I'd never commit strong language to a project, so this helps identify test or
# debugging code written while rushed or frustrated (that was supposed to have
# been removed prior to publishing).
#
# Stuff like "test" or "temp" in code is far too open to misinterpretation,
# but profanity almost always indicates something that doesn't belong.
#

words="FUCK|CUNT"
stopmsg="Forgot to finish something?"


# Use mdfind if it's available
hash mdfind 2>/dev/null && {
	words=$(printf %s $words | sed -re's/\|/ OR /g')
	
	# Find paths of affected files and make them relative to CWD
	results=$(mdfind -onlyin . "$words" | sed -re 's|'"$(pwd)/?"'||g');
	
	# Ascertain which files are being ignored by Git
	excluded=$(echo "$results" | git check-ignore --stdin)
	
	# Intersect those paths with non-ignored paths
	results=$(echo "$results" | grep -vF "$excluded")
	
	[ "$results" ];
} || {
	
	# Not available, just grep it instead
	[ -r "./.gitignore" ] && ignore=--exclude-from=.gitignore
	results=$(grep -irnwE --exclude-dir=.git . -e "($words)" "$ignore");
}


# Exit 1 if we picked up something
[ "$results" ] && {
	printf %s$'\n' "$stopmsg" >&2;
	printf %s$'\n' "$results" | sed -re's/^/\t/g' >&2;
	printf %s$'\n' "Aborting commit." >&2;
	exit 1;
}

exit 0;
