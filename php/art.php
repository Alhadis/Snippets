<?php

define('CHANNEL_RED',	1);
define('CHANNEL_GREEN',	2);
define('CHANNEL_BLUE',	4);
define('CHANNEL_ALPHA',	8);
define('CHANNEL_ALL',	15);



/**
 * Applies a colour transform to an image resource, analogous to SVG's feColorMatrix effect.
 * Transformation logic courtesy of http://www.svgbasics.com/filters4.html
 *
 * @param resource $img - An image resource returned by an image creation function.
 * @param array $m - An array of 20 floats representing a 5x4 transformation matrix.
 * @return resource A copy of the original image with modified colours.
 */
function apply_colour_matrix($img, $m){
	$width	=	imagesx($img);
	$height	=	imagesy($img);
	$new	=	imagecreatetruecolor($width, $height);

	for($x = 0; $x < $width; ++$x){

		for($y = 0; $y < $height; ++$y){
			$colour	=	imagecolorsforindex($img, imagecolorat($img, $x, $y));

			$red	=	$colour['red'];
			$green	=	$colour['green'];
			$blue	=	$colour['blue'];
			$alpha	=	$colour['alpha'];

			imagesetpixel($new, $x, $y, imagecolorallocatealpha($new, 
						 $red * $m[0]	+	$green * $m[1]	+	$blue * $m[2]	+	$alpha * $m[3]	+	$m[4]	* 1,
						 $red * $m[5]	+	$green * $m[6]	+	$blue * $m[7]	+	$alpha * $m[8]	+	$m[9]	* 1,
						 $red * $m[10]	+	$green * $m[11]	+	$blue * $m[12]	+	$alpha * $m[13]	+	$m[14]	* 1,
				((255 - ($red * $m[15]	+	$green * $m[16]	+	$blue * $m[17]	+	$alpha * $m[18]	+	$m[19]	* 1)) / 255) * 127
			));
		}
	}

	return $new;
}



/**
 * Generates a darkened and greyscaled version of an image.
 * 
 * @param string $filename - Path to the image file
 * @param string $save_to - Path to save the modified file to. If NULL, image data will be sent to the browser.
 * @return bool TRUE if the operation was successful.
 */
function burnt_image($filename, $save_to = NULL){
	$img		=	@imagecreatefromjpeg($filename) or error_log('ERROR: Could not open file "'.$filename.'"', E_WARNING);
	
	#	Bail if we couldn't locate the image.
	if(!$img)	return FALSE;

	$greyscale	=	apply_colour_matrix($img, array(
		.33,	.33,	.33,	0,	0,
		.33,	.33,	.33,	0,	0,
		.33,	.33,	.33,	0,	0,
		.33,	.33,	.33,	0,	0
	));


	/*	Display the image and free the data */
	imageauto($greyscale, exif_imagetype($filename), $save_to, 80);
	imagedestroy($img);
	imagedestroy($greyscale);
	return TRUE;
}




/**
 * Wrapper for the GD library's various image creation functions.
 * Allows different formats to be generated based on the IMAGETYPE constant provided.
 * 
 * @param resource $img - Target image resource 
 * @param int $type - An IMAGETYPE constant specifying what format to generate
 * @param string $filename - Path to save the file to. If NULL, the image's data is output directly to the browser.
 * @param int $quality - JPEG compression quality. Relevant only if $type is IMAGETYPE_JPEG
 * @param int $foreground - Foreground colour IDs; only used for WBMP and XBM formats.
 * @return bool TRUE if the type was recognised and the image was successfully generated.
 */
