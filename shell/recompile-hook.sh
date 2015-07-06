#!/bin/bash

BOLD=`tput bold`
BLUE=`tput setaf 34`
RESET=`tput sgr0`
TEXT='Recompiling binaries'

printf %s$'\n' "${BOLD}${BLUE}==>${RESET}${BOLD} ${TEXT}${RESET}"

git submodule init
git submodule update
make clean all

