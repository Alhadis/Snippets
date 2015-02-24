<?php

/**
 * Generates an HTML <time /> element for the designated datestamp.
 * 
 * @param string $format	Date format to display to the reader. Same syntax used by PHP's own "date" function.
 * @param int|string $time	Time to format. Accepts either a UNIX timestamp or a string accepted by strtotime.
 * @return string An HTML representation of the formatted time. 
 */
function html_time($format, $time = NULL){
	$time	=	is_string($time) ? strtotime($time) : ($time ?: time());

	return sprintf('<time datetime="%1$s">%2$s</time>', date('c', $time), date($format, $time));
}



/**
 * Generates an HTML tag with the supplied parameters.
 * 
 * @param string $name - Tag name.
 * @param array $attr - Array of HTML attributes to insert.
 * @param string $content - Content to include between element's open/close tags. Ignored if $name is a self-closing element.
 * @param bool $close - If TRUE (default), the element's closing tag is appended to the returned value.
 * 
 * @return string The compiled markup.
 */
function build_tag($name, $attr = NULL, $content = NULL, $close = TRUE){

	#	Still XHTML-compliant.
	$name	=	strtolower(trim($name));


	#	Start building our HTML tag.
	$output	=	'<' . $name;

	#	Compile HTML attributes
	if($attr) foreach($attr as $key => $value)
		$output	.=	' '.$key.'="'.htmlentities(html_entity_decode($value)).'"';

	#	Ladies and gentlemen, this is a self-closing tag.
	if(in_array($name, explode(' ', 'area base basefont br col command frame hr img input keygen link menuitem meta param source track wbr')))
		return $output.' />';


	#	Close tag, injecting any specified content if need be.
	else return $output . '>'.($content ?: '').($close ? '</'.$name.'>' : '');
}



/**
 * Replaces any variable declarations found in a string with the accompanying values found in the supplied key/value pair.
 * This provides a safer and more controlled alternative to PHP's native eval function.
 * 
 * @example template('<input type="$type" id="$id" />', array(
 * 	'type'	=>	'text',
 *	'id'	=>	'first-name
 * )); 
 */
function tokenise($template, $tokens){
	$output	=	$template;

	/**
	 * Sort our tokens so that those with longer names are listed first.
	 * NOTE: The following approach proved to be ~73.30317103884319% faster than using uksort when benchtested. 
	 */
	$sorted	=	array_flip(array_keys($tokens));
	foreach($sorted as $key => $value)	$sorted[$key]	=	strlen($key);
	arsort($sorted);
	foreach($sorted as $key => $value)	$sorted[$key]	=	$tokens[$key];
	$tokens	=&	$sorted;

	foreach($tokens as $key => $value)
		$output	=	str_replace('$'.$key, $value, $output);

	return $output;
}



/**
 * Returns a randomly-generated alphanumeric ID for a DOM element guaranteed to be unique.
 * 
 * @param string $prefix String to prepend to the generated ID. Defaults to 'id_'.
 * @return string
 */
function unique_id($prefix = 'id_'){
	static $ids	=	array();

	$id	=	NULL;
	while($id === NULL || $ids[$id])
		$id	=	uniqid($prefix);

	$ids[$id]	=	TRUE;
	return $id;
}



/**
 *	Checks if user-supplied input logically equates to TRUE or FALSE.
 * 
 *	If passed a string value, the function compares it against a list of synonyms for "false". If matched, returns FALSE;
 *	otherwise, a value of TRUE is assumed. Additional strings for FALSE values may be passed in using the $extra_strings parameter.
 * 
 *	@param $input The variable being checked
 *	@param $extra_strings An array of additional strings that should equate to true if the value is a string.
 *	@return bool
 */
function coerce_bool($input, $extra_strings = array()){
	if(!$input)				return false;
	if(is_numeric($input))	return !!floatval($input);
	if(is_string($input))	return !in_array(strtolower($input), array_merge(array('false', 'no', 'off', 'disabled', 'disable', 'never', 'nah'), $extra_strings));
	return !!$input;
}



/**
 *	Removes indices from an array by key.
 *	@link http://www.php.net/manual/en/function.unset.php#89881
 */
function array_remove_key(){
	$args  = func_get_args();
	return array_diff_key($args[0], array_flip(array_slice($args, 1)));
}


/**
 *	Removes indices from an array based on their values.
 *
 *	@author macnimble <macnimble@gmail.com>
 *	@link http://www.php.net/manual/en/function.unset.php#89881
 */
