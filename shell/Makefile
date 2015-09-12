# Directories to read/write files to/from
CSSDIR			:=	src/css
JSDIR			:=	src/js
OBJDIR			:=	src/min


# CLI arguments for each program used to build our files
OPTS_CLEANCSS	:=	--skip-advanced
OPTS_UGLIFYJS	:=	--mangle


# List of files in each source directory
CSS			:=	$(wildcard $(CSSDIR)/*.css)
JS			:=	$(wildcard $(JSDIR)/*.js)



# Processes every JavaScript file located in JSDIR
js: $(patsubst $(JSDIR)/%.js,$(OBJDIR)/%.js,$(JS))

# Processes every CSS file in CSSDIR
css: $(patsubst $(CSSDIR)/%.css,$(OBJDIR)/%.css,$(CSS))



# Build a single CSS file
$(OBJDIR)/%.css: $(CSSDIR)/%.css
	@myth $< | \
	cleancss $(OPTS_CLEANCSS) > $@


# Build a single JavaScript file
$(OBJDIR)/%.js: $(JSDIR)/%.js
	@babel $< | \
	uglifyjs $(OPTS_UGLIFYJS) > $@



# Chucks everything that was built into freakin' /dev/null
clean:
	rm $(wildcard $(OBJDIR)/*)



# Enter the Watchman
PWD := $(shell pwd)
watch:
	@watchman watch $(PWD) > /dev/null
	@watchman -- trigger $(PWD) remake-css $(CSSDIR)/'*.css' -- make css > /dev/null
	@watchman -- trigger $(PWD) remake-js  $(JSDIR)/'*.js'   -- make js > /dev/null

unwatch:
	@watchman watch-del $(PWD) > /dev/null
	


# Print a list of destination files
list:
	@echo $(patsubst $(JSDIR)/%.js,$(OBJDIR)/%.js,$(JS))
