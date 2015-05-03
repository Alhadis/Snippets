
# Global aliases
alias l='ls -alh'
alias g='git status'
alias u='pbpaste | uglifyjs --mangle 2>/dev/null | pbcopy'
alias strip-meta='exiftool $@ "-All=" -overwrite_original'


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
