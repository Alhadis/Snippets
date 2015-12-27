/**
 * Add stylistic improvements to Paweł Psztyć's RegEx tester add-on for Chrome.
 *
 * @link https://chrome.google.com/webstore/detail/regexp-tester-app/cmmblmkfaijaadfjapjddbeaoffeccib
 */
(function(){
	"use strict";
	var $ = function(s){ return document.querySelector(s) };

	var input = $("#body");
	input.style.tabSize    = 4;
	input.style.fontSize   = "10pt";
	input.style.fontFamily = "monospace";
	input.spellcheck       = false;

	[].forEach.call($(".content").children, function(i){
		i.spellcheck = false;
		var s        = i.style;
		s.whiteSpace = "pre";
		s.tabSize    = 4;
		s.fontFamily = "monospace";
		s.fontSize   = "10pt";
		s.overflow   = "auto";
		s.width      = "100%";
	});
}());


/** Compressed variant for browser bookmarking: */
javascript:(function(){"use strict";var e=function(e){return document.querySelector(e)};var t=e("#body");t.style.tabSize=4;t.style.fontSize="10pt";t.style.fontFamily="monospace";t.spellcheck=false;[].forEach.call(e(".content").children,function(e){e.spellcheck=false;var t=e.style;t.whiteSpace="pre";t.tabSize=4;t.fontFamily="monospace";t.fontSize="10pt";t.overflow="auto";t.width="100%"})})();