function array_remove_value(){
	$args	=	func_get_args();
	return array_diff($args[0], array_slice($args, 1));
}


/**
 * Recursively scan a directory. Behaviour otherwise identical to PHP's scandir function.
 * 
 * @param string $path - Directory to scan the contents of.
 * @return array
 */
function rscandir($path){
	$output	=	array();
	foreach(scandir($path) as $file){

		#	Skip the current/parent directory pointers.
		if($file === '.' || $file === '..') continue;

		$filepath = $path . '/' . $file;
		if(is_dir($filepath))
			$output		=	array_merge($output, rscandir($filepath));
		else $output[]	=	$filepath;
	}
	return $output;
}


/**	Returns TRUE if a file appears to be of a valid image MIME type. */
function is_image($file, $webonly = true){
	$t	=	exif_imagetype($file);
	return $webonly ? ($t == IMAGETYPE_GIF || $t == IMAGETYPE_JPEG || $t == IMAGETYPE_PNG || $t == IMAGETYPE_BMP) : ($t !== FALSE);
}


/**	Converts a local file path to an absolute URL. */
function path_to_url($input, $scheme = "http://"){
	return str_replace($_SERVER["DOCUMENT_ROOT"], $scheme . $_SERVER["HTTP_HOST"], $input);
}


/** Converts an absolute URL to a local filepath, assuming it points to a resource located on the server. */
function url_to_path($url){
	return str_replace($_SERVER['HTTP_HOST'], $_SERVER['DOCUMENT_ROOT'], preg_replace('#(^https?://)?#i', '', $url));
}



/**
 *	Outputs a boolean HTML attribute if $a tests equal to $b.
 *
 *	@param string $type Attribute name (e.g., "selected", "checked", "disabled", etc)
 *	@param any $a Value to compare
 *	@param any $b Value to compare $a with. Defaults to TRUE.
 *	@param bool $display Whether to echo the result or return it as a string.
 *	@param string $quot Quotation mark type to use for wrapping the attribute's value.
 *	@param bool $xhtml If FALSE, result will use the deprecated HTML format (e.g., <input selected> instead of <input selected="selected"/>.
 *	@return string HTML attribute or empty string if $a and $b didn't match.
 */
function boolean_html_attr($name, $a = NULL, $b = true, $display = true, $quot = '"', $xhtml = true){
	$on		=	((string) $a == (string) $b);
	$str	=	$on ? sprintf(' %1$s' . ($xhtml ? '=%2$s%1$s%2$s' : ''), $name, $quot) : '';
	if($display)
		echo $str;
		else return $str;
}
	function checked($a, $b, $display = true)	{	return boolean_html_attr("checked", $a, $b, $display);	}
	function selected($a, $b, $display = true)	{	return boolean_html_attr("selected", $a, $b, $display);	}



/**
 * Detects a mobile device by sniffing the user agent string.
 * 
 * @param string $ua - Overrides the HTTP_USER_AGENT header if set.
 * @link http://detectmobilebrowsers.com/
 * @version 2014-08-01
 * @return bool
 */
function is_mobile($ua = NULL){
	$ua		=	$ua ?: $_SERVER['HTTP_USER_AGENT'];
	return preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i',$ua)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($ua,0,4));
}


/**
 * Formats a number of seconds into a human readable format (e.g., "3 weeks ago")
 *
 * @param int $secs Seconds to format
 * @param bool $maxyear Whether units of measurement beyond years (decades, centuries, millenia) should be used
 * @return string Number of seconds formatted as a human-readable interpretation (e.g., "3 weeks ago")
 */
function time_since($secs, $maxyear = FALSE){
	/* Seconds */		if($secs < 60)								return sprintf(($secs < 2 ? 'Just now' : '%s seconds ago'), $secs);
	/* Minutes */		if(($time = $secs / 60) < 60)				return sprintf(($time < 2 ? '%s minute ago' : '%s minutes ago'), floor($time));
	/* Hours */			if(($time = $time / 60) < 24)				return sprintf(($time < 2 ? 'An hour ago' : '%s hours ago'), floor($time));
	/* Days */			if(($time = $time / 24) < 7)				return sprintf(($time < 2 ? 'Yesterday' : '%s days ago'), floor($time));
	/* Weeks */			if(($time = $time / 7) < 4.345238)			return sprintf(($time < 2 ? 'Last week' : '%s weeks ago'), floor($time));
	/* Months */		if(($time = $time / 4.345238) < 12)			return sprintf(($time < 2 ? 'Last month' : '%s months ago'), floor($time));
	/* Years */			if(($time = $time / 12) < 10 || $maxyear)	return sprintf(($time < 2 ? 'Last year' : '%s years ago'), floor($time));
	/* Decades */		if(($time = $time / 10) < 10)				return sprintf(($time < 2 ? 'A decade ago' : '%s decades ago'), floor($time));
	/* Centuries */		if(($time = $time / 10) < 10)				return sprintf(($time < 2 ? 'A century ago' : '%s centuries ago'), floor($time));
	/* Millennia */		$time	=	$time / 10;						return sprintf(($time < 2 ? 'A millenium ago' : '%s millennia ago'), floor($time));
}


