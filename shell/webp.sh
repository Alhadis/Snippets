#!/bin/sh

# Quick conversion of WebP images
[[ ! $1 ]] && {>&2 echo "ERROR: No argument passed."; exit 1; } || {

	[ -f $1 ] && {
		abspath=$(realpath "$1")
		dirname=$(dirname "$abspath");
		filename=$(basename "$abspath");
		echo "$filename" | grep -e '\.webp$' && { cmd=dwebp; ext=.png; }
		${cmd-cwebp} "$abspath" -o "$dirname/"$(echo "$filename" | sed -E "s/(\.[A-Za-z0-9]+)$//")${ext-.webp};
	} || {
		>&2 echo "ERROR: \"$1\" isn't a valid image file.";
		exit 1;
	}
}
