<?php

/**
 * Vomit a diverse morass of varyingly-sized favicons tailored for different devices.
 *
 * @param int $colour   - Background tile colour, relevant only for Windows Phones.
 * @param string $name  - App/site's name, used by Android Chrome M39, iOS8 and Windows 8
 * @param string $base  - Path containing each icon, trailing slash inclusive. Defaults to root directory: '/'
 * @param bool $inc_ico - If TRUE, will include a link for Windows Icon files for IE.
 * @return string
 */
function favicons($colour = 0x000000, $name = '', $base = '/', $inc_ico = TRUE){
	$colour       = sprintf("%'.06x", $colour);
	$name         = htmlspecialchars($name);
	
	$touch_icons  = array('57x57', '60x60', '72x72', '76x76', '114x114', '120x120', '144x144', '152x152', '180x180');
	$favicons     = array('16x16', '32x32', '96x96', '194x194');
	$android      = array('192x192');
	$output       = '';
	
	foreach($touch_icons as $size)  $output .=  sprintf('<link rel="apple-touch-icon" sizes="%1$s" href="%2$sapple-touch-icon-%1$s.png"/>'.PHP_EOL,     $size, $base);
	foreach($favicons as $size)     $output .=  sprintf('<link rel="icon" type="image/png" href="%2$sfavicon-%1$s.png" sizes="%1$s"/>'.PHP_EOL,         $size, $base);
	foreach($android as $size)      $output .=  sprintf('<link rel="icon" type="image/png" href="%2$sandroid-chrome-%1$s.png" sizes="%1$s"/>'.PHP_EOL,  $size, $base);

	$output .=  sprintf('<link rel="manifest" href="%1$smanifest.json"/>'.PHP_EOL,            $base);
	$output .=  sprintf('<meta name="apple-mobile-web-app-title" content="%1$s"/>'.PHP_EOL,   $name);
	$output .=  sprintf('<meta name="application-name" content="%1$s"/>'.PHP_EOL,             $name);
	$output .=  sprintf('<meta name="msapplication-TileColor" content="#%1$s"/>'.PHP_EOL,     $colour);
	$output .=  sprintf('<meta name="msapplication-TileImage" content="%1$smstile-144x144.png"/>'.PHP_EOL, $base);
	$output .=  sprintf('<meta name="theme-color" content="#%1$s"/>'.PHP_EOL, $colour);

	# Include .ICO files unless explicitly disabled.
	if($inc_ico)
		$output .= sprintf('<!--[if IE]><link rel="shortcut icon" type="image/x-icon" href="%1$sfavicon.ico" /><![endif]-->', $base).PHP_EOL;

	return $output;
}




/**
 * Inject Facebook's Custom Audience tracking code into the page.
 *
 * @param string $id - Tracking ID
 * @version 2.0 - Updated 2015-08-25
 */
function fb_custom_audience($id){
	
	# No ID? Bail.
	if(!$id) return;
?> 
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,"script","//connect.facebook.net/en_US/fbevents.js");

fbq("init", "<?= $id ?>");
fbq("track", "PageView");
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=<?= $id ?>&amp;ev=PageView&amp;noscript=1" /></noscript>
<?php echo PHP_EOL;
}




/**
 * Injects Facebook's ad-tracking code into the page
 *
 * @param string $id - Conversion ID
 * @param bool $fire - Whether to fire a conversion immediately on page-load.
 * @version 1.0 - Added 2015-08-25
 */
function fb_conversion_pixel($id, $fire = FALSE){

	# Do nothing if we weren't passed a conversion ID.
	if(!$id) return;
?> 
<script>(function(){
var _fbq = window._fbq || (window._fbq = []);
if(!_fbq.loaded){
	var fbds = document.createElement("script");
	fbds.async = true;
	fbds.src = "//connect.facebook.net/en_US/fbds.js";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(fbds, s);
	_fbq.loaded = true;
}
})();
window._fbq = window._fbq || [];<?php
if($fire): ?> 
window._fbq.push(["track", "<?= $id ?>", {"value":"0.00","currency":"AUD"}]);
</script>
<noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?ev=<?= $id ?>&amp;cd[value]=0.00&amp;cd[currency]=AUD&amp;noscript=1"/></noscript><?php
else: ?> 
</script><?php
endif;
echo PHP_EOL;
}




/**
 * Embeds Facebook's Canvas script into the page.
 *
 * @param string $id - Facebook app ID
 * @version 1.0 - Added 2015-08-07
 */
function fb_canvas($id){ ?> 
<script>
	window.fbAsyncInit = function(){
		FB.init({
			appId:   "<?= $id ?>",
			xfbml:   true,
			version: "v2.4"
		});

		/** If fluid height is required (which it almost always will be): */
		FB.Canvas.setAutoGrow();
		FB.Canvas.scrollTo(0,0);
	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, "script", "facebook-jssdk"));
</script><?php
echo PHP_EOL;
}



/**
 * Generates a URL for sharing a link on Facebook with customised message/s.
 * 
 * @param array $params {
 *     Array of parameters:
 *
 *     @type string        $app_id          Facebook app's ID
 *     @type string        $link            URL to be shared by user
 *     @type string        $picture         URL pointing to the link's thumbnail image
 *     @type string        $name            Link's title
 *     @type string        $caption         Text displayed beneath title
 *     @type string        $description     A paragraph elaborating on the nature of the link
 *     @type string        $redirect_uri    URL to direct the user to after posting $link
 * }
 * @return {string} The escaped and URL-encoded link, ready for echoing to an HREF attribute.
 */
function fb_share_link($params = array()){
	$params = array_map('html_entity_decode', $params);

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
 * Generates an escaped and URL-encoded mailto: link, ready to inject into an href attribute.
 *
 * @param array|string $params {
 *     @type string        $to          Recipient's e-mail address
 *     @type string        $subject     Initial subject line
 *     @type string        $body        Initial body text
 * }
 */
function mailto_link($params = array()){
	
	# If passed a string, treat it as the $to parameter.
	if(is_string($params))
		$params = array('to' => $params);


	$params = array_map('html_entity_decode', $params);

	# Don't include the recipient's e-mail address in the query parameters.
	$to = $params['to'];
	unset($params['to']);

	$params = http_build_query($params);
	return htmlspecialchars(str_replace('+', '%20', sprintf('mailto:%1$s%2$s', $to, $params ? '?'.$params : '')));
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
