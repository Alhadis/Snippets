#!/bin/sh

# Switch the script's current directory
cd `dirname $0`;

# Neuter the internal field separator
IFS=''

# Formatting variables
BOLD=`tput bold`
BLUE=`tput setaf 12`
RED=`tput setaf 9`
RESET=`tput sgr0`

# Include directories that start with a leading dot
shopt -s dotglob


# Print a divider to STDOUT to break up feedback better
marker(){
	printf %s$'\n' "${BOLD}$1==>${RESET}${BOLD} $2${RESET}";
}


# Cycle through each item in the CWD
for i in *; do
	
	# Ensure the item's really a Git repository
	[ -d "$i/.git" ] && { echo $(

		cd $i;
		
		# This repo's been flagged as exempt from updates; skip it
		[ $(git config updates.skip) ] && marker $RED "Skipping: $i" || {
			marker $BLUE "Updating: $i"

			# Update!
			git status --porcelain && { git pull; };
		};

	); };
	
	
	# Is this a Subversion repository instead?
	[ -d "$i/.svn" ] && { echo $(
		
		cd $i;
		
		# Drop another divider to break feedback up a little
		marker $BLUE "Updating: $i"
		
		# Clear .DS_Store crap if possible
		hash dsclean 2>/dev/null && dsclean;
		
		# Update!
		svn update;
	); };
done;
