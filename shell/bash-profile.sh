
# Global aliases
alias l='ls -alh'
alias bc='bc -l'
alias g='git status'
alias u='pbpaste | uglifyjs --mangle 2>/dev/null | pbcopy'
alias strip-meta='exiftool $@ "-All=" -overwrite_original'
alias fuck-this-shit='git reset --hard HEAD; git clean -fd'
alias lipsum='lorem-ipsum 10 paragraphs'
alias fit-chrome='osascript -e '"'"'tell first window of application "Google Chrome" to set bounds to {0, 0, 1440, 820}'"'"
alias html-day-options='output=""; for i in {1..31}; do output+=$(printf "<option value=\"%d\">%02d</option>" $i $i); done; echo $output | pbcopy';
alias apl='apl --noColor'
alias md5='md5 -q'


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
