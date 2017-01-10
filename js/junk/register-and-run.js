// Wanky way to trigger and register an event handler at the same time:
window.addEventListener("resize", new function(){
	return this.constructor;
});
