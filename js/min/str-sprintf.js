/** Format a string using one or more values. */
String.prototype.sprintf=function(){var e="",i,t,n,s,r=0,f=0,o=/%(?=[-+%\d\$bcdeEfFgGosuxX]|(?: |0|'.))(\d+\$)?([-+]*)( |0|'.)?([-+]*)(\d+)?(\.\d+)?([%bcdeEfFgGosuxX])?/g;while(i=o.exec(this)){var d=i[0],a=i[1],g=(i[2]||"")+(i[4]||""),l=g.indexOf("+")>=0,p=g.indexOf("-")>=0,u=i[3]||" ",h=i[5]||0,x=i[6],c=i[7],n="";if("'"===u.charAt(0))u=u.charAt(1);if(x&&x.length>1)x=x.substr(1);if(i.index)e+=this.substring(f,i.index);f=i.index+d.length;if(undefined===a){t=arguments[r];++r}else{t=arguments[parseInt(a)-1];if(undefined===t)t=""}if("%"===c)e+="%";else if("s"===c){n=String(t);if(x)n=n.substr(0,x)}else if(/[ducoxXb]/.test(c)){n=parseInt(t)||0;if(p&&"0"===u)u=" ";if("d"===c)n=(l&&n>=0?"+":"")+n.toString();else if("u"===c)n=parseInt(n)>>>0;else if("c"===c){e+=String.fromCharCode(parseInt(n));continue}else if("o"===c)n=n.toString(8);else if("x"===c||"X"===c){n=parseInt(n).toString(16);if("X"===c)n=n.toUpperCase()}else if("b"===c)n=(n>>>0).toString(2)}else{n=parseFloat(t)||0,x=x||6,l=l&&n>=0?"+":"";if("f"===c||"F"===c)n=n.toFixed(x);else if("e"===c||"E"===c)n=n.toExponential(x),n="E"===c?n.toUpperCase():n.toLowerCase();else if("g"===c||"G"===c)n=n.toPrecision(x).replace(/^(\d+(?=[\.\d]+))((?:\.0+)|(?:(\.\d*[1-9]+)(0+)))$/m,"$1$3");n=l+n}n=String(n);if(n.length<h){n=[Array(h-n.length+1).join(u),n],n=(p?n.reverse():n).join("")}e+=n}if(f<this.length)e+=this.substr(f);return e};