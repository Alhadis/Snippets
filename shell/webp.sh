#!/bin/sh

# Quick conversion of WebP images
[[ ! $1 ]] && {>&2 echo "ERROR: No argument passed."; exit 1; } || {

	[ -f $1 ] && {
		dirname=$(dirname "$1" | xargs realpath);
		filename=$(basename "$1");
		cwebp "$filename" -o "$dirname/"$(echo "$filename" | sed -E "s/(\.[A-Za-z0-9]+)$//")".webp";
	} || {
		>&2 echo "ERROR: \"$1\" isn't a valid image file.";
		exit 1;
	}
}
