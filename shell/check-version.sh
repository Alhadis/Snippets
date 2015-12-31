#!/bin/sh

path="$1"

# Formatting codes
UNDL_ON=$(   tput smul     )
UNDL_OFF=$(  tput rmul     )
RED=$(       tput setaf 9  )
RESET=$(     tput sgr0     )


# Returns the YYYY-MM-DD rendition of a date string, forcing everything into local time
normalise_time(){
	input=$(echo "$1" | tr -d "\"'")
	js='function z(i){return (i < 10 ? "0" : "")+i}'
	js+='var d = new Date("'$input'".replace(/\s+(?:\d{2}(?::\d{2}){2}.*)?$/, "") + " 00:00:00");'
	js+='([ d.getFullYear(), z(d.getMonth() + 1), z(d.getDate()) ].join("-"))'
	
	# Have I ever mentioned how much I freakin' hate timezones?
	node -pe "$js"
}


# Saves the existing commit message to the desktop
# If that couldn't be done, it just spits it to STDOUT instead.
save_message(){
	msg_copy="$HOME/Desktop/commit.message"
	cp "$1" $msg_copy && {
		echo "\nOriginal commit message copied to desktop:\n    $msg_copy";
	} || {
		echo "\nOriginal commit message:"
		printf %24s | tr ' ' '='
		printf $'\n'
		cat "$1";
	};
}


# Take a space-separated line of values and return them with line-breaks in between.
# Quoted values are left intact; an argument of "Alpha Bravo" won't be split across lines
inject_breaks(){
	local args=""
	repl=%%_____SPACE_____%%
	for i in "$@"; do
		args+=$(echo "$i" | sed 's/ /$repl/g')$'\n'
	done;
	echo "$args" | sed 's/$repl/ /g';
}



# The commit message starts with a "Release v#.#.#"-like pattern
version='([0-9]+\.[0-9]+\.[0-9]+)'
head -n1 < "$path" | grep -iEx "^(Release)?\s*v?$version" 2>&1 >/dev/null && {
	new_version=$(grep -Eo -m1 "$version" < "$path")
	
	# Package.json: Make sure the version inside matches the one we're committing
	[ -f package.json ] && {
		package_version=$(node -pe 'require("./package.json").version');
		[ $new_version != $package_version ] && {
			
			# Spit an error message
			echo >&2 "${RED}ERROR: Mismatching version in ${UNDL_ON}package.json${UNDL_OFF}!"
			echo >&2 "    Expected:  $new_version"
			echo >&2 "    Actual:    $package_version"
			
			save_message "$path";
			echo $RESET;
			exit 2;
		}
	};
	
	# Validate timestamps and version strings in man pages
	title='^\.TH\s+(\S+)\s+([0-9]+)(\s+("[^"]+"|\S+))(\s+("[^"]+"|\S+))?(\s+("[^"]+"|\S+)?)'
	pages=$(grep -Erxl . -e "$title") && {
		
		# Cycle through each Groff file
		for page in ${pages[@]}; do
			
			# Split each .TH element into different lines to help with reading spaces
			page_title=($(eval "inject_breaks "$(head -n1 < "$page")))
			IFS=$'\n'
			count=${#page_title[*]}
			
			page_name=
			page_number=
			page_date=
			page_version=
			expect_version=
			
			# Cycle through each element passed to the page's .TH macro
			for((i=1; i<$count; i++)); do
				value=${page_title[$i]}
				
				case $i in
					1) page_name=$value     ;; # Name
					2) page_number=$value   ;; # Page number
					3) page_date=$value     ;; # Modification date
					4) expect_version=1     ;; # Start expecting a version string
				esac
				
				# We can't expect version strings to be at any index in particular, because of preceding space-separation.
				[ $expect_version ] && page_version=$(echo "$value" | grep -Eom1 $version) && {
					expect_version=
					
					# We have a version string. Validate it.
					[ $page_version != $new_version ] && {
						
						# Nope, it's bad. Tell the user that.
						echo >&2 "${RED}ERROR: Mismatching version in ${UNDL_ON}${page}${UNDL_OFF}!"
						echo >&2 "    Expected:  $new_version"
						echo >&2 "    Actual:    $page_version"
						save_message "$path";
						echo $RESET;
						exit 3;
					}
					
					
					# Check the timestamp is accurate too
					page_time=$(  normalise_time "$page_date")
					today=$(      normalise_time "$(date +"%Y-%m-%d")")
					[ $today != $page_time ] && {
						
						# Whoops. Guess I fell asleep on that one, huh?
						echo >&2 "${RED}ERROR: Wrong date in ${UNDL_ON}${page}${UNDL_OFF}!"
						echo >&2 "    Expected:  $today"
						echo >&2 "    Actual:    $(echo $page_time | tr -d '\"')"
						
						save_message "$path";
						echo $RESET;
						exit 4;
					}
				}
			done
		done;
	};
}

exit 0;