function imageauto($img, $type = IMAGETYPE_PNG, $filename = NULL, $quality = 75, $foreground = NULL){

	switch($type){
		case IMAGETYPE_GIF:	{header('Content-Type: image/gif');				return imagegif($img, $filename);				break;}
		case IMAGETYPE_JPEG:{header('Content-Type: image/jpeg');			return imagejpeg($img, $filename, $quality);	break;}
		case IMAGETYPE_PNG:	{header('Content-Type: image/png');				return imagepng($img, $filename);				break;}
		case IMAGETYPE_WBMP:{header('Content-Type: image/vnd.wap.wbmp');	return imagewbmp($img, $filename, $foreground);	break;}
		case IMAGETYPE_XBM:	{header('Content-Type: image/xbm');				return imagexbm($img, $filename, $foreground);	break;}
	}

	return FALSE;
}




/**
 * Wrapper for PHP's various "imagecreatefrom-" functions that returns an identifier for the image based on its detected type.
 * 
 * @param string $file - Path to the image file
 * @return resource|bool An image resource, or FALSE on failure
 */
function imagecreatefromauto($file){
	
	#	Image matches a recognised IMAGETYPE_ constant.
	switch($type = exif_imagetype($file)){
		case IMAGETYPE_GIF:		{return imagecreatefromgif($file);	break;}
		case IMAGETYPE_JPEG:	{return imagecreatefromjpeg($file);	break;}
		case IMAGETYPE_PNG:		{return imagecreatefrompng($file);	break;}
		case IMAGETYPE_BMP:		{return imagecreatefrompng($file);	break;}
		case IMAGETYPE_WBMP:	{return imagecreatefromwbmp($file);	break;}
		case IMAGETYPE_XBM:		{return imagecreatefromxbm($file);	break;}
	}


	#	Some formats can be read by PHP, but aren't detectable with exif_imagetype. We'll simply sniff the filename instead.
	switch($extension = end(explode('.', strtolower($file)))){
		case 'gd':	{return imagecreatefromgd($file);	break;}
		case 'gd2':	{return imagecreatefromgd2($file);	break;}
		case 'webp':{if(function_exists('imagecreatefromwebp'))	return imagecreatefromwebp($file);	break;	}
		case 'xpm':	{if(imagetypes() & IMG_XBM)					return imagecreatefromxpm($file);	break;	}
	}

	return FALSE;
}



/**
 * Composites the colour channels of one image onto another.
 * 
 * @param resource $img_a - Destination image
 * @param resource $img_b - Source image to transfer channel data from
 * @param int $channels - A bitmask of CHANNEL_ values determining which channels to transfer
 * @return resource A new image identifier
 */
function composite_channels($img_a, $img_b, $channels = CHANNEL_ALL){
	$width		=	min(imagesx($img_a), imagesx($img_b));
	$height		=	min(imagesy($img_a), imagesy($img_b));
	$channels	=	CHANNEL_ALL ^ $channels;


	$output		=	imagecreatetruecolor($width, $height);
	imagealphablending($output, FALSE);
	imagesavealpha($output, TRUE);
	imagefill($output, 0, 0, imagecolorallocatealpha($output, 0, 0, 0, 127));



	for($x = 0; $x < $width; ++$x){

		for($y = 0; $y < $height; ++$y){
			$old_colour			=	imagecolorsforindex($img_b,	imagecolorat($img_b, $x, $y));
			$new_colour			=	imagecolorsforindex($img_a,	imagecolorat($img_a, $x, $y));

			$red	=	(CHANNEL_RED	& $channels)	? $new_colour['red']	:	$old_colour['red']		;
			$green	=	(CHANNEL_GREEN	& $channels)	? $new_colour['green']	:	$old_colour['green']	;
			$blue	=	(CHANNEL_BLUE	& $channels)	? $new_colour['blue']	:	$old_colour['blue']		;
			$alpha	=	(CHANNEL_ALPHA	& $channels)	? $new_colour['alpha']	:	$old_colour['alpha']	;

			imagesetpixel($output, $x, $y, imagecolorallocatealpha($output, $red, $green, $blue, $alpha));
		}
	}
	return $output;
}


/**
 * Swap the data of one of an image's colour channels with another.
 * 
 * Colour channels may be one of the following values: red, green, blue, alpha.
 * 
 * @param resource $img - Source image
 * @param string $c1 - First colour channel
 * @param string $c2 - Second colour channel
 * @return resource A new image identifier with the modified channels of the source image.  
 */
function swap_channels($img, $c1, $c2){
	$width		=	imagesx($img);
	$height		=	imagesy($img);
	$c1			=	strtolower($c1);
	$c2			=	strtolower($c2);

	$result	=	imagecreatetruecolor($width, $height);
	imagesavealpha($result, TRUE);
	imagealphablending($result, FALSE);

	$not_alpha	=	($c1 !== 'alpha' && $c2 !== 'alpha');

	for($x = 0; $x < $width; ++$x){
		for($y = 0; $y < $height; ++$y){
			$colour			=	imagecolorsforindex($img, imagecolorat($img, $x, $y));

			if(!$not_alpha)
				$colour['alpha'] =	round(255 - (255 * ($colour['alpha'] / 127)));

			$swap			=	$colour[$c1];
			$colour[$c1]	=	$colour[$c2];
			$colour[$c2]	=	$swap;

			if(!$not_alpha)
				$alpha	=	127 - ((abs($alpha) / 100) * 127);


			$red	=	$colour['red'];
			$green	=	$colour['green'];
			$blue	=	$colour['blue'];
			$alpha	=	$colour['alpha'];

			imagesetpixel($result, $x, $y, imagecolorallocatealpha($result, $red, $green, $blue, $alpha));
		}
	}

	return $result;
}



/**
 * Extracts the data from an image's colour channel as a greyscale image.
 * 
 * @param resource $img - Source image
 * @param string $channel - Channel to extract. Possible values are: red, green, blue, alpha
 * @param bool $normalise_alpha
 * @return resource A greyscale image holding the source image's channel data 
 */
function extract_channel($img, $channel, $normalise_alpha = TRUE){
	$width	=	imagesx($img);
	$height	=	imagesy($img);
	
	$result	=	imagecreatetruecolor($width, $height);
	imagesavealpha($result, TRUE);
	imagealphablending($result, FALSE);
	
	$is_alpha	=	'alpha' === $channel;

	for($x = 0; $x < $width; ++$x){
		for($y = 0; $y < $height; ++$y){
			$colour	=	imagecolorsforindex($img, imagecolorat($img, $x, $y));
			$c		=	($is_alpha && $normalise_alpha) ? round(255 - (255 * ($colour[$channel] / 127))) : $colour[$channel];
			imagesetpixel($result, $x, $y, imagecolorallocatealpha($result, $c, $c, $c, 0));
		}
	}

	return $result;
}



/**
 * Generates an antialiased circle.
 * 
 * @param int $width - Width of the generated circle
 * @param int $height - Height of the generated circle
 * @param array $colour - Fill colour expressed as an array of integers.
 * @param float $alpha - The opacity of the fill colour, expressed between 0-127 (opaque to transparent, respectively)
 * @param float $pad - The spacing between the circle's edges and the edges of the image
 * @param bool $invert - If TRUE, image will be drawn as a circular cutout instead, with corners filled by $colour
 * @return $resource Image resource identifier for the generated circle.
 */
function circle($width, $height, $colour, $alpha = 0, $pad = 2, $invert = FALSE, $background = NULL){

	/** If given a NULL $pad value, fallback to default value. */
	$pad	=	$pad == NULL ? 2 : $pad;



	/** Multiply the resolution of the image we're drawing the ellipse at. */
	$w_l	=	$width	* 5;
	$h_l	=	$height	* 5;


	/**
	 * Create two image resources: the second will be used to draw the circle at a larger resolution. PHP's imagefilledellipse function
	 * doesn't antialias drawn edges, so we'll have to acheive a similar effect ourselves using resampling.
	 */
	$result	=	imagecreatetruecolor($width, $height);
	$crisp	=	imagecreatetruecolor($w_l, $h_l);


	imagealphablending($result, FALSE);	imagesavealpha($result, TRUE);	imageantialias($result, TRUE);
	imagealphablending($crisp, FALSE);	imagesavealpha($crisp, TRUE);	imageantialias($crisp, TRUE);


	$bg		=	$background ?
		imagecolorallocatealpha($crisp, $background[0], $background[1], $background[2], intval($background[3])) :
		imagecolorallocatealpha($crisp, 0, 0, 0, 127);

	$fill	=	imagecolorallocatealpha($crisp, $colour[0], $colour[1], $colour[2], round($alpha));


	imagefill($crisp, 0, 0, $invert ? $fill : $bg);
	imagefilledellipse($crisp, round($w_l / 2), round($h_l / 2), $w_l - $pad * 4, $h_l - $pad * 4, $invert ? $bg : $fill);
	imagecopyresampled($result, $crisp, 0, 0, 0, 0, $width, $height, $w_l, $h_l);

	imagedestroy($crisp);
	return $result;
}



/**
 * Creates a "cutout" version of an image using another image's luminosity or alpha channel.
 * 
 * The second image (the mask) will provide transparency using the luminosity of each pixel.
 * However, if $usealpha is set to TRUE, then the mask is assumed to be an image with an alpha
 * channel, and its own transparency will be transferred to the source image instead.
 * 
 * @param resource $image - Source image to contour
 * @param resource $mask - An image of the desired silhouette's shape
 * @param bool $usealpha - Use the mask's alpha channel instead of luminosity to determine opacity
 * @return resource A cutout of the original image in the shape of the supplied mask 
 */
function cutout($image, $mask, $usealpha = FALSE){
	$width		=	min(imagesx($image), imagesx($mask));
	$height		=	min(imagesy($image), imagesy($mask));
	
	$result		=	imagecreatetruecolor($width, $height);
	imageantialias($result, TRUE);
	imagesavealpha($result, TRUE);
	imagealphablending($result, FALSE);

	for($x = 0; $x < $width; ++$x){
		for($y = 0; $y < $height; ++$y){
			$colour	=	imagecolorsforindex($image,		imagecolorat($image, $x, $y));
			$alpha	=	imagecolorsforindex($mask,		imagecolorat($mask, $x, $y));

			$red	=	$colour['red'];
			$green	=	$colour['green'];
			$blue	=	$colour['blue'];
			$alpha	=	$colour['alpha'];

			$m_alpha	=	$usealpha ? $alpha['alpha'] : (127 - ((abs($alpha['red']) / 255) * 127));
			imagesetpixel($result, $x, $y, imagecolorallocatealpha($result, $red, $green, $blue, max($m_alpha, $alpha)));
		}
	}

	return $result;
}



/**
 * Generates an antialiased torus (donut-shape) filled with a designated colour.
 * 
 * @param int $width - Width of the ring's outer circumference
 * @param int $height - Height of the ring's outer circumference
 * @param int $thickness - Thickness of the ring's border (distance between inner and outer circumferences)
 * @param int $colour - Ring's fill colour, supplied as an indexed array of integers
 * @param float $alpha - Opacity of the fill colour, expressed between 0-127 (opaque to transparent, respectively)
 * @param int $quality - Quality level of the resulting image. Higher values involve more processing
 * @return resource A newly-generated image resource
 */
