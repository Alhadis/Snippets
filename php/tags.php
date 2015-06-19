<?php

/**
 * Vomits a diverse morass of varyingly-sized favicons tailored for different devices.
 *
 * @param int $colour	- Background tile colour, relevant only for Windows Phones.
 * @param string $base	- Path containing each icon, trailing slash inclusive. Defaults to root directory: '/'
 * @param bool $inc_ico	- If TRUE, will include a link for Windows Icon files for IE.
 * @return string
 */
function favicons($colour = 0x000000, $base = '/', $inc_ico = TRUE){
	$touch_icons	=	array('57x57', '114x114', '72x72', '144x144', '60x60', '120x120', '76x76', '152x152', '180x180');
	$icons			=	array('192x192', '160x160', '96x96', '16x16', '32x32');
	$output			=	'';

	foreach($touch_icons as $size)	$output	.=	sprintf('<link rel="apple-touch-icon" sizes="%1$s" href="%2$sapple-touch-icon-%1$s.png"/>'.PHP_EOL,	$size, $base);
	foreach($icons as $size)		$output	.=	sprintf('<link rel="icon" type="image/png" href="%2$sfavicon-%1$s.png" sizes="%1$s"/>'.PHP_EOL,		$size, $base);

	$output	.=	sprintf('<meta name="msapplication-TileColor" content="#%1$s"/>'.PHP_EOL, sprintf("%'.06x", $colour), $base);
	$output	.=	sprintf('<meta name="msapplication-TileImage" content="%1$smstile-144x144.png" />'.PHP_EOL, $base);

	# Include .ICO files unless explicitly disabled.
	if($inc_ico)
		$output	.=	sprintf('<!--[if IE]><link rel="shortcut icon" type="image/x-icon" href="%1$sfavicon.ico" /><![endif]-->', $base).PHP_EOL;

	return $output;
}




/**
 * Injects Facebook's Custom Audience tracking code into the page.
 *
 * @param string $id - Tracking ID
 * @version 1.0 - Added 2015-05-27
 */
function fb_custom_audience($id){ ?> 
<script>
(function(){
	var _fbq = window._fbq || (window._fbq = []);
	if(!_fbq.loaded){
		var fbds = document.createElement("script");
		fbds.async = true;
		fbds.src = "//connect.facebook.net/en_US/fbds.js";
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(fbds, s);
		_fbq.loaded = true;
	}
	_fbq.push(["addPixelId", "<?= $id ?>"]);
})();
window._fbq = window._fbq || [];
window._fbq.push(["track", "PixelInitialized", {}]);
</script><noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?id=<?= $id ?>&amp;ev=PixelInitialized"/></noscript>
<?php echo PHP_EOL;
}



/**
 * Generates a URL for sharing a link on Facebook with customised message/s.
 * 
 * @param string	$app_id			- Facebook app's ID
 * @param string	$link			- URL to be shared by user
 * @param string	$picture		- URL pointing to the link's thumbnail image
 * @param string	$name			- Link's title
 * @param string	$caption		- Text displayed beneath title
 * @param string	$description	- A paragraph elaborating on the nature of the link
 * @param string	$redirect_uri	- URL to direct the user to after posting $link
 *
 * @return {string} The escaped and URL-encoded link, ready for echoing to an HREF attribute.
 */
function fb_share_link($app_id, $link, $picture, $name, $caption, $description, $redirect_uri){
	$params	=	compact(explode(' ', 'app_id link picture name caption description redirect_uri'));
	foreach($params as $key => $value)
		$params[$key]	=	html_entity_decode($value);

	return htmlspecialchars('https://www.facebook.com/dialog/feed?' . http_build_query($params));
}


/**
 * Generates a URL for sharing a message on Twitter.
 *
 * @param string $text - Text to have retweeted by users.
 * @return string - An escaped and URL-encoded link, ready for injecting into an HREF attribute.
 */
function tw_share_link($text){
	return htmlspecialchars('https://twitter.com/home?status=' . urlencode(urldecode($text)));
}



/**
 * Injects a script to load and initialise GA on the page.
 *
 * @param string $id - Google Analytics ID (e.g., "UA-47377755-3")
 * @version 1.0 - Added 2015-05-25
 */
function google_analytics($id){

	# No ID passed? Stub the GA function to prevent runtime errors.
	if(!$id): ?> 
<script>window.ga = function(){};</script><?php

	# Otherwise, inject the script normally.
	else: ?> 
<script>
(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,"script","//www.google-analytics.com/analytics.js","ga");
ga("create", "<?= $id ?>", "auto");
ga("send", "pageview");
</script><?php
	endif;
	echo PHP_EOL;
}
