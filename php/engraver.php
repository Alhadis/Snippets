<?php

/**
 * Class for basic image personalisation and editing.
 * 
 * Used for adding customised messages/greetings to eCards.
 */
class Engraver{
	var $width;
	var $height;
	var $source;

	var $image;
	var $size			=	16;
	var $angle			=	0;
	var $colour			=	0x000000;
	var $last_x			=	0;
	var $last_y			=	0;
	var $text_resample	=	1;



	/**
	 * Constructor method.
	 * 
	 * @param int $width - Width of the customised image.
	 * @param int $height - Height of the customised image.
	 * @param string|resource $source - Path or reference to the source image to edit.
	 */
	function __construct($width, $height, $source){
		
		#	Whether we were passed an existing image identifer to operate on.
		$is_resource	=	is_resource($source);


		#	Chuck an error if we're given a path to an invalid or missing file.
		if(!$is_resource && !$this->is_image($source))
			throw new Exception(sprintf('File "%s" doesn\'t appear to be a recognised image format.', $source));


		$this->width	=	$width;
		$this->height	=	$height;
		$this->source	=	$source;


		#	Transfer a copy of our source image to a new/resized image for scribbling on.
		$image			=	imagecreatetruecolor($width, $height);
		$source_image	=	$is_resource ? $source : imagecreatefromauto($source);
		$source_width	=	imagesx($source_image);
		$source_height	=	imagesy($source_image);
		imagecopyresampled($image, $source_image, 0, 0, 0, 0, $width, $height, $source_width, $source_height);
		$this->image	=	$image;
	}



	/**
	 * Scales the edited image to the designated dimensions.
	 * 
	 * Note that the quality of text or shapes isn't preserved when upscaling; any
	 * modifications an Engraver makes to its image are flattened into the modified copy.
	 * 
	 * @param int $width
	 * @param int $height
	 * @return resource The newly-scaled image identifier.
	 */
	function resize($width, $height){
		$image		=	imagecreatetruecolor($width, $height);
		imagecopyresampled($image, $this->image, 0, 0, 0, 0, $width, $height, $this->width, $this->height);
		imagedestroy($this->image);
		$this->image	=	$image;
		$this->width	=	$width;
		$this->height	=	$height;
		return $this->image;
	}



	/**
	 * Checks if a file is of an image format PHP's able to manipulate.
	 * 
	 * @param string $path - Path to the file being inspected.
	 * @return bool
	 */
	public function is_image($path){
		$types	=	imagetypes();
		switch(exif_imagetype($path)){
			case IMAGETYPE_GIF:	{return $types & IMG_GIF;	break;}
			case IMAGETYPE_JPEG:{return $types & IMG_JPG;	break;}
			case IMAGETYPE_PNG:	{return $types & IMG_PNG;	break;}
			case IMAGETYPE_WBMP:{return $types & IMG_WBMP;	break;}
		}

		#	Check for XPM format support based on file extension (not recognised by exif_imagetype).
		if('xpm' === end(explode('.', strtolower($path)))) return $types & IMG_XPM;

		#	Not a recognised image format.
		return FALSE;
	}



	/**
	 * Draws a box over the engraver's source image.
	 * 
	 * @param int $x - X-ordinate of the box's top-left corner
	 * @param int $y - Y-ordinate of the box's top-left corner
	 * @param int $width - Box's width
	 * @param int $height - Box's height
	 * @param int $colour - Colour to fill the box with
	 * @param float $alpha - Opacity multiplier (0.0 - 1.0)
	 */
	public function box($x, $y, $width, $height, $colour, $alpha = 1){
		$alpha	=	alpha_dec2php($alpha);
		$colour	=	imagecolorallocatealpha($this->image, ($colour & 0xFF0000) >> 16, ($colour & 0x00FF00) >> 8, $colour & 0x0000FF, $alpha);
		imagefilledrectangle($this->image, $x, $y, $x+$width, $y+$height, $colour);
	}



	/**
	 * Writes a line of text onto the source image using the current formatting settings.
	 * 
	 * @param string $text - Text to write.
	 * @param int $x - X-ordinate to write from. Defaults to the right edge of the last message written, if any.
	 * @param int $y - Y-ordinate to write from (font height inclusive). Defaults to the bottom edge of the last message.
	 * @param float $w - Width of the textbox. Defaults to the space between $x and the canvas's right edge.
	 * @param int $passes - If the text appears too thin, increasing the passes will thicken the edges. 
	 */
	public function write($text, $x = NULL, $y = NULL, $w = NULL, $passes = 1){
		if(!$text) return; # Pls.

		#	Refine our arguments.
		$resample	=	max(1, $this->text_resample);
		$width		=	$this->width	* $resample;
		$height		=	$this->height	* $resample;
		$size		=	$this->size		* $resample;
		$x			=	$resample * ($x  !== NULL ? $x : $this->last_x);
		$y			=	$resample * (($y !== NULL ? $y : $this->last_y) + $this->size);
		$w			=	$w ? abs($w) * $resample : ($width - $x);


		#	Generate a new text layer.
		$image	=	imagecreatetruecolor($width, $height);
		imagesavealpha($image, TRUE);
		imagefill($image, 0, 0, imagecolorallocatealpha($image, 0, 0, 0, 127));


		#	Start writin'.
		$unit_mult	=	version_compare(GD_VERSION, '2.0', '>=') ? .75 : 1;
		$colour	=	imagecolorallocate($image, ($this->colour & 0xFF0000) >> 16, ($this->colour & 0x00FF00) >> 8, $this->colour & 0x0000FF);
		$text	=	pixel_word_wrap($text, $w, $size / $unit_mult, $this->font);


		imagettftext($image, $size, $this->angle, $x, $y, $colour, $this->font, $text);
		$passes	=	$passes ? max(1, $passes) : 1;
		for($i = 0; $i < $passes; ++$i)
			imagecopyresampled($this->image, $image, 0, 0, 0, 0, $this->width, $this->height, $width, $height);
		imagedestroy($image);
	}


	/**
	 * Displays or saves a copy of the edited image.
	 * 
	 * @param int $type - An IMAGETYPE constant specifying what format to generate
	 * @param string $filename - Path to save the file to. If NULL, the image's data is output directly to the browser.
	 * @param int $quality - JPEG compression quality. Relevant only if $type is IMAGETYPE_JPEG
	 * @return resource The image resource returned from the relevant GD function. 
	 */
	public function output($format = IMAGETYPE_JPEG, $quality = 75, $filename = ''){
		$image	=	imageauto($this->image, $format, $filename ?: NULL, $quality);
		if(!$filename) imagedestroy($this->image);
		return $image;
	}
}
