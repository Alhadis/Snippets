/**
 * Handler to optimise the max-height of folding content.
 *
 * The behaviour of CSS3-fuelled expandable elements is further refined by
 * JavaScript, which sets each folding region's max-height to fit the extent
 * of its content (allowing for the smoothest and neatest-fitting transition
 * when opened).
 *
 * Include this in the main.js of any client work.
 * Requires debouncing function from utils.js (or something similar).
 */

var folds	=	document.getElementsByClassName("fold");
window.addEventListener("resize", (new function(){

	Array.prototype.forEach.call(folds, function(o){
		o.style.maxHeight	=	o.scrollHeight + "px";
	});

	return this.constructor;
}).debounce(80));
