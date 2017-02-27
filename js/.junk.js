// Invert bitmask
~$mask & 0xFF

// Check flag (where FLAG_CONSTANT is 1,2,4,8, etc...)
FLAG_CONSTANT & $options

// Ripping a byte out of a larger number
var red     = (colour & 0xFF0000) >> 16;
var green   = (colour & 0x00FF00) >> 8;
var blue    = (colour & 0x0000FF) >> 0;

// Wanky way to trigger and register an event handler at the same time:
window.addEventListener("resize", new function(){
	return this.constructor;
});

// Faux strikethrough effect with combining characters
string.replace(/([^\x0336])/g, "\u0336$1") + "\u0336";
