/* HTML5 Shiv 3.7.3-pre */
!function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=t.elements;return"string"==typeof a?a.split(" "):a}function e(a,b){var c=t.elements;"string"!=typeof c&&(c=c.join(" ")),"string"!=typeof a&&(a=a.join(" ")),t.elements=c+" "+a,j(b)}function f(a){var b=s[a[q]];return b||(b={},r++,a[q]=r,s[r]=b),b}function g(a,c,d){if(c||(c=b),l)return c.createElement(a);d||(d=f(c));var e;return e=d.cache[a]?d.cache[a].cloneNode():p.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!e.canHaveChildren||o.test(a)||e.tagUrn?e:d.frag.appendChild(e)}function h(a,c){if(a||(a=b),l)return a.createDocumentFragment();c=c||f(a);for(var e=c.frag.cloneNode(),g=0,h=d(),i=h.length;i>g;g++)e.createElement(h[g]);return e}function i(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return t.shivMethods?g(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-:]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(t,b.frag)}function j(a){a||(a=b);var d=f(a);return!t.shivCSS||k||d.hasCSS||(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),l||i(a,d),a}var k,l,m="3.7.3-pre",n=a.html5||{},o=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,q="_html5shiv",r=0,s={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",k="hidden"in a,l=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return"undefined"==typeof a.cloneNode||"undefined"==typeof a.createDocumentFragment||"undefined"==typeof a.createElement}()}catch(c){k=!0,l=!0}}();var t={elements:n.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:m,shivCSS:n.shivCSS!==!1,supportsUnknownElements:l,shivMethods:n.shivMethods!==!1,type:"default",shivDocument:j,createElement:g,createDocumentFragment:h,addElements:e};a.html5=t,j(b),"object"==typeof module&&module.exports&&(module.exports=t)}("undefined"!=typeof window?window:this,document);


/** Add/RemoveEventListener Polyfill (<= IE8) */
(function(){if(!document.createElement("div").addEventListener){var e="_eventListeners",t=function(t,n){var r=this;if(!(e in r))r[e]={};if(!r[e][t])r[e][t]=[];var i=r[e][t],o;for(o in i)if(n===i[o][0])return;i.push([n,n=function(e){return function(t){var t=t||window.event;if(!("target"in t))t.target=t.srcElement;if(!t.preventDefault)t.preventDefault=function(){this.returnValue=false};return e.call(r,t)}}(n)]);r.attachEvent("on"+t,n)},n=function(t,n){var r=this;if(!(e in r))r[e]={};if(!r[e][t])r[e][t]=[];var i=r[e][t],o;for(o in i){if(n===i[o][0]){r.detachEvent("on"+t,i[o][1]);delete i[o]}}};Object.defineProperty(Element.prototype,"addEventListener",{value:t});Object.defineProperty(Element.prototype,"removeEventListener",{value:n});document.addEventListener=t;document.removeEventListener=n;window.addEventListener=function(){t.apply(document,arguments)};window.removeEventListener=function(){n.apply(document,arguments)}}})();

/** DOMTokenList Polyfill */
window.DOMTokenList||function(){var t="defineProperty"in Object||"__defineGetter__"in Object.prototype||null,e=function(e,n,i,r){Object.defineProperty?Object.defineProperty(e,n,{configurable:!1===t?!0:!!r,get:i}):e.__defineGetter__(n,i)};if(t)try{e({},"support")}catch(n){t=!1}var i=function(t,n){var i,r=[],l={},s=0,o=0,a=function(){if(s>=o)for(;s>o;++o)(function(t){e(this,t,function(){return c.call(this),r[t]},!1)}).call(this,o)},c=function(){var e;if(arguments.length)for(e=0;e<arguments.length;++e)if(/\s/.test(arguments[e])){var o=new SyntaxError('String "'+arguments[e]+'" contains an invalid character');throw o.code=5,o.name="InvalidCharacterError",o}if(i!==t[n]){r=(""+t[n]).replace(/^\s+|\s+$/g,"").split(/\s+/),l={};for(var e=0;e<r.length;++e)l[r[e]]=!0;s=r.length,a.call(this)}};return c.call(this),e(this,"length",function(){return c.call(this),s}),this.toLocaleString=this.toString=function(){return c.call(this),r.join(" ")},this.item=function(t){return c.call(this),r[t]},this.contains=function(t){return c.call(this),!!l[t]},this.add=function(){c.apply(this,arguments);for(var e,i=0;i<arguments.length;++i)e=arguments[i],l[e]||(r.push(e),l[e]=!0);s!==r.length&&(s=r.length>>>0,t[n]=r.join(" "),a.call(this))},this.remove=function(){c.apply(this,arguments);for(var e={},i=0;i<arguments.length;++i)e[arguments[i]]=!0,delete l[arguments[i]];for(var o=[],i=0;i<r.length;++i)e[r[i]]||o.push(r[i]);r=o,s=o.length>>>0,t[n]=r.join(" "),a.call(this)},this.toggle=function(t,e){return c.apply(this,[t]),void 0!==e?e?(this.add(t),!0):(this.remove(t),!1):l[t]?(this.remove(t),!1):(this.add(t),!0)},function(t,e){if(e)for(var n="item contains add remove toggle toString toLocaleString".split(" "),i=0;7>i;++i)e(t,n[i],{enumerable:!1})}(this,Object.defineProperty),this};i.polyfill=!0,window.DOMTokenList=i;var r=function(n,l,s){e(n.prototype,l,function(){var n,o="__defining_"+l+"__";if(this[o])return n;if(this[o]=!0,!1===t){for(var a,c=r.mirror=r.mirror||document.createElement("div"),h=c.childNodes,u=h.length,f=0;u>f;++f)if(h[f].reflectedElement===this){a=h[f];break}a||(a=document.createElement("div"),c.appendChild(a)),n=i.call(a,this,s)}else n=new i(this,s);return e(this,l,function(){return n}),delete this[o],n},!0)};r(Element,"classList","className"),r(HTMLLinkElement,"relList","rel"),r(HTMLAnchorElement,"relList","rel"),r(HTMLAreaElement,"relList","rel")}();


/** ECMAScript5 */
if(!Array.prototype.forEach){Array.prototype.forEach=function(r,o){if(typeof r!=="function")throw new TypeError(r+" is not a function");if(this==null)throw new TypeError('"this" is null or undefined.');var t,i=0,n=Object(this),e=n.length>>>0;while(i<e){if(i in n)r.call(o,n[i],i,n);++i}}}
Date.now				=	Date.now || function(){return +new Date};
String.prototype.trim	=	String.prototype.trim || function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");};


/** Store "constants" on the window object to flag specific versions of Explorer. */
(function(){
	var WIN			=	window,
		DOC			=	document,
		IE_VERSION	=	"IE_VERSION",
		i			=	6;

	for(; i < 10; ++i) if(function(v){
		var d		=	DOC.createElement("div");
		d.innerHTML	=	"<!--[if IE "+v+"]><i></i><![endif]-->";
		return d.getElementsByTagName("i").length;
	}(i))
		WIN["IS_IE" + i ]	=	true,
		WIN[ IE_VERSION ]	=	i;


	/** Might as well flag the root element with CSS classes while we're here. */
	DOC.documentElement.classList.add("ie", "ie"+WIN[ IE_VERSION ]);
}());



function IE8PropertyPunch(fn, argIndex, argName){
	return function(){
		var p, args	=	arguments,
			THIS	=	args[argIndex || 0];
		if(argName)
			THIS	=	THIS[argName];

		for(p in fn.prototype)
			THIS[p]	=	fn.prototype[p];

		fn.apply(THIS, args);
		return THIS;
	};
}
