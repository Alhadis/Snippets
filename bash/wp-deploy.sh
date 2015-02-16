#!/bin/bash


script_path=$(cd "$(dirname "$0")" && pwd)
theme_name='xyz'
remote_url='http://example.com'
theme_path="$script_path/wp-content/themes/$theme_name"

ssh_key=~/.ssh/key.pem
ssh_user='username'
ssh_host='##.###.###.##'

compress_css=true
compress_js=false
tabulate="    "


# Compress stylesheets
if [ $compress_css == true ]; then
	echo "Compressing stylesheets..."
	cd $theme_path/src/css
	min=../min/min.css
	hash=$(md5 -q $min)
	modify_time=`stat -f "%Sm" -t "%Y%m%d%H%M.%S" $min`
	cat fonts.css global.css main.css | cleancss --skip-advanced -o $min

	if [ $hash == $(md5 -q $min) ]; then
		echo "${tabulate}No change detected in minified CSS file."
		touch -t $modify_time $min
	fi
fi


# Compress scripts
if [ $compress_js == true ]; then
	echo "Compressing scripts..."
	cd $theme_path/src/js
	min=../min/min.js
	hash=$(md5 -q $min)
	modify_time=`stat -f "%Sm" -t "%Y%m%d%H%M.%S" $min`
	cat main.js | uglifyjs - --screw-ie8 --mangle -o $min
	
	if [ $hash == $(md5 -q $min) ]; then
		echo "${tabulate}No change detected in minified JavaScript."
		touch -t $modify_time $min
	fi
fi


# Strip embedded metadata from images
echo "Stripping embedded metadata from images..."
strip-meta $theme_path/src/img/*


# Transfer each of the theme files to the server
cd $theme_path/../
echo "Transferring files to server..."
find . -name "*.DS_Store" -type f -delete
scp -r -p -i $ssh_key $theme_name ${ssh_user}@${ssh_host}:/var/www/html/wp-content/themes

# Tell WordPress that some of the theme's files have been modified.
echo "Refreshing version strings..."
curl -s -S "$remote_url/wp-admin/admin-ajax.php?action=cachebust" | xargs echo "${tabulate}$1"