/**
 * Ascertains if a string matches a recognised "Boolean-ish" value.
 *
 * Recognised values include "TRUE, FALSE, YES, NO, ON, OFF", and so forth. 
 *
 * @param mixed $value - A string to match against a list of recognised boolean value names.
 * @param string $more - An optional list of extra boolean strings to check. Useful for i18n.
 * @return bool
 */
function is_boolean($value, $more = ''){

	#	Bail if provided an empty value.
	if(!$value)	return FALSE;

	#	Check for numerical values.
	if(is_numeric($value)) return intval(abs($value));

	$tokens =	'TRUE FALSE YES NO ON OFF ENABLED DISABLED ENABLE DISABLE' . ($more ? ' '.$more : '');
	return in_array(strtoupper($value), explode(' ', $tokens));
}


/**
 * Returns CSS-style shorthand for a collapsable hex sequence ("BBFFDD" => "BFD").
 *
 * @param string $input - The hex string to operate on.
 * @return string - A shortened string, or the unmodified input if it couldn't be shortened.
 */
function shorten_hex($input){
	$pattern	=	'#^(?:([0-9A-Fa-f])\1)+$#';
	if(!preg_match($pattern, $input)) return $input;
	return preg_replace('#([0-9A-Fa-f])\1#', '$1', $input);
}


/**
 * Returns a compiled hexadecimal representation of one or more integers.
 *
 * @param array $input - An array of integers, expressed as values between 0-255
 * @param bool $shorten - If set, will use CSS-style shorthand where possible.
 * @param int $limit - Limits how many values from the array are stitched together.
 * @return string
 */
function hex_string($input, $shorten = TRUE, $limit = NULL){
	$output	=	'';
	$count	=	count($input);
	
	#	Check for a limit, if specified.
	if($limit) $count	=	min(abs($limit), $count);

	for($i = 0; $i < $count; ++$i)
		$output	.=	sprintf('%02s', dechex($input[$i]));
	return $shorten ? shorten_hex($output) : $output;
}



/**
 *	Formats a number of bytes for human-readable format (KB, MB, GB).
 *
 *	@author mkeefe <http://www.scriptplayground.com/>
 *	@link http://www.phpfront.com/php/Convert-Bytes-to-corresponding-size/
 */
function convert_from_bytes($bytes){
	$size	=	$bytes / 1024;
	if($size < 1024)						$size	=	number_format($size, 2) . ' KB';
	else if($size / 1024 < 1024)			$size	=	number_format($size / 1024, 2) . ' MB';
	else if($size / 1024 / 1024 < 1024)		$size	=	number_format($size / 1024 / 1024, 2) . ' GB';
	return $size;
}



/**
 *	Converts a string representing a properly formatted filesize (e.g., "25.25 MB") into its according number of bytes.
 *
 *	@author Paul Maunders <http://www.pyrosoft.co.uk/blog>
 *	@link http://www.pyrosoft.co.uk/blog/2006/12/13/php-function-to-convert-from-kilobytes-to-bytes/
 */
function convert_to_bytes($string){
	if(preg_match('/([0-9\.]+) ?([a-z]*)/i', $string, $matches)){
		$number		=	$matches[1];
		$suffix		=	$matches[2];
		
		$suffixes	=	array('' => 0, 'Bytes' => 0, 'KB' => 1, 'MB' => 2, 'GB' => 3, 'TB' => 4, 'PB' => 5);
		if(isset($suffixes[$suffix]))
			return round($number * pow(1024, $suffixes[$suffix]));
	}
	return false;
}



/**
 * Calculates the physical distance between two latitude/longitude coordinates.
 * 
 * Each coordinate should be supplied as an array of two floats representing latitude and longitude, respectively.   
 *
 * @param array $from
 * @param array $to
 * @return float
 */
function geographic_distance($from, $to){
	$pi		=	pi();
	$lat1	=	$from[0]	* $pi / 180;
	$lat2	=	$to[0]		* $pi / 180;
	return acos(sin($lat1) * sin($lat2) + cos($lat1) * cos($lat2) * cos(($to[1] - $from[1]) * $pi / 180)) * 6371000;
}



/**
 * Truncates a string to a specified number of words.
 *
 * @param string $input String to operate on.
 * @param int $length Desired word count. Must be positive.
 * @param string $more String appended to indicate cutoff to the reader (such as "..."). Blank by default.
 *
 * @return string Input wrapped to $length number of words.
 */
function word_limit($input, $length, $more = ''){
	$words				=	preg_split('/[\n\r\t ]+/', $input, $length+1, PREG_SPLIT_NO_EMPTY);
	if(count($words) > $length){
		array_pop($words);
		$text	=	implode(' ', $words) . $more;
	}
	else $text	=	implode(' ', $words);
	return $text;
}



/**
 * Truncates a string to a specified number of characters.
 * 
 * @param string $input String to operate on.
 * @param int $length Desired character limit. Must be positive.
 * @param string $more String appended to indicate cutoff to the reader (such as "..."). Defaults to an ellipsis.
 * 
 * @return string Input capped to $length number of characters.
 */
function char_limit($str, $limit, $cutoff = '...'){
	return (mb_strlen($str) >= $limit) ? mb_substr($str, 0, $limit) . $cutoff : $str;
}



/**
 * Unicode-compatible version of PHP's chr function.
 * 
 * @param int $ascii The Unicode codepoint of the character to generate.
 * @return string
 */
function mb_chr($ascii){
	return mb_convert_encoding('&#' . intval($ascii) . ';', 'UTF-8', 'HTML-ENTITIES');
}



/**
 * Returns an array of all a class's subclasses, if any.
 * 
 * @param class $value Class reference to retrieve subclasses of.
 * @param bool $slow Search the entire array of declared classes instead of skipping to the index $value is defined at.
 */
function get_subclasses($value, $slow = false){
	$out		=	array();
	$classes	=	get_declared_classes();
	for($i = ($slow ? 0 : array_search($value, $classes)); $i < count($classes); ++$i)
		if(is_subclass_of($classes[$i], $value))
			$out[]	=	$classes[$i];
	return $out;
}



/**
 * Recursively iterates through an array and replaces any scalar values equating to
 * FALSE with a PHP-compatible string representation of their literal value.
 * 
 * Used by the trace/dump caveman debugging functions below. Not expected to be used anywhere else.
 * 
 * @param array $array - Top-level array to iterate over
 * @return $array - Array with modified descendants
 * @access private 
 */
function array_disambiguate_empty_values($array){
	if(!is_array($array) || $GLOBALS === $array) return $array;
	foreach($array as $key => $value)
		if(is_array($value))						$array[$key]	=	call_user_func('array_disambiguate_empty_values', $value);
		else if(is_bool($value) || $value === NULL)	$array[$key]	=	var_export($value, TRUE);
	return $array;
}


/**
 * Caveman debugging function well-suited for irritable web developers.
 * Takes a variable number of arguments and spits their string representations into error_log.
 */
function trace(){
	$spaces	=	str_repeat(' ', 4);
	foreach(func_get_args() as $a)
		error_log(str_replace($spaces, "\t", print_r(((is_bool($a) || $a === NULL) ? var_export($a, TRUE) : call_user_func('array_disambiguate_empty_values', $a)), true)));
}


/**
 * An even uglier variant of the trace() function. Doesn't even bother spitting the traced values
 * into an error_log, instead opting to shove them onto the page and cancel script execution. 
 */
function dump(){
	$spaces	=	str_repeat(' ', 4);
	$output	=	'';
	foreach(func_get_args() as $a)
		$output .= preg_replace('#(</?)pre>#i', '$1 pre >', str_replace($spaces, "\t", print_r(call_user_func('array_disambiguate_empty_values', $a), TRUE)));
	!headers_sent() ? header('Content-Type: text/plain; charset=UTF-8') : ($output = '<pre>' . $output . '</pre>');
	echo $output;
	exit;
}


/**
 * Spits the JSON-encoded form of a variable to the output buffer and stops script execution.
 * 
 * @param mixed $input Whatever needs to be returned to the client in JSON format. 
 */
function json($input){
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($input ?: array());
	exit;
}