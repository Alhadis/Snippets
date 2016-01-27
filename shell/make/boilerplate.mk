# Directories to read/write files to/from
CSSDIR          := src/css
JSDIR           := src/js
OBJDIR          := src/min


# CLI arguments for each program used to build our files
OPTS_CLEANCSS   := --skip-advanced
OPTS_UGLIFYJS   := --mangle


# Build all JavaScript and CSS files
all: css js
	
# Install needed dependencies
NODE_MODULES := cleancss myth uglifyjs babel
install:
	@for dep in $(NODE_MODULES); do \
		which "$$dep" 2>&1 > /dev/null && { echo "Checking $$dep: installed"; } || { \
			echo "Installing $$dep"; \
			npm -g install "$$dep"; \
		} \
	done;

.PHONY: install


#==============================================================================

# Primary CSS tasks
css:                css-main css-contact css-home
css-main:           $(OBJDIR)/min.css
css-contact:        $(OBJDIR)/page.contact.css
css-home:           $(OBJDIR)/page.home.css


# Build the main/global CSS bundle
$(OBJDIR)/min.css: $(OBJDIR)/fonts.css $(OBJDIR)/global.css $(OBJDIR)/main.css
	cat $^ > $@

# Build a single CSS file
$(OBJDIR)/%.css: $(CSSDIR)/%.css
	@mkdir -p "$(@D)"
	myth $< | cleancss $(OPTS_CLEANCSS) > $@


#==============================================================================

# Primary JS tasks
js:                 js-main js-home
js-main:            $(OBJDIR)/min.js
js-home:            $(OBJDIR)/home.js


# Macros
clear-subdir     = rmdir "$(sort $(filter-out $(OBJDIR),$(1)))";
USE_STRICT      := "use strict";

define compress-js
	printf '%s' '$(USE_STRICT)' > $@
	cat $^ | sed -E s/'$(USE_STRICT)'//g | uglifyjs $(OPTS_UGLIFYJS) >> $@
endef



# Main/global JS
$(OBJDIR)/min.js: $(OBJDIR)/lib/utils.js $(OBJDIR)/lib/tween.js $(OBJDIR)/main.js
	$(compress-js)


# Homepage
$(OBJDIR)/home.js: $(OBJDIR)/lib/rotator.js $(OBJDIR)/lib/range-slider.js $(OBJDIR)/page.home.js
	$(compress-js)


# Build a single JavaScript file
$(OBJDIR)/%.js: $(JSDIR)/%.js
	@mkdir -p "$(@D)"
	babel $< > $@



#==============================================================================

# Chucks everything that was built into freakin' /dev/null
clean:
	@rm -rf $(wildcard $(OBJDIR)/*) 2>/dev/null || { echo 'Nothing to clean'; }



# Enter the Watchman
# NOTE: Always call make with a named task; Watchman triggers don't seem to run
# `make all` when make is run without arguments
PWD := $(shell pwd)
watch:
	watchman watch $(PWD) > /dev/null
	watchman -- trigger $(PWD) remake-css $(CSSDIR)/'*' -- make css > /dev/null
	watchman -- trigger $(PWD) remake-js  $(JSDIR)/'*'  -- make js > /dev/null

unwatch:
	watchman watch-del $(PWD) > /dev/null
