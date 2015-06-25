function random(n,o){return Math.floor(Math.random()*o-n+1)+n}

function percent(n,e,r){var r=r==undefined?0:r;return(n-r)/(e-r)*100}

function percentOf(n,e,f){return n/100*(e-(f==undefined?0:f))}


/** Measures the arctangent between two points (the angle required for one point to face another). */
function angleTo(a,n){return Math.atan2(n[1]-a[1],a[0]-n[0])*180/Math.PI}


/** Measures the distance between two points. */
function distance(t,a){return Math.sqrt(Math.pow(a[0]-t[0],2)+Math.pow(a[1]-t[1],2))}


/** Converts radians to degrees. */
function radToDeg(n){return n*180/Math.PI}

/** Converts degrees to radians. */
function degToRad(n){return n*Math.PI/180}


/** Applies De Casteljau's algorithm to an array of points to ascertain the final midpoint. */
function deCasteljau(e,n){var t,h,l,n=n||.5,r=[];while(e.length>1){for(l=0;l<e.length-1;++l){t=e[l];h=e[l+1];r.push([t[0]+(h[0]-t[0])*n,t[1]+(h[1]-t[1])*n])}e=r;r=[]}return[e[0],t,h]}



/** Add leading zeros when necessary. */
function zeroise(n,r){var t=n.toString();if(t.length<r)t=Array(r-t.length+1).join("0")+t;return t}


/** Returns TRUE if a variable is a Number or number-like String. */
function isNumeric(t){return""!==t&&+t==t&&(String(t)===String(+t)||!/[^\d\.]+/.test(t))}


/** Formats a number of bytes for human-readable output. */
function formatBytes(B){var r,e=new Array("B","KB","MB","GB","TB","PB","EB","ZB","YB");for(r in e)if(B>=1024)B=B/1024;else break;return Math.round(B*100)/100+" "+e[r]}



/** Parses a well-formed URL query string into an object hash. */
function unserialiseQuery(e){e=e||document.location.search;if(!e)return{};e=e.replace(/^\?/,"").split(/&/g);for(var i={},n=0,e;n<e.length;++n){if(!n)continue;e[n]=e[n].split(/=/);i[e[n][0]]=e[n].slice(1).join("=")}return i}


