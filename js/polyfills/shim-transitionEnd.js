/**
 * Mediate those wretched vendor prefixes for onTransitionEnd.
 *
 * Older browsers only supported the event with prefixed names (Opera being
 * the worst offender). The function returns whichever name is needed to
 * support transition events in a running browser (prefixed or not).
 *
 * URL: https://developer.mozilla.org/en-US/docs/Web/Events/transitionend
 */


/** Name of the onTransitionEnd event supported by this browser. */
var transitionEnd = (function(){
	for(var names = "transitionend webkitTransitionEnd oTransitionEnd otransitionend".split(" "), i = 0; i < 4; ++i)
		if("on"+names[i].toLowerCase() in window) return names[i];
	return names[0];
}());
