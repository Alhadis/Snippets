# Portability-related mask tasks. Examples included.


# Check that the tools this Makefile requires are available
check:
	$(call chk, pdftotext,   'Run `brew install poppler` and try again.')
	$(call chk, wkhtmltopdf, "Download and install wkhtmltopdf. \
	You'll be glad you did:\n\x1B[4mhttp://wkhtmltopdf.org/downloads.html\x1B[0m")


# Verify the availability of an external dependency
define chk
	@hash $1 2>/dev/null || {                                        \
		echo >&2 "\x1B[31;4;38;5;9mERROR!\x1B[0m\n";                  \
		echo >&2 "    \x1B[1m"$(1)"\x1B[0m not installed\n";           \
		[ $(2) ] && echo >&2 "$$(echo $(2) | sed 's/^/     /g')" "\n";  \
		echo >&2 "\x1B[31;38;5;9mTask aborted\x1B[0m";                   \
		exit 8;                                                           \
	}
endef
