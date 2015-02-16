#!/bin/bash
# batch-rename.sh


# Define token substrings that get replaced with variables in the file loop
token_name='$n'		# Original filename
token_index='$i'	# Counter's current index

# Default behaviour is to essentially do nothing: rename the file to itself.
format=$token_name

count=0
use_regex=false
verbose=false

while getopts f:c:e:n:i:v option; do
	case $option in
	f)	format=$OPTARG	;; # Format string
	c)	count=$OPTARG	;; # Count from
	e)	format=$OPTARG
		use_regex=true	;; # Regular expression to use instead
	n)	token_name=$OPTARG	;; # Substring that's replaced with file's original filename
	i)	token_index=$OPTARG	;; # Substring in $format that's replaced with counter's current value
	v)	verbose=true		;; # Print changed filenames to STDOUT
	esac;
done
shift $((OPTIND - 1))


# Loop through the remainder of our arguments (each assumed to be file paths)
for i in $@; do
	count=$(($count+1))
	extension=$(echo $i | sed -E 's/^.*(\.[A-Za-z0-9]+)$/\1/g')
	dir=$(dirname $i)
	name=$(basename $i $extension)

	# Tokenise format string
	new="${format/$token_index/$count}"
	new="${new/$token_name/$name}"

	if($use_regex == true); then
		new=$(echo $name | sed -E "$new")
	fi

	# Print some feedback if we're running in verbose mode
	if($verbose == true); then printf "Changed:    ${name} -> ${new}\n"; fi

	new="$dir/$new$extension"
	mv -n $i $new
done
