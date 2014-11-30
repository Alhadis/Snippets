<?php

	/**
	 *	Applies a colour transform to an image resource, analogous to SVG's feColorMatrix effect.
	 *	Transformation logic courtesy of http://www.svgbasics.com/filters4.html
	 *
	 *	@param resource $img An image resource returned by an image creation function.
	 *	@param array $m An array of 20 floats representing a 5x4 transformation matrix.
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
	 * Wrapper for the GD library's various image creation functions.
	 * Allows different formats to be generated based on the IMAGETYPE constant provided.
	 * 
	 * @param resource $img Target image resource 
	 * @param int $type An IMAGETYPE constant specifying what format to generate
	 * @param string $filename Path to save the file to. If NULL, the image's data is output directly to the browser.
	 * @param int $quality JPEG compression quality. Relevant only if $type is IMAGETYPE_JPEG
	 * @param int $foreground Foreground colour IDs - used only for WBMP and XBM file formats.
	 * 
	 * @return bool TRUE if the type was recognised and the image was successfully generated.
	 */
	function generate_image_by_type($img, $type, $filename = NULL, $quality = 75, $foreground = NULL){

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
	 * Generates a darkened and greyscaled version of an image.
	 * 
	 * @param string $filename Path to the image file
	 * @param string $save_to Path to save the modified file to. If NULL, image data will be sent to the browser.
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
		generate_image_by_type($greyscale, exif_imagetype($filename), $save_to, 80);
		imagedestroy($img);
		imagedestroy($greyscale);
		return TRUE;
	}

