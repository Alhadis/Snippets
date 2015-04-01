#!/bin/bash
# Compares the checksums of each file in two folders, sorted in running order.


# If this were a real shell program, we'd default to the first two directories found in the working directory.
# But as it's not (wrote this while waiting for a transfer to finish), screw it. echo $complaints >/dev/null
if [ $# -lt 2 ]; then
	U=$(tput smul)	# Underline - Start
	u=$(tput rmul)	# Underline - Stop

	echo "ERROR: Require two directories to perform checksum comparison.
usage: $0 [${U}dir-1${u} ${U}dir-2${u}]" >&2
	exit 1;
fi


dir_a=($1/*);
dir_b=($2/*);
count=${#dir_a[*]};

IFS=

tick=$(echo -e "\xE2\x9C\x94")
cross=$(echo -e "\xE2\x9C\x98")


# Colour formatting "constants".
GREEN=$(tput setaf 2);
RED=$(tput setaf 1);
NORMAL=$(tput sgr0);

# Start the loop.
for ((i=0; i < $count; i++)); do
	check_a=$(md5 -q ${dir_a[$i]});
	check_b=$(md5 -q ${dir_b[$i]});


	if [ $check_a = $check_b ];
		then	printf '%s%s.	%s  = %s  %s	%s\n' $GREEN	$(( $i + 1 )) $check_a $check_b $tick $NORMAL
		else	printf '%s%s.	%s != %s  %s	%s\n' $RED		$(( $i + 1 )) $check_a $check_b $cross $NORMAL
	fi
done;
