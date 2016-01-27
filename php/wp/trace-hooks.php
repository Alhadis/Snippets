<?php

# Add to the bottom of wp-config.php

global $HOOKTRACER;
$HOOKTRACER = array(
	'ENABLED'       => 0,
	'LIST_ARGS'     => 1,
	'LIMIT_TYPES'   => 'FA',
	'OUTPUT_FORMAT' => '| %1$s: %2$s%3$s',
	'RESET_LOG'     => 1,
	'IGNORE_TAGS'   => 'n?gettext\w* attribute_escape'
);

# Empty the contents of MAMP's error_log, if requested.
if($HOOKTRACER['ENABLED'] && $HOOKTRACER['RESET_LOG'])
	fclose(fopen('/Applications/MAMP/logs/php_error.log', 'w'));
if(is_string($HOOKTRACER['IGNORE_TAGS']))
	$HOOKTRACER['IGNORE_TAGS'] = preg_split('#\s+#', $HOOKTRACER['IGNORE_TAGS']);






# Insert at the top of apply_filters and do_action (/wp-includes/plugin.php)

	# DEVELOPMENT SHIV: Trace hooks if $GLOBALS['CATCH_HOOKS'] is enabled.
	global $HOOKTRACER;
	if($HOOKTRACER && $HOOKTRACER['ENABLED']){
		extract($HOOKTRACER, EXTR_SKIP);
		$hook_type      = preg_replace('#^\w+_([^S]+)S?$#', '$1', strtoupper(__FUNCTION__));
		$permit_types   = $LIMIT_TYPES ?: 'FA';
		$ignore_tags    = $IGNORE_TAGS ?: array();
		$preg_array     = function($patterns, $subject, $auto_delimit = TRUE){
			foreach($patterns as $regex)
				if(preg_match($auto_delimit ? ('/'.str_replace('/', '\\/', $regex).'/') : $regex, $subject)) return TRUE;
			return FALSE;
		};

		if((!$ignore_tags || !call_user_func($preg_array, $ignore_tags, $tag)) && stripos($permit_types, substr($hook_type, 0, 1)) !== FALSE){
			error_log(sprintf($OUTPUT_FORMAT ?: '%1$s[ %2$s ]:%3$s', $hook_type, $tag,
				!$LIST_ARGS ? '' : preg_replace('#^\s*Array\s*#i', ' ', str_replace('    ', "\t", print_r(array_slice(func_get_args(), 1), TRUE)))
			), E_NOTICE);
		}
	}
