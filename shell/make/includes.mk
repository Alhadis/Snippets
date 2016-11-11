# Windows: CMD.exe
ifdef SystemRoot
	IS_WINDOWS = 1
endif

# Windows: MinGW / COMMAND.COM
ifdef SYSTEMROOT
	IS_WINDOWS = 1
endif


# Absolute path of currently-running Makefile
CURRENT_MAKEFILE = $(abspath $(lastword $(MAKEFILE_LIST)))


#===============================================================================
#  chk: "Check"               $(call chk, node, "You'll need Node to run this!")
#
#  Verify the availability of an external dependency
#===============================================================================

CHK_RESET   := \x1B[0m
CHK_BOLD    := \x1B[1m

# Windows
ifdef IS_WINDOWS
define chk
	@which $1 > nul 2> nul || ( \
		$(call e,$(CHK_ERROR)ERROR!$(CHK_RESET)\n) & \
		$(call e,    $(CHK_BOLD)$(1)$(CHK_RESET) not installed\n) & \
		( if '' NEQ 'MINNUT' ( \
			$(call url-decorate,$(2)) | \
			sed -r "s/^/     /g" ) \
		) & \
		$(call e,\n$(CHK_ERROR)Task aborted$(CHK_RESET)) & \
		die 2> nul \
	)
endef
CHK_ERROR   := \x1B[31;1m
CHK_RESET   := \x1B[0m


# Unix-friendly/regular variant
else
define chk
	@hash $1 2>/dev/null || {                                       \
		echo >&2 "$(CHK_ERROR)ERROR!$(CHK_RESET)\n";                 \
		echo >&2 "    $(CHK_BOLD)"$(1)"$(CHK_RESET) not installed\n"; \
		[ $(2) ] && {                                                  \
			text=$$($(call url-decorate,$(2)));                         \
			echo >&2 "$$(echo "$${text}" | sed 's/^/     /g')" "\n";     \
		};                                                                \
		echo >&2 "$(CHK_ABORTED)Task aborted$(CHK_RESET)";                 \
		exit 8;                                                             \
	}
endef
CHK_ERROR   := \x1B[31;4;38;5;9m
CHK_ABORTED := \x1B[31;38;5;9m
endif





#===============================================================================
#  url-decorate              $(call url-decorate, "Hey look! http://pretty.url")
#
#  Add colouring and underlines to URL patterns in a string
#===============================================================================

# Windows (currently not working)
ifdef IS_WINDOWS
base64-encoded-regex       := KCgoKGh0dHBzP3xzc2h8Z2l0fGZ0cHM/fHJzeW5jfGZpbGV8c3ZuKTpcL1wvKXxtYWlsdG86fGRhdGE6KVteXHg1RCBcdFxyXG5cZlwpXHgyNyI+XSsp
base64-encoded-replacement := G1szMm0kMRtbMG0=

define url-decorate
	@printf $(1) | node -e "var p = process, i = p.stdin; i.on('readable', function(){ \
		var input = (i.read() || '') + ''; \
		var regex = new RegExp(new Buffer('$(base64-encoded-regex)', 'base64').toString('ascii'), 'gi'); \
		console.log(input.replace(regex, '$$1')); \
	})"
endef



# Everybody else
else
url-decorate-match    := (((https?|ssh|git|ftps?|rsync|file|svn):\/\/)|mailto:|data:)[^] \t\r\n\f)\x27">]+
url-decorate-replace  := \x1B[4;32m&\x1B[0m

define url-decorate
	printf %s $(1) | sed -r -e 's/$(url-decorate-match)/$(url-decorate-replace)/g'
endef
endif



#===============================================================================
#  escape                   $(call escape, "Code with too many string literals")
#
#  Escape single and double-quotes in a string
#===============================================================================
define escape
$(subst $(escape-apos),$(escaped-apos),$(subst $(escape-quot),$(escaped-quot),$(1)))
endef
escape-apos  := '
escape-quot  := "
escaped-apos := \'
escaped-quot := \"



#===============================================================================
#  watch                                    $(call watch,file-pattern,task-name)
#
#  Run a Make task in response to filesystem changes
#  Requires Watchman: https://facebook.github.io/watchman/
#===============================================================================
define watch
	@watchman watch $(shell pwd) > /dev/null
	@watchman -- trigger $(shell pwd) '$(2)-$(1)' $(1) -- make $(2) > /dev/null
endef

# Complementary unwatch function
define unwatch
	@watchman watch-del $(shell pwd) > /dev/null
endef



#===============================================================================
#  e: "Escape-echo"                     $(call e, "String with ANSI formatting")
#
#  Windows-compatible ANSI escape code echoing
#===============================================================================
# ANSI escape codes aren't supported by the Win32 console, which instead uses
# system-level API calls to manipulate text formatting and colours.
#
# Thankfully, Node transparently maps ANSI escape sequences to the appropriate
# system calls that Windows understands; hence the reason most Windows users
# never see anything wrong with NodeJS output.
#
# Rather than embedding a tangled Batch script in our Makefile, we can simply
# leverage Node support to handle the translation for us.
#
ifdef IS_WINDOWS
	e = node -e "console.log('$(call escape,$(1))')"
else
	e = echo $(1)
endif




#===============================================================================
#  minify                                               $(call minify,image.png)
#
#  Routine to compress PNGs with TinyPNG, if an API key is available
#===============================================================================
ifdef TINYPNG_KEY
define minify
echo "Compressing image with TinyPNG...";
URL=$$(curl https://api.tinify.com/shrink \
	--user api:$(TINYPNG_KEY) \
	--data-binary @$1 \
	--silent | grep -Eo '"url":"https[^"]+"' | cut -d: -f 2-3 | tr -d '"'); \
echo "Downloading from $$URL"; \
curl $$URL --user api:$(TINYPNG_KEY) --silent --output $1
echo "Compression complete."
endef
endif





#===============================================================================
#  close-preview                                        $(call close-preview,$*)
#
#  Close a file that's currently open in Preview
#===============================================================================
define close-preview
osascript \
-e 'tell application "Preview"' \
	-e 'set windowCount to number of windows' \
	-e 'repeat with x from 1 to windowCount' \
		-e 'set docName to (name of document of front window)' \
		-e 'if (docName starts with "$1") then' \
			-e 'close window x' \
		-e 'end if' \
	-e 'end repeat' \
-e 'end tell'
endef
