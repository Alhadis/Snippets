#!/bin/bash
# Display help if requested, which also allows the following block to double as nifty inline documentation.
if [[ `echo "$*" | grep -E '(\s|^)(--help|-h)(\s|$)'` != '' ]]; then
echo " 

                          WORDPRESS AUTO-DEPLOY
                              Version 0.1


  Performs automated pre-deployment tasks and reuploads the theme's files.

  The routines executed by the script are listed in their running order:

    1. [-c]  Compress stylesheets
    2. [-j]  Compress scripts
    2. [-e]  Strip embedded metadata from images in the theme's /src/img path
    3.       Delete useless .DS_Store files from theme directory
    4. [-u]  Upload the theme folder's contents to the server
    5. [-b]  Tell server that files were updated so it can refresh any caches

  If any of the options [-cjeub] are passed, the script limits its behaviour
  to the requested operations; otherwise, each of them will be triggered by
  default.


  Options:

    -h      Display this help file (also invoked using \"--help\")
    -c      Compress stylesheets only
    -j      Compress scripts only
    -e      Remove embedded metadata from images only
    -u      Upload files only
    -b      Bust cache only


  Modification:
  
  This script was written to be edited and customised on a per-project basis,
  with different copies assigned to different project folders. Consequently,
  consider this code a boilerplate script rather than a configurable, 
  all-in-one solution.
";
	exit;
fi



# Enough documentation. Begin parsing our options.
all=31
compress_css=1
compress_js=2
strip_meta=4
upload_files=8
bust_cache=16
tasks=0

while getopts c:j:e:u:b option; do
	case $option in
	c)	tasks=$(( $tasks | $compress_css ))	;; # Compress CSS
	j)	tasks=$(( $tasks | $compress_js ))	;; # Compress JS
	e)	tasks=$(( $tasks | $strip_meta))	;; # Strip metadata
	u)	tasks=$(( $tasks | $upload_meta))	;; # Upload files
	b)	tasks=$(( $tasks | $bust_cache))	;; # Bust cache
	esac;
done
shift $((OPTIND - 1))


# Here's where customisation is gonna begin.
default_tasks=$(( $all ^ $compress_js ))
script_path=$(cd "$(dirname "$0")" && pwd)
theme_name='xyz'
remote_url='http://example.com'
theme_path="$script_path/wp-content/themes/$theme_name"
tabulate="    "

# Connection credentials
ssh_key=~/.ssh/key.pem
ssh_user='username'
ssh_host='##.###.###.##'



# If we still have a blank value for our task list, it means no specific ops were given. Do everything.
if [ $tasks == 0 ]; then tasks=${default_tasks-all}; fi;

# Compress stylesheets
if [ $(($tasks & $compress_css)) != 0 ]; then
	echo "Compressing stylesheets..."
	cd $theme_path/src/css
	min=../min/min.css
	hash=$(md5 -q $min)
	modify_time=`stat -f "%Sm" -t "%Y%m%d%H%M.%S" $min`
	echo "fonts.css global.css main.css" | xargs cleancss --source-map --skip-advanced -o $min

	if [ $hash == $(md5 -q $min) ]; then
		echo "${tabulate}No change detected in minified CSS file."
		touch -t $modify_time $min
	fi
fi


# Compress scripts
if [ $(($tasks & $compress_js)) != 0 ]; then
	echo "Compressing scripts..."
	cd $theme_path/src/js
	min=../min/min.js
	hash=$(md5 -q $min)
	modify_time=`stat -f "%Sm" -t "%Y%m%d%H%M.%S" $min`
	echo "main.js" | xargs uglifyjs --source-map ${min}.map --screw-ie8 --mangle -o $min
	
	if [ $hash == $(md5 -q $min) ]; then
		echo "${tabulate}No change detected in minified JavaScript."
		touch -t $modify_time $min
	fi
fi


# Strip embedded metadata from images
if [ $(($tasks & $strip_meta)) != 0 ]; then
	echo "Stripping embedded metadata from images..."
	strip-meta $theme_path/src/img/*
fi


# Transfer each of the theme files to the server
if [ $(($tasks & $upload_files)) != 0 ]; then
	echo "Transferring files to server..."
	cd $theme_path/../
	find . -name "*.DS_Store" -type f -delete
	scp -r -p -i $ssh_key $theme_name ${ssh_user}@${ssh_host}:/var/www/html/wp-content/themes
fi


# Tell WordPress that some of the theme's files have been modified.
if [ $(($tasks & $bust_cache)) != 0 ]; then
	echo "Refreshing version strings..."
	curl -s -S "$remote_url/wp-admin/admin-ajax.php?action=cachebust" | xargs echo "${tabulate}$1"
fi