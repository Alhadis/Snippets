#!/bin/sh
# Basic wrapper for the markdown-it module for NodeJS

input=$1
output=${2:-index.htm};


# If no input file was given, default to the first Markdown file encountered in the CWD
if [ -z $input ]; then
	input=(*.md);

	# Still nothing? Don't bother, just die.
	if [ -z $input ]; then
		tput setaf 9
		>&2 echo 'ERROR: No input markdown file specified. Aborting.';
		tput sgr0
		exit 1;
	fi
fi



# Keep our internal field separator from screwing with stuff
IFS=

# Marked-down content
markdown=$( markdown-it $input );

# Template variables
html=$(			cat $output);
line_count=$(	echo $html | wc -l);
before=$(		echo $html | grep -B $line_count -oEe '^.*<body>');
after='</body></html>';

# Stitch it altogether.
echo "${before}${markdown}${after}" | tee $output;
