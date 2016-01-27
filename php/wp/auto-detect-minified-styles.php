<?php

/**
 * Reroutes enqueued stylesheets to use a minified version if one exists.
 * Cute effect, but a bit useless in a real-world production environment.
 */ 
add_filter('style_loader_src', function($src, $handle = ''){

	# Source URL matches a file located in the theme's stylesheet directory.
	if(0 === stripos($src, THEME_DIR.'/src/css/')){

		# Point the URL to the neighbouring "/min/" folder.
		$replaced = str_replace(THEME_DIR.'/src/css/', THEME_DIR.'/src/min/', $src);
		if(file_exists(str_replace(trailingslashit(BLOG_URL), ABSPATH, $replaced)))
			return $replaced;
	}
	
	return $src;
});
