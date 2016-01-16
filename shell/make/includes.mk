
# Verify the availability of an external dependency
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



# Add colouring and underlines to URL patterns in a string
define url-decorate
	printf %s $(1) | sed -r -e 's/$(url-decorate-match)/$(url-decorate-replace)/g'
endef
url-decorate-match    := (((https?|ssh|git|ftps?|rsync|file|svn):\/\/)|mailto:|data:)[^] \t\r\n\f)\x27">]+
url-decorate-replace  := \x1B[4;32m&\x1B[0m
