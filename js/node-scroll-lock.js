/*

	QUICK USAGE:
	===============================================================

	1.	HTML:	Add the "keep-in-sight" class to your desired HTML elements
	
		<nav class="keep-in-sight">



	2.	JavaScript:

		new NodeScrollLock(".keep-in-sight");



	3.	CSS:	Suggested use

		.keep-in-sight.locked{
			position: fixed !important;
			top: 0;
			left: 0;
		}


	NOTES:
	===============================================================
	-	"keep-in-sight" can always be replaced with another CSS class name if you choose, just make sure it's unique.
	-	"locked" is the default CSS class applied to the fixed elements; again, feel free to change if need be.
	-	... please don't dump this block comment in with the rest of your code. Use the function below. ;-) Thanks.
*/



function NodeScrollLock(nodes){
	var nodes	=	$(nodes);

	if(!nodes.length){
		$(document).off("scroll", null, keepLocked);
		return;
	}


	/** Store each node's initial position on the page so we can reset it when removing the lock class. */
	nodes.each(function(){
		this.nominalPosition	=	$(this).offset();
	});



	/**	Configure the event handler */
	$(document).on("scroll", null, function(){

		/** Use a for loop instead of jQuery's native .each method to try saving some overhead. */
		for(var l, h, pad = i = 0; i < nodes.length; ++i){
			l	=	$(nodes[i]),
			h	=	l.outerHeight();

			if(nodes[i].nominalPosition.top < ((undefined !== window.pageYOffset) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop)){
				pad	=	h > pad ? h : pad;
				l.addClass("locked");
			}

			else{
				pad	=	h > pad ? 0 : pad;
				l.removeClass("locked");
			}
		}
		
		$("html").css("margin-top", pad);
	});
}