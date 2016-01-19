# Windows: CMD.exe
ifdef SystemRoot
	IS_WINDOWS = 1
endif

# Windows: MinGW / COMMAND.COM
ifdef SYSTEMROOT
	IS_WINDOWS = 1
endif



#===============================================================================
#  chk: "Check"               $(call chk, node, "You'll need Node to run this!")
#
#  Verify the availability of an external dependency
#===============================================================================
define chk
	@hash $1 2>/dev/null || {                                    \
		echo >&2 "\x1B[31;4;38;5;9mERROR!\x1B[0m\n";              \
		echo >&2 "    \x1B[1m"$(1)"\x1B[0m not installed\n";       \
		[ $(2) ] && {                                               \
			text=$$($(call url-decorate,$(2)));                      \
			echo >&2 "$$(echo "$${text}" | sed 's/^/     /g')" "\n";  \
		};                                                             \
		echo >&2 "\x1B[31;38;5;9mTask aborted\x1B[0m";                  \
		exit 8;                                                          \
	}
endef



#===============================================================================
#  url-decorate              $(call url-decorate, "Hey look! http://pretty.url")
#
#  Add colouring and underlines to URL patterns in a string
#===============================================================================
define url-decorate
	printf %s $(1) | sed -r -e 's/$(url-decorate-match)/$(url-decorate-replace)/g'
endef
url-decorate-match    := (((https?|ssh|git|ftps?|rsync|file|svn):\/\/)|mailto:|data:)[^] \t\r\n\f)\x27">]+
url-decorate-replace  := \x1B[4;32m&\x1B[0m




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
	e = @node -e "console.log('$(1)')"
else
	e = @echo $(1)
endif
