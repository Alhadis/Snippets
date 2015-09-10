<?php
/**
 * Bullshit-free way to add a setting field in the little dropdown menu in the
 * top-right corner of an admin page.
 */


/**
 * Add a screen-specific option.
 * 
 * @param  string    $id           Screen ID ($screen->base)
 * @param  string    $name         Option name
 * @param  mixed     $default      Option's default value
 * @param  callable  $cb_control   Callback function that returns the markup for the setting form in the page's header.
 * @param  callable  $cb_save      Callback used to modify the option before it's saved to the database.
 */
function screen_option($id, $name, $default, $cb_control, $cb_save = NULL){

	add_filter('screen_settings', function($status, $screen) use ($name, $id, $cb_control){
		$output = $status;

		if($id == $screen->base)
			$output .= call_user_func_array($cb_control, array($status, $screen, $name));
		return $output;
	}, 10, 2);


	add_filter('set-screen-option', function($result, $option, $value) use ($name, $cb_save, $default){
		if($option == $name)
			$result = ($cb_save && is_callable($cb_save)) ? call_user_func($cb_save, $value, $default) : $value;
		return $result;
	}, 10, 3);
}


screen_option('tools_page_export-white-papers', 'whitepapers_per_page', 30, function($status, $screen, $option_name = '', $option_default = ''){
	$value	=	get_user_option($option_name) ?: $option_default;

	$submit	=	get_submit_button(__('Apply'), 'button', 'screen-options-apply', FALSE);
	$output	=	<<<EOF
	<div class="screen-options">
		<h5>Show on screen</h5>
		<input type="hidden" name="wp_screen_options[option]" value="$option_name" />
		<input type="number" step="1" min="1" max="999" class="screen-per-page" name="wp_screen_options[value]" id="$option_name" maxlength="3" value="$value" />
		<label for="$option_name">Entries</label>
		$submit
		<br class="Clear" />
	</div>
	<style type="text/css">
		#$option_name{
		
		}
	</style>
EOF;
	return $output;
},

function($value, $default = NULL){
	$value	=	absint($value);
	return $value ?: $default;
});
