#!/bin/sh

IFS=
alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ - 1234567890 - abcdefghijklmnopqrstuvwxyz";
reset=$(tput sgr0);

for((i = 0; i <= 256; i++)); do
	colour=$(tput setaf $i);
	space=" ";
	[ $i -lt 10 ] && { space="  ";   };
	[ $i -gt 99 ] && { space=""; };
	echo "${reset}${space}$i   ${colour}${alphabet}";
done;

echo $reset;
