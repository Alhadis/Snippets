#!/bin/sh

image_ext='png|gif|jpe?g$'

for i in *; do
	type=$(file -b --mime-type "$i" | grep -Eo "/$image_ext/" | tr -d '/' | sed -e 's/jpeg/jpg/')

	# Add respective file-extension if needed.
	[ $type ] && {
		mv $i $(echo $i | sed -Ee "s/\.($image_ext)//")".$type" || {
			tput setaf 9;
			>&2 printf 'Could not rename file "%s".\n' $(basename $i);
			tput sgr0;
		};
	};

done;
