/** window.pageXOffset / window.pageYOffset */
if(!("pageXOffset" in window)) (function(){
	var x = function(){ return (document.documentElement || document.body.parentNode || document.body).scrollLeft; };
	var y = function(){ return (document.documentElement || document.body.parentNode || document.body).scrollTop;  };
	Object.defineProperty(window, "pageXOffset", {get: x});
	Object.defineProperty(window, "pageYOffset", {get: y});
	Object.defineProperty(window, "scrollX",     {get: x});
	Object.defineProperty(window, "scrollY",     {get: y});
}());

/** window.innerWidth / window.innerHeight */
if(!("innerWidth" in window)){
	Object.defineProperty(window, "innerWidth",  {get: function(){ return (document.documentElement || document.body.parentNode || document.body).clientWidth; }});
	Object.defineProperty(window, "innerHeight", {get: function(){ return (document.documentElement || document.body.parentNode || document.body).clientHeight; }});
}

/** event.pageX / event.pageY */
if(!window.MouseEvent && !("pageX" in Event.prototype)){
	Object.defineProperty(Event.prototype, "pageX", {get: function(){ return this.clientX + window.pageXOffset; }});
	Object.defineProperty(Event.prototype, "pageY", {get: function(){ return this.clientY + window.pageYOffset; }});
}
