(function(){

	/** Global shorthand/MUNGE bench */
	var	win			=	window,
		doc			=	document,
		body		=	doc.body,
		


	/** Which property to use when getting/setting an HTMLElement's textual content (thanks for NaN, IE8) */
		TEXT		=	"textContent" in body ? "textContent" : "innerText",


	/** Page anatomy */
		etc			=	doc.getElementById("etc"),
		whatever	=	doc.getElementById("whatever"),
		main		=	doc.querySelector("main"),




	/** Bench of utility functions */
	utilityFunction	=	function(target){
		return target.usefulShit
	};




	/** DOM Extensions */
	NodeList.prototype.forEach			=
	HTMLCollection.prototype.forEach	=	Array.prototype.forEach;
	if(win.StaticNodeList)
		StaticNodeList.prototype.forEach	=	Array.prototype.forEach;


	/** References/assignments to global/native properties here */
	Function.prototype.noop	=	function(){
	
	};





	/** Webapp's logic starts here: */





}());