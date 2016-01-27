/** Stub console methods for older browsers */
(function(){
	var console = window.console || {},
	methods     = "assert clear count debug dir dirxml error exception group groupCollapsed groupEnd info log markTimeline profile profileEnd table time timeEnd timeStamp trace warn".split(" "),
	noop        = function(){},

	/** Iterator junk */
	i = 0, fn;

	/** Loop through each commonly-used console method and stub anything that's undefined. */
	for(; i < 22; ++i)
		if(!console[(fn = methods[i])])
			console[fn] = fn;
}());
