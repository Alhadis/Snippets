
# Global aliases
alias l='ls -alh'
alias bc='bc -l'
alias gl='git log'
alias g='git status'
alias ga='git add . --all'
alias p='pbpaste | purify | trim | sed -E s/"\r\n"/"\n"/ | tr "\r" "\n" | pbcopy'
alias u='pbpaste | uglifyjs --mangle 2>/dev/null | pbcopy'
alias strip-meta='exiftool $@ "-All=" -overwrite_original'
alias fuck-that-shit='git reset --soft HEAD~1;'
alias fuck-this-shit='git stash; git stash drop; git gc; git prune -v; git clean -fd;'
alias lipsum='lorem-ipsum 10 paragraphs'
alias fit-chrome='osascript -e '"'"'tell first window of application "Google Chrome" to set bounds to {0, 0, 1440, 820}'"'"
alias html-day-options='html-option-list -w 2 {1..31} | pbcopy';
alias passgen='passgen -c -l 24'
alias woff2-compress='woff2_compress'
alias woff2-decompress='woff2_decompress'
alias woff2-decode='woff2_decompress'
alias woff2-encode='woff2_compress'
alias cpan='sudo cpan'
alias md5='md5 -q'
alias n='node --harmony'
alias use-node='brew unlink iojs; brew link node;'
alias use-iojs='brew unlink node; brew link --force iojs;'
alias unquarantine='find .  -print0 -type f -o -type d | xargs -0 xattr -d com.apple.quarantine 2>/dev/null;'


# Temporary workaround until I get WP-HookTracer finished
alias hooks-on='perl -pi -e '"'"'s/(static\s+\$trace_(?:filters|actions)\s*=\s*)\d/${1}1/g'"'"' hooktracer.php'
alias hooks-off='perl -pi -e '"'"'s/(static\s+\$trace_(?:filters|actions)\s*=\s*)\d/${1}0/g'"'"' hooktracer.php'


# Global function for full-screening the terminal window.
fit(){
	# Make sure we're running interactively.
	[[ $- == *i* ]] && {
		osascript -e 'tell application "Terminal"
			activate
			set bounds of window 1 to {0, 0, 1440, 800}
			set position of window 1 to {0, 0}
		end tell';
	};
}
export fit; fit


# Various other crap
{ rm ~/.DS_Store; dsclean ~/Desktop; } > /dev/null 2>&1
cd ~/Desktop;
