/** Cross-browser shim for requestAnimationFrame */
window.requestAnimationFrame	=
	window.requestAnimationFrame || window.webkitAnimationFrame || window.mozAnimationFrame ||
	window.msAnimationFrame || window.oAnimationFrame || function(callback){ return setTimeout(callback, 1000 / 60); };
