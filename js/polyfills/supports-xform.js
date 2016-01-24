/**
 * Name of the CSSOM property used by this browser for CSS transforms.
 * For instance, this will be "msTransform" in IE9, and "transform" in
 * modern browsers.
 *
 * @type {String}
 */
var CSS_TRANSFORM = (function(n){
	s = document.documentElement.style;
	if((prop = n.toLowerCase()) in s) return prop;
	for(var prop, s, p = "Webkit Moz Ms O Khtml", p = (p.toLowerCase() + p).split(" "), i = 0; i < 10; ++i)
		if((prop = p[i]+n) in s) return prop;
	return "";
}("Transform"));


/**
 * Whether 3D transforms are supported by this browser.
 *
 * @type {Boolean}
 */
var CSS_3D_SUPPORTED = (function(propName){
	var e = document.createElement("div"), s = e.style,
	v = [["translateY(", ")"], ["translate3d(0,", ",0)"]]
	try{ s[propName] = v[1].join("1px"); } catch(e){}
	return v[+!!s[propName]] === v[1];
}(CSS_TRANSFORM));