function ring($width, $height, $thickness, $colour, $alpha = 0, $quality = 5){
	$w_l	=	$width		* $quality;
	$h_l	=	$height		* $quality;
	$t_l	=	$thickness	* $quality;


	$crisp	=	imagecreatetruecolor($w_l, $h_l);
	imagesavealpha($crisp, TRUE);
	imagealphablending($crisp, FALSE);
	imagesetthickness($crisp, 1);

	$clear	=	imagecolorallocatealpha($crisp, 0, 0, 0, 127);
	imagefill($crisp, 0, 0, $clear);


	$colour	=	imagecolorallocatealpha($crisp, $colour[0], $colour[1], $colour[2], $alpha);

	$x		=	$w_l / 2;
	$y		=	$h_l / 2;
	$rad_x	=	($w_l - $t_l) / 2;
	$rad_y	=	($h_l - $t_l) / 2;
	

	for($i = 0; $i < 360 * 2; ++$i)
		imagefilledarc($crisp, $x+cos($i)*$rad_x, $y+sin($i)*$rad_y, $t_l, $t_l, 0, 360, $colour, IMG_ARC_PIE);


	$result	=	imagecreatetruecolor($width, $height);
	imagesavealpha($result, TRUE);
	imagealphablending($result, FALSE);
	imagefill($result, 0, 0, imagecolorallocatealpha($result, 0, 0, 0, 127));

	imagecopyresampled($result, $crisp, 0, 0, 0, 0, $width, $height, $w_l, $h_l);
	imagedestroy($crisp);
	return $result;
}



/**
 * Returns the bounding box needed to crop superfluous pixels from an image.
 * 
 * @param resource $image - An image identifier to measure.
 * @param int $based_on - The image corner holding the colour to crop away (0-3, clockwise from top-left. Default: 0/top-left)
 * @param int $thresh - Pixel threshold. Higher values mean more aggressive cropping.
 * @return array An array with four named properties representing each edge of the trim area: left, top, bottom, right.   
 */
function getimagetrim($image, $based_on = 0, $thresh = 0){
	$width	=	imagesx($image);
	$height	=	imagesy($image);

	switch($based_on){
		default:	$trim	=	imagecolorat($image, 0, 0);					break;	#	Top-left (Default)
		case 1:		$trim	=	imagecolorat($image, $width, 0);			break;	#	Top-right
		case 2:		$trim	=	imagecolorat($image, $width, $height);		break;	#	Bottom-right
		case 3:		$trim	=	imagecolorat($image, 0, $height);			break;	#	Bottom-left
	}


	# Averaged colour components of colour to trim away (used if $thresh is specified)
	$trim_colour	=	imagecolorsforindex($image, $trim);


	/** Function for comparing the similarity of two colours. */
	$compare	=	function($thresh, $a, $b){
		foreach($a as $key => $value)
			if(abs($value - $b[$key]) >= $thresh) return FALSE;
		return TRUE;
	};


	# Rectangular region to cut away
	$crop	=	array(
		'top'		=>	0,
		'right'		=>	$width,
		'bottom'	=>	$height,
		'left'		=>	0
	);


	# Top
	for($y = 0; $y < $height; ++$y){

		# Scan each pixel in this row.
		for($x = 0; $x < $width; ++$x){
			$pixel	=	imagecolorat($image, $x, $y);
			if($trim != $pixel){

				if($thresh && $compare($thresh, $trim_colour, imagecolorsforindex($image, $pixel)))
					continue;

				$crop['top']	=	$y;
				break 2;
			}
		}
	}
	

	# Right
	for($x = $width-1; $x >= 0; --$x){

		# Scan each column.
		for($y = 0; $y < $height; ++$y){
			$pixel	=	imagecolorat($image, $x, $y);
			if($trim != $pixel){

				if($thresh && $compare($thresh, $trim_colour, imagecolorsforindex($image, $pixel)))
					continue;
			
				$crop['right']	=	$x+1;
				break 2;
			}
		}
	}


	# Bottom
	for($y = $height-1; $y >= 0; --$y){

		# Scan each pixel in this row.
		for($x = 0; $x < $width; ++$x){
			$pixel	=	imagecolorat($image, $x, $y);
			if($trim != $pixel){
			
				if($thresh && $compare($thresh, $trim_colour, imagecolorsforindex($image, $pixel)))
					continue;
			
				$crop['bottom']	=	$y+1;
				break 2;
			}
		}
	}


	# Left
	for($x = 0; $x < $width; ++$x){

		# Scan each column.
		for($y = 0; $y < $height; ++$y){
			$pixel	=	imagecolorat($image, $x, $y);
			if($trim != $pixel){
			
				if($thresh && $compare($thresh, $trim_colour, imagecolorsforindex($image, $pixel)))
					continue;
			
				$crop['left']	=	$x;
				break 2;
			}
		}
	}

	return $crop;
}


