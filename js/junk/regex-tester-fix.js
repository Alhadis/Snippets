/**
 * Add stylistic improvements to Paweł Psztyć's RegEx tester add-on for Chrome.
 *
 * @link https://chrome.google.com/webstore/detail/regexp-tester-app/cmmblmkfaijaadfjapjddbeaoffeccib
 */
(function(){
	"use strict";
	var $ = function(s){ return document.querySelector(s) };

	var pattern = $("#pattern");
	pattern.style.font = "11px Menlo";

	var input = $("#body");
	if(input.patched){
		var junk = document.querySelectorAll("#regexp-form > label, .options, img, footer, header, .tabs, #body, #replace");
		Array.from(junk).forEach(function(a){a.hidden = true});
		var css = document.styleSheets[0];
		css.insertRule("[hidden]{display:none!important;}", css.rules.length);
	}

	else{
		input.patched = true;
		input.style.tabSize    = 4;
		input.style.fontSize   = "10pt";
		input.style.fontFamily = "monospace";
		input.spellcheck       = false;
	}

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
javascript:!function(){"use strict";var e=function(e){return document.querySelector(e)},t=e("#pattern");t.style.font="11px Menlo";var o=e("#body");if(o.patched){var n=document.querySelectorAll("#regexp-form > label, .options, img, footer, header, .tabs, #body, #replace");Array.from(n).forEach(function(e){e.hidden=!0});var l=document.styleSheets[0];l.insertRule("[hidden]{display:none!important;}",l.rules.length)}else o.patched=!0,o.style.tabSize=4,o.style.fontSize="10pt",o.style.fontFamily="monospace",o.spellcheck=!1;[].forEach.call(e(".content").children,function(e){e.spellcheck=!1;var t=e.style;t.whiteSpace="pre",t.tabSize=4,t.fontFamily="monospace",t.fontSize="10pt",t.overflow="auto",t.width="100%"})}();