/** Returns the subproperty located on an object at the designated path. */
function resolveProperty(e,n,r){var n=n.replace(/\[(['"])?([^\]]+)\1\]/g,".$2").split(/\./g),i=e,f,t=0,u=n.length;for(;t<u;++t){f=n[t];if(i===undefined||!(f in i))return r?i:undefined;i=i[f];if(t>=u-1)return i}return undefined}



/** Returns the English ordinal suffix for a number (-st, -nd, -rd, -th) */
function ordinalSuffix(n){return[,"st","nd","rd"][(n%=100)>10&&n<20?0:n%10]||"th"}


/** Returns a number of milliseconds from a string representing a time value in CSS. */
function parseDuration(e){if(typeof e!="string")return e;if(/\ds\s*$/i.test(e))return parseFloat(e)*1e3;else return parseFloat(e)}



/** Ascertains a browser's support for a CSS property. */
function cssSupport(e){t=document.documentElement.style;if(e.toLowerCase()in t)return true;for(var t,r="Webkit Moz Ms O Khtml",r=(r.toLowerCase()+r).split(" "),n=0;n<10;++n)if(r[n]+e in t)return true;return false}




/** Returns TRUE if a browser appears to support a given CSS unit. */
function cssUnitSupport(t){try{var e=document.createElement("div");e.style.width="32"+t;return e.style.width=="32"+t}catch(r){return false}}



/** Returns TRUE if browser understands a given CSS selector. Not supported in IE6-7 */
function cssSelectorSupport(e){var t=document,s=t.body,l=e+"{}",e=s.appendChild(t.createElement("style")),n=e.sheet,r;n?(e.textContent=l,n=e.sheet):(n=e.styleSheet).cssText=l;r=0!==(n.cssRules||n.rules).length;s.removeChild(e);return r}




/**
 * Returns the width of the scrollbars being displayed by this user's OS/device.
 * @return {Number}
 */
function getScrollbarWidth(){var e=document,t=e.createElement("div"),o=t.style,r=120,d;o.width=o.height=r+"px";o.overflow="auto";t.innerHTML=Array(r*5).join(" W ");(e.body||e.documentElement).appendChild(t);d=t.offsetWidth-t.scrollWidth;t.parentNode.removeChild(t);return d}




/** Exports a table's data as an array of object literals. */
HTMLTableElement.prototype.extract=function(){var t,e,r=[],i=[],h=this.tHead?this.tHead.querySelectorAll("tr:first-child > th"):this.tBodies[0].querySelectorAll("tr:first-child > td");for(t=0,e=h.length;t<e;++t)r.push(h[t].textContent.trim());for(t=0,e=this.tBodies.length;t<e;++t){(function(t,e,i){var h=i,l=t.children.length,n,o,s,d;for(;h<l;++h){n=t.children[h].children,s=0,o=n.length,d={};for(;s<o;++s)d[r[s]]=n[s].textContent.trim();e.push(d)}})(this.tBodies[t],i,+(!this.tHead&&!t))}return i};



/** Inclusive string splitting method. Similar to String.prototype.split, except matching results are always included as part of the returned array. */
String.prototype.isplit=function(t){var s=[],i=0,h;while(h=t.exec(this)){s.push(this.substring(i,t.lastIndex-h[0].length),h[0]);i=t.lastIndex}if(i<this.length)s.push(this.substring(i,this.length));return s};



/** Converts a string to title case using crude/basic English capitalisation rules. */
String.prototype.toTitleCase=function(){var t=function(t){var r={};for(var e in t)r[t[e]]=true;return r}("the a an and but or nor of to in on for with to".split(" ")),r=this.toLowerCase().replace(/\b(\w)(\w+)?/gi,function(r,e,n,o,i){if(n===undefined){return e.toUpperCase()}if(t[r]||"'"===i[o-1]&&/\w'$/.test(i.substring(o,0)))return r;return e.toUpperCase()+n}).replace(/\bi\b/g,"I");return r[0].toUpperCase()+r.slice(1)};



/** Wraps a string to a specified line length. */
String.prototype.wordWrap=function(t){for(var t=t||80,s=[],n,i,h=0,r=this.length;h<r;h+=t){var e=this.substring(h,h+t);if(-1!==(i=e.lastIndexOf("\n"))){s.push(e.substring(0,i+1));e=e.substring(i+1)}if(/\S/.test(this[h+t-1])&&(n=e.match(/\s(?=\S+$)/))){s.push(e.substr(0,h+t>this.length?this.length:n.index+1));h=h-(n.input.length-n.index)+1}else s.push(e)}return s};



/** Returns the number of words in a string. */
function wordCount(e){var r=e.replace(/[^\w-_]+/g," ").replace(/^\s+|\s+$/g,"").split(/\s+/g);return r[0]?r.length:0}



/** Executes a callback function on every text node found within an element's descendants. */
function walkTextNodes(e,o,l){l=l||0;for(var d=Array.prototype.slice.call(e.childNodes,0),t,N=d.length,r=0;r<N;++r){t=d[r];if(t.nodeType===Node.TEXT_NODE)o.call(this,t,l);else if(t.nodeType===Node.ELEMENT_NODE)walkTextNodes(t,o,l+1)}return e}


/**
 * Injects <wbr /> elements into any lengthy words found in each text node found within an element's descendants.
 *
 * @uses walkTextNodes
 * @param {Element} element - DOM element to operate on.
 * @param {Number} limit - Number of characters to traverse in a single word before inserting a breakpoint.
 */
function injectWordBreaks(e,t){walkTextNodes(e,function(e){var r=e;var a=".,+*?$|#{}()\\^\\-\\[\\]\\\\/!%'\"~=<>_:;\\s";var n=new RegExp("([^"+a+"]{"+t+"})","g");var o=[];while(n.exec(e.data))o.push(n.lastIndex);for(var s,c=o.length-1;c>=0;--c){s=e.splitText(o[c]);e.parentNode.insertBefore(document.createElement("wbr"),s)}})}



/** Strips any text nodes from the immediate descendants of an element. */
function pruneTextNodes(e,i){if(!e||!e.childNodes.length)return e;e.normalize();var t=e.lastChild,n=/^\s*$/;if(3===t.nodeType&&(!i||n.test(t.data))){e.removeChild(t);t=e.lastChild;if(!t)return e}while(t=t.previousSibling)if(3===t.nodeType&&(!i||n.test(t.data)))e.removeChild((t=t.nextSibling).previousSibling);return e}



/** Checks if the user agent is a particular version of Internet Explorer. */
function isIE(e,t){var n={"<":"lt ","<=":"lte ",">":"gt ",">=":"gte ","!=":"!"},i=document.createElement("div");i.innerHTML="<!--[if "+(n[t]||"")+"IE "+e+"]><i></i><![endif]-->";return i.getElementsByTagName("i").length}


/** Converts a camelCased string to its kebab-cased equivalent. */
function camelToKebabCase(e){if(!/^([a-z]+[A-Z])+[a-z]+$/.test(e))return e;return e.replace(/([a-z]+)([A-Z])/g,function(e,a,r){return a+"-"+r}).toLowerCase()}


/** Allow an easy way of triggering JavaScript callbacks based on a hash an anchor tag points to. */
function hashActions(e){var t,n=document.addEventListener||function(e,t){this.attachEvent("on"+e,t)};for(t in e)(function(e,t){for(var e=camelToKebabCase(e),a=document.querySelectorAll('a[href="#'+e+'"]'),c=a.length,l=0;l<c;++l)n.call(a[l],"click",function(e){e.preventDefault?e.preventDefault():e.returnValue=false;t.call(this,e);return false});if(document.location.hash==="#"+e)t()})(t,e[t])}



/** Get or set the value of a cookie with the designated name. */
function cookie(e,n,o){if(!e){var t=document.cookie.split(/;\s*/g),i={},r,s,u;for(s=0,u=t.length;s<u;++s)if(r=t[s].indexOf("="))i[t[s].substr(0,r)]=decodeURIComponent(t[s].substr(r+1));return i}if(undefined===n){t=document.cookie.split(/;\s*/g),r=e.length+1;for(var s=0,u=t.length;s<u;++s)if(e+"="===t[s].substr(0,r))return decodeURIComponent(t[s].substr(r));return null}else{o=o||{};if(null===n){n="";o.expires=-1}if(o.expires){var d=o.expires,d=(!d.toUTCString?new Date(Date.now()+864e5*d):d).toUTCString()}document.cookie=e+"="+encodeURIComponent(n)+(d?"; expires="+d:"")+(o.path?"; path="+o.path:"")+(o.domain?"; domain="+o.domain:"")+(o.secure?"; secure":"")}}



/** Wrapper for creating a new DOM element, optionally assigning it a hash of properties upon construction. */
function New(e,n){var t=document.createElement(e),c,f=function(e,n){for(c in n)if(Object(e[c])===e[c]&&Object(n[c])===n[c])f(e[c],n[c]);else e[c]=n[c]};if(n)f(t,n);return t}



/** Generates a base64-encoded 4x4-size PNG image of a designated RGBA value. */
function rgba(r,n,t,o){var x=String.fromCharCode,e=function(r,n){return Array(r+1).join(n||"\0")},a=function(r){return String.fromCharCode(r>>>24,r>>>16&255,r>>>8&255,255&r)},f="\x89PNG\15\12\32\12\0\0\0\15IHDR\0\0\0\4\0\0\0\4\10\6\0\0\0\xA9\xF1\x9E~\0\0\0O",u="IDAT\10\35\1D\0\xBB\xFF",c="\1"+x(r)+x(n)+x(t)+x(o)+e(12)+"\2"+e(2,e(16)+"\2")+e(16),h=a(function(r){for(var n=1,t=i=0,o=r.length,x=65521;o>i;++i)n=(n+r.charCodeAt(i))%x,t=(t+n)%x;return t<<16|n}(c)),C=a(function(r){for(var n=-1,t=0;t<r.length;++t)for(var o=256|r.charCodeAt(t);1!=o;o>>>=1)n=n>>>1^(1&(n^o)?3988292384:0);return~n}(u+c+h));return function(r){for(var n="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=5,x=8*r.length+5;x>o;o+=6)n+=t[(r.charCodeAt(~~(o/8)-1)<<8|r.charCodeAt(~~(o/8)))>>7-o%8&63];for(;n.length%4;n+="=");return n}(f+u+c+h+C+e(4)+"IEND\xAEB`\x82")}




/** Decodes a UTF-8 string into a stream of single-byte sequences. */
function UTF8Decode(e){for(var r=String.fromCharCode,e=e.replace(/\r\n/g,"\n"),n="",o,f=0,t=e.length;f<t;++f){o=e.charCodeAt(f);if(o<128)n+=r(o);else if(o>127&&o<2048)n+=r(o>>6|192)+r(o&63|128);else n+=r(o>>12|224)+r(o>>6&63|128)+r(o&63|128)}return n}

/** Encodes a sequence of single-byte characters as a UTF-8 string. */
function UTF8Encode(e){var r=c="",n=0,i=e.length,o="charCodeAt",t=String.fromCharCode;while(n<i){c=e[o](n);if(c<128){r+=t(c);++n}else if(c>191&&c<224){r+=t((c&31)<<6|e[o](n+1)&63);n+=2}else{r+=t((c&15)<<12|(e[o](n+1)&63)<<6|e[o](n+2)&63);n+=3}}return r}



/** Encodes a string using MIME Base64 */
function base64Encode(e){e=function(e){for(var r=String.fromCharCode,e=e.replace(/\r\n/g,"\n"),n="",o,t=0,a=e.length;t<a;++t){o=e.charCodeAt(t);if(o<128)n+=r(o);else if(o>127&&o<2048)n+=r(o>>6|192)+r(o&63|128);else n+=r(o>>12|224)+r(o>>6&63|128)+r(o&63|128)}return n}(e);for(var r="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o=5,t=e.length*8+5;o<t;o+=6)r+=n[(e.charCodeAt(~~(o/8)-1)<<8|e.charCodeAt(~~(o/8)))>>7-o%8&63];for(;r.length%4;r+="=");return r}



/** Decodes a base64-encoded string */
function base64Decode(e){var i=b=c=d=s="",n=String.fromCharCode,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e=e.replace(/[^A-Za-z0-9\+\/=]/g,""),f=0,t=e.length;while(f<t){i=r.indexOf(e[f++]),b=r.indexOf(e[f++]),c=r.indexOf(e[f++]),d=r.indexOf(e[f++]);s+=n(i<<2|b>>4);if(64!==c)s+=n((b&15)<<4|c>>2);if(64!==d)s+=n((c&3)<<6|d)}s=function(e){var i=c="",n=0,r=e.length,d="charCodeAt",f=String.fromCharCode;while(n<r){c=e[d](n);if(c<128){i+=f(c);++n}else if(c>191&&c<224){i+=f((c&31)<<6|e[d](n+1)&63);n+=2}else{i+=f((c&15)<<12|(e[d](n+1)&63)<<6|e[d](n+2)&63);n+=3}}return i}(s);return s}



/** Stops a function from firing too quickly. */
Function.prototype.debounce=function(t,e){var i=this,t=t<0?0:t,n,o,u,a,f=function(){var r=Date.now()-n;if(r>=t){if(!e)i.apply(o,u);if(a)clearTimeout(a);a=o=u=null}else a=setTimeout(f,t-r)};return function(){o=this,u=arguments;if(!t)return i.apply(o,u);n=Date.now();if(!a){if(e)i.apply(o,u);a=setTimeout(f,t)}}};