/**
 * Crops unwanted pixels from an image. Behaviour analoguous to Photoshop's trim command.
 * 
 * @param resource $image - Image to crop
 * @param int $based_on - Image corner (0-3, clockwise from top-left) with the pixel colour to trim away.
 * @param int $threshold - Pixel threshold. Lower values mean stricter cropping.
 * @return resource A cropped copy of the original image.  
 */
function imagetrim($image, $based_on = 0, $threshold = 0){
	extract(getimagetrim($image, $based_on, $threshold));
	$width		=	$right - $left;
	$height		=	$bottom - $top;

	$trimmed	=	imagecreatetruecolor($width, $height);
	return imagecopy($trimmed, $image, 0, 0, $left, $top, $width, $height) ? $trimmed : $image;
}



/**
 * Converts physical millimetres to pixels.
 * 
 * @param float $mm - Number of millimetres to convert.
 * @param float $dpi - Image resolution to perform the calculation by.
 * @return int
 */
function mm2px($mm, $dpi = 300){
	return round(($mm * 0.03937) * $dpi);
}


/**
 * Converts pixels to millimetres.
 * 
 * @param float $px - Length in pixels to convert.
 * @param float $dpi - Image resolution to perform the calculation by.
 * @return int
 */
function px2mm($px, $dpi = 300){
	return (round($px) / $dpi) * 25.4;
}


/**
 * Converts an opacity value between 0-255 (transparent to opaque) to 0-127 (opaque to transparent).
 * @param string|int $alpha - A hexadecimal string ("7A") or an integer (0-255).
 * @return int
 */
function alpha_hex2php($alpha){
	return 127 - round(((is_string($alpha) ? hexdec($alpha) : $alpha) / 255) * 127);
}

/** Converts an opacity value between 0-127 (opaque to transparent) to 0-255 (transparent to opaque). */
function alpha_php2hex($alpha){
	return 255 - (($alpha / 127) * 255);
}

/** Converts an opacity value between 0-1 (transparent to opaque) to 0-127 (opaque to transparent). */
function alpha_dec2php($alpha){
	return 127 - abs($alpha) * 127;
}

/** Converts an opacity value between 0-127 (opaque to transparent) to 0-1 (transparent to opaque). */
function alpha_php2dec($alpha){
	return 1 - (1 * ($alpha / 127));
}



/**
 * Returns a colour's information from a range of possible types.
 * 
 * Alpha values are read by the function in the 0-255 range (transparent to opaque), but
 * returned in a PHP-compatible format between 0-127 (opaque to transparent). 
 * 
 * The function seeks to normalise the many ways colours are often represented in PHP:
 * 
 * - If passed an integer, the colour components are drawn using bitwise logic.
 * 
 * - If passed an array, the keys are checked for both indexed and associative values,
 *   including case-insensitive channel names in shortened/unshortened forms (e.g., "red" & "r").
 * 
 * - If passed a string, the colour is treated as a HTML hex colour, accepting numerous
 *   shorthand formats with support for non-standard RGBA notation:
 *       #F    -> #FFFFFF
 *       #4a   -> #4a4a4a
 *       #BFD  -> #BBFFDD
 *       #BFDA -> #BBFFDDAA (+Alpha: 66.666%)
 *       #bbffdd80 (+Alpha: 50%)
 *  
 * - If passed no arguments, the function simply returns pure transparent black.
 * 
 * @param mixed $colour - RGB/A components, served in any of the aforementioned formats.
 * @param mixed $alpha - Alpha value (0-255, standard RGBA range), defaults to opaque. Overrides any alpha info included in $colour, if any.
 * @return array An array enumerated with both indexed (0-3) and named ("red",..."alpha") properties.
 */
