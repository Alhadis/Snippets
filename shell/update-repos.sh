#!/bin/sh

# Switch the script's current directory
cd `dirname $0`;

# Neuter the internal field separator
IFS=''

# Formatting variables
BOLD=`tput bold`
BLUE=`tput setaf 12`
RESET=`tput sgr0`


# Cycle through each item in the CWD
for i in *; do
	
	# Ensure the item's really a Git repository
	[ -d "$i/.git" ] && { echo $(

		cd $i;

		# Print a divider to STDOUT to break the feedback up better
		printf %s$'\n' "${BOLD}${BLUE}==>${RESET}${BOLD} Updating: $i${RESET}";

		# Update!
		git status --porcelain && { git pull; };

	); };
	
	
	# Is this a Subversion repository instead?
	[ -d "$i/.svn" ] && { echo $(
		
		cd $i;
		
		# Drop another divider to break feedback up a little
		printf %s$'\n' "${BOLD}${BLUE}==>${RESET}${BOLD} Updating: $i${RESET}";
		
		# Clear .DS_Store crap if possible
		hash dsclean 2>/dev/null && dsclean;
		
		# Update!
		svn update;
	); };
done;
