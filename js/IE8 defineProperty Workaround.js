/**
 * For JavaScript "classes" that use Object.defineProperty AND operate on a DOM element, this hacky method
 * applies a workaround for IE8's inability to define properties on native JavaScript objects. Rather than
 * generating an instance of the class, the code forces the constructor to point to the relevant DOM element,
 * allowing getter/setter pairs defined by the class to operate transparently. Not a glamorous workaround, but
 * it works.
 *
 * If you're getting inexplicable runtime errors in IE8 ("Not implemented"), be sure your code's not overwriting
 * a property defined by the subject element's DOM interface.
 *
 * @param {Function} fn - Pointer to the JavaScript "class"
 * @param {Number} argIndex - Index of the constructor argument that holds the class's subject DOM reference.
 * @param {String} argName - If set, will use the property of the argument located above as the subject element.
 * @return {Function}
 */
function IE8PropertyPunch(fn, argIndex, argName){
	return function(){
		var p, args	=	arguments,
			THIS	=	args[argIndex || 0];
		if(argName)
			THIS	=	THIS[argName];

		/** TODO: Add support for prototype's superclasses? */
		for(p in fn.prototype)
			THIS[p]	=	fn.prototype[p];

		fn.apply(THIS, args);
		return THIS;
	};
}







/**
 * Example usage
 *
 * I understand this code has an extremely specific use that's not easily explained...
 * so an example might enlighten baffled readers a bit better. The following code illustrates
 * a common-use scenario where a developer's using a JavaScript "class" to implement AJAX-powered
 * forms, with the first argument passed to an AJAXForm instance being an existing <form> element.
 *
 * Since IE8 can't define getter/setter properties on native JS objects, the entire underlying functionality
 * of the class is ruined - unless we point the constructor to operate within the context of the DOM element
 * it operates on. Suddenly, IE8 has no issues with defineProperty! Huzzah! Effective? Yes! Beautiful? NO!
 */
var AJAXForm	=	function(args){
	for(var i in args)
		this[i]	=	args[i];

	var loading	=	false;
	Object.defineProperty(this, "loading", {
		get:	function(){ return loading; },
		set:	function(input){ loading	=	input; }
	});
};

/** Check if the browser can't use Object.defineProperty on native JavaScript objects. */
if(function(){
	try{Object.defineProperty({}, "test", {value: true});}
	catch(e){return true;}
}()){

	/** If not, hack this shit. */
	AJAXForm	=	IE8PropertyPunch(AJAXForm, 0, "form");
}


var f	=	new AJAXForm({
	form: 	document.getElementById("entry-form")
});