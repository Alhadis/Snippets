#!/bin/sh
shopt -s dotglob

# Print current activity
status(){
	printf "\033[1;94m==>\033[0m\033[1m %s\033[0m"$'\n' "$1";
}

# Update the repository of a VCS-controlled project folder
update(){
	i="$1"; [ -z "$i" ] && i=.;
	
	# Git
	[ -d "$i/.git" ] && {
		status "Updating: $i"
		cd $i && git status --porcelain && git pull;

		# Prune remote-tracking branches
		[ -z "$prune" ] || {
			git fetch -p origin;
			git remote show | grep -x fork >/dev/null && git fetch -p fork;
		};
		
		# Run housekeeping tasks
		case "$gc" in
			1) git gc && git prune -v;;
			2) git gc --aggressive && git prune -v;;
		esac
		
		cd ..;
		return 0;
	};
	
	# Subversion
	[ -d "$i/.svn" ] && {
		status "Updating: $i"
		cd $i;
		hash dsclean 2>/dev/null && dsclean -q;
		svn update;
		cd ..;
		return 0;
	};
	
	return 1;
}

# Display a short help notice and exit
echo $* | grep -E '(\s|^)(--help|-[h?])(\\s|$)' >/dev/null && {
	B=$(printf "\x1B[1m")
	R=$(printf "\x1B[0m")
	I=$(printf "\x1B[4m")
	cat <<-EOF
	${B}Usage:${R} update-repos [${B}-h${R}|${B}--help${R}] [${B}-gGp${R}] <${I}directories${R}>
	
	Update a folder of Git or SVN repositories.
	
	${B}Options:${R}
	  ${B}-h${R}    Display this help output and exit
	  ${B}-g${R}    Perform garbage collection and optimisation
	  ${B}-G${R}    Perform more aggressive garbage collection
	  ${B}-p${R}    Prune remote-tracking branches
	
	Run \`man update-repos\` for full documentation.
	EOF
	exit 0;
};

# Resolve options
while getopts gGp option; do
	case $option in
		p)   prune=1 ;; # -p    Prune remote-tracking branches
		g)   gc=1    ;; # -g    Perform garbage collection and optimisation
		G)   gc=2    ;; # -G    Perform more aggressive garbage collection
	esac
done
shift $((OPTIND - 1))

# Resolve positional parameters
[ $# -eq 0 ] && dirs=$(pwd) || dirs=($@)

IFS=''

# Look for VCS-enabled projects in each directory
for i in ${dirs[@]}; do
	cd "$i";
	update "$i" || for i in *; do update "$i"; done;
done;

exit 0;
