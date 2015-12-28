/**
 * Mediate those wretched vendor prefixes for onTransitionEnd.
 *
 * Older browsers only supported the event with prefixed names (Opera being
 * the worst offender). Whichever name is needed to support transition events
 * in a running browser (prefixed or not) is stored in TransitionEvent.END.
 *
 * URL: https://developer.mozilla.org/en-US/docs/Web/Events/transitionend
 */
(function(o){
	if(o.END) return;
	for(var names = "transitionend webkitTransitionEnd oTransitionEnd otransitionend".split(" "), i = 0; i < 4; ++i)
		if("on"+names[i].toLowerCase() in window) return (o.END = names[i]);
	return (o.END = names[0]);
}(window.TransitionEvent || {}));
