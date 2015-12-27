/**
 * IE8 Property Patch
 *
 * This stupid hack attempts to circumvent IE8's inability to define properties
 * on native JS objects by merging their properties/methods into a detached DOM
 * element and returning it.
 *
 * @param {Function|Object} obj - Native JavaScript object before it's targeted
 *                                by Object.defineProperty.
 * @return {HTMLElement}
 */
var IE8PP = function(obj){

	if(obj instanceof Element)
		return obj;

	if("function" === typeof obj)
		return function(){
			var shadow = document.createElement("s");
			for(var p in obj.prototype)
				shadow[p] = obj.prototype[p];
			shadow.prototype = obj.prototype;
			obj.apply(shadow, arguments);
			return shadow;
		}

	else{
		var shadow = document.createElement("s");
		for(var p in obj)
			shadow[p] = obj[p];
		shadow.prototype = obj;
		return shadow;
	}
};