function parse_colour($colour = NULL, $alpha = NULL){
	$r = $g = $b = 0; $a = 255;


	# Returns TRUE if a variable's a valid hexadecimal value. 
	$is_hex		=	function($input){ return isset($input) && preg_match('/^(?:#|0x)?[A-Fa-f0-9]{1,8}$/', (string) $input); };


	# Checks if a value's valid for parsing into a colour component.
	$validate	=	function($input) use ($is_hex){
		if(is_int($input))		return $input >= 0;
		if(is_string($input))	return $is_hex($input);
		if(is_array($input))	return(
			($is_hex($input['red'])	&& $is_hex($input['green'])	&& $is_hex($input['blue']))	||
			($is_hex($input['r'])	&& $is_hex($input['g'])		&& $is_hex($input['b']))	||
			($is_hex($input[0])		&& $is_hex($input[1])		&& $is_hex($input[2]))
		);
	};



	#	Passed an integer
	if(is_int($colour)){
		$r	=	($colour & 0xFF0000) >> 16;
		$g	=	($colour & 0x00FF00) >> 8;
		$b	=	($colour & 0x0000FF);
	}


	#	Passed an array
	else if(is_array($colour)){
		$colour		=	array_change_key_case($colour, CASE_LOWER);
		$matched	=	array();
		$key_search	=	array(
			'r'	=>	array('red',	'r', 0),
			'g'	=>	array('green',	'g', 1),
			'b'	=>	array('blue',	'b', 2),
			'a'	=>	array('alpha',	'a', 3)
		);
		foreach($key_search as $key => $value){
			for($i = 0; $i < 3; ++$i)
				if($validate($colour[ $value[$i] ])){
					$matched[$key]	=	$colour[$value[$i]];
					break;
				}
		}
		extract($matched);
	}



	#	Passed a string: treat as an HTML hex colour.
	else if(is_string($colour)){
		$colour	=	preg_replace('/^(#|0x)/', '', strtolower(trim($colour)));
		$length	=	strlen($colour);
		switch($length){
			case 1:{	#F -> #FFFFFF
				$r = $g = $b = hexdec($colour.$colour);
				break;
			}

			case 2:{	#4a -> #4a4a4a
				$r = $g = $b = hexdec($colour[0] . $colour[1]);
				break;
			}

			case 3:		#BFD  -> #BBFFDD
			case 4:{	#BFDA -> #BBFFDDAA (+Alpha: 66.666%)
				$r	=	hexdec($colour[0].$colour[0]);
				$g	=	hexdec($colour[1].$colour[1]);
				$b	=	hexdec($colour[2].$colour[2]);
				if(4 === $length)
					$a	=	hexdec($colour[3].$colour[3]);
				break;
			}

			case 6:		#BBFFDD
			case 8:{	#bbffdd80 (+Alpha: 50%)
				$r	=	hexdec($colour[0].$colour[1]);
				$g	=	hexdec($colour[2].$colour[3]);
				$b	=	hexdec($colour[4].$colour[5]);
				if(8 === $length)
					$a	=	hexdec($colour[6].$colour[7]);
				break;
			}
		}
	}


	#	Handle our alpha argument.
	if(isset($alpha)){

		#	Passed a string
		if(is_string($alpha)){

			#	Float
			if($alpha == (string)(float) $alpha)	$a	=	round(floatval($alpha));

			#	Hexadecimal
			else if($alpha == intval($alpha, 16))	$a	=	hexdec($alpha);

			#	Integer
			else $a	=	intval($alpha);
		}


		#	Numeric value
		else $a	=	(int) round(floatval($alpha));
	}


	#	Sanitise values
	$r	=	intval($r ?: 0);
	$g	=	intval($g ?: 0);
	$b	=	intval($b ?: 0);
	$a	=	alpha_hex2php(intval($a ?: 0));
	return compact('r', 'g', 'b', 'a');
}



