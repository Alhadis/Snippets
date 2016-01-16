# Example usages of bundled includes file
include includes.mk


# Check that the tools this Makefile requires are available
check:
	$(call chk, pdftotext,   'Run `brew install poppler` and try again.')
	$(call chk, wkhtmltopdf, "Download and install wkhtmltopdf. \
	You'll be glad you did:\n\x1B[4mhttp://wkhtmltopdf.org/downloads.html\x1B[0m")
