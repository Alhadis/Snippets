#!/bin/sh
set +o posix


# Not enough arguments
[ $# -lt 2 ] && {
	case $# in
		1) echo "ERROR: No output directory specified";;
		0) echo "ERROR: No input/output directories specified";;
	esac
	
	basename=$(basename "$0")
	echo "Usage: $basename [input-directory] [output-directory]"
	exit 5;
};


# Input/output directories
in="$1"
out="$2"
mkdir -p $out


# Formatting constants
BOLD=$(tput bold)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
BRIGHT_GREEN=$(tput setaf 10)
RESET=$(tput sgr0)

# Messages
EXTRACTING="${BOLD}${GREEN}Extracting:${RESET} %s"$'\n'
ALREADY_EXTRACTED="${BOLD}${RED}Already extracted:${RESET} %s"$'\n'


# Scan files
IFS=$'\n'
files=$(find "$in" -name "*.*")
for i in $files; do
	
	# Make sure this isn't a directory
	[ -f "$i" ] && {
		
		# Read what file format the song's artwork is saved in
		img_format=$(exiftool -s3 -PictureFormat "$i" | tr "[A-Z]" "[a-z]")
		
		# Make sure the song has artwork embedded in it
		[ "$img_format" ] && {
			
			# Extract ID3 information
			artist=$(     exiftool -s3 -Artist "$i" | filesafe)
			album=$(      exiftool -s3 -Album  "$i" | filesafe)
			
			# Define the filename to extract the image to
			img_name="${artist} - ${album}.${img_format}"
			
			
			# We're overwriting a file of the same name
			[ -f "$out/$img_name" ] && {
				
				# Check if this image's content is different to the other one's
				checksum=$(exiftool -b -Picture "$i" | md5 -q)
				[ "$checksum" != $(md5 -q "$out/$img_name") ] && {
					
					# Different: save it under a different filename
					img_name="${artist} - ${album} [$checksum].${img_format}"
					printf "$EXTRACTING" "$img_name"
					exiftool -b -Picture "$i" > "$out/$img_name";
				} || {
					
					# Identical
					printf "$ALREADY_EXTRACTED" "$img_name"
				};
			
			} || {
				# Extracting this image for the first time
				printf "$EXTRACTING" "$img_name"
				exiftool -b -Picture "$i" > "$out/$img_name";
			};
		};
	}
	
done;

printf "${BRIGHT_GREEN}%s${RESET}" $(echo -e "\xE2\x9C\x93")
echo " ${BOLD}${BRIGHT_GREEN}Done!${RESET}"
exit 0;