/**
 * Wraps a string to a given number of pixels.
 * 
 * This function operates in a similar fashion as PHP's native wordwrap function; however,
 * it calculates wrapping based on font and point-size, rather than character count. This
 * can generate more even wrapping for sentences with a considerable number of thin characters.
 * 
 * @static $mult;
 * @param string $text - Input string.
 * @param float $width - Width, in pixels, of the text's wrapping area.
 * @param float $size - Size of the font, expressed in pixels.
 * @param string $font - Path to the typeface to measure the text with.
 * @return string The original string with line-breaks manually inserted at detected wrapping points.
 */
function pixel_word_wrap($text, $width, $size, $font){

	#	Passed a blank value? Bail early.
	if(!$text) return $text;


	#	Check if imagettfbbox is expecting font-size to be declared in points or pixels.
	static $mult;
	$mult	=	$mult ?: version_compare(GD_VERSION, '2.0', '>=') ? .75 : 1;


	#	Text already fits the designated space without wrapping.
	$box	=	imagettfbbox($size * $mult, 0, $font, $text);
	if($box[2] - $box[0] / $mult < $width)	return $text;


	#	Start measuring each line of our input and inject line-breaks when overflow's detected.
	$output		=	'';
	$length		=	0;

	$words		=	preg_split('/\b(?=\S)|(?=\s)/', $text);
	$word_count	=	count($words);
	for($i = 0; $i < $word_count; ++$i){

		#	Newline
		if(PHP_EOL === $words[$i]) $length	=	0;

		#	Strip any leading tabs.
		if(!$length) $words[$i]	=	preg_replace('/^\t+/', '', $words[$i]);


		$box	=	imagettfbbox($size * $mult, 0, $font, $words[$i]);
		$m		=	$box[2] - $box[0] / $mult;

		#	This is one honkin' long word, so try to hyphenate it.
		if(($diff = $width - $m) <= 0){
			$diff	=	abs($diff);

			#	Figure out which end of the word to start measuring from. Saves a few extra cycles in an already heavy-duty function.
			if($diff - $width <= 0)	for($s = strlen($words[$i]); $s; --$s){
				$box	=	imagettfbbox($size * $mult, 0, $font, substr($words[$i], 0, $s) . '-');
				if($width > ($box[2] - $box[0] / $mult) + $size){		$breakpoint	=	$s;	break;	}
			}

			else{
				$word_length	=	strlen($words[$i]);
				for($s = 0; $s < $word_length; ++$s){
					$box	=	imagettfbbox($size * $mult, 0, $font, substr($words[$i], 0, $s+1) . '-');
					if($width < ($box[2] - $box[0] / $mult) + $size){	$breakpoint	=	$s; break;	}
				}
			}

			if($breakpoint){
				$w_l		=	substr($words[$i], 0, $s+1) . '-';
				$w_r		=	substr($words[$i],	 $s+1);
				$words[$i]	=	$w_l;
				array_splice($words, $i+1, 0, $w_r);
				++$word_count;
				$box	=	imagettfbbox($size * $mult, 0, $font, $w_l);
				$m		=	$box[2] - $box[0] / $mult;
			}
		}


		#	If there's no more room on the current line to fit the next word, start a new line.
		if($length > 0 && $length + $m >= $width){
			$output	.=	PHP_EOL;
			$length	=	0;

			#	If the current word is just a space, don't bother. Skip (saves a weird-looking gap in the text).
			if(' ' === $words[$i]) continue;
		}

		#	Write another word and increase the total length of the current line.
		$output	.=	$words[$i];
		$length +=	$m;
	}

	return $output;
}
