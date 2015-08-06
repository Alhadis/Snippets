#!/bin/sh
# Standard atomic commits I run after initialising a new .git repo

snippets=$HOME/Labs/Snippets
usegit=1

while getopts u opt; do case $opt in
	u)	usegit= ;;
	\?)	>&2 echo "Example usage:
    prep-repo         # Standard usage
    prep-repo -u      # Copy files, but don't commit to Git"; exit 1;;
esac; done


# Git hasn't been initialised in this directory yet, so do so
[ $usegit ] && [ ! -d .git ] && {
	git init;
	git add . --all;
	git commit -m "Initialise repository";
};

# Crap we hate/don't need
cp ${snippets}/.gitignore ./.gitignore
[ $usegit ] && {
	git add .gitignore;
	git commit -m "Declare ignored resources";
};


# Editor configuration
cp ${snippets}/.editorconfig ./.editorconfig
[ $usegit ] && {
	git add .editorconfig;
	git commit -m "Declare codebase's formatting conventions";
}
