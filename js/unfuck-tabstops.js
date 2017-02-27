"use strict";

/**
 * @file Source for a bookmarklet I run before bothering to read most
 * JavaScript on GitHub. Replaces 2-space tabstops with tabs rendered
 * at 4 columns.
 */


/**
 * Replace soft-tabs with the superior/logical alternative.
 *
 * @param {String} [selector]
 * @param {Number} [width=2]
 */
function unfuckTabstops(){
	const regexp = new RegExp(`(^|\\n)((?:${" ".repeat(width)})+)`, "g");
	for(const block of document.querySelectorAll(selector)){
		for(const node of collectTextNodes(block)){
			const {data} = node;
			const fixed = data.replace(regexp, (_, nl, crap) => {
				return nl + "\t".repeat(crap.length / width);
			});
			if(fixed !== data)
				node.data = fixed;
		}
	}
}


// Copy+pasta bookmarklet
javascript:(function(w,T,s){const D=document,A=e=>{const N=[];for(const n of e.childNodes)switch(n.nodeType){case 3:N.push(n);break;case 1:N.push(...A(n))}return N},B=e=>{const r='([^.,+*?$|#{}()\\^\\-\\[\\]\\\\\/!%\'"~=<>_:;\\s]{80})',i=[];for(const n of A(e)){const s=new RegExp(r,"g"),b=[];while(s.exec(n.data))b.push(s.lastIndex);for(const B of b.reverse()){const o=n.splitText(B);i.push(n.parentNode.insertBefore(D.createElement("wbr"),o))}}return i},r=new RegExp(`(^|\\n)((?: {${w}})+)`,"g");for(const e of D.all)e.style.tabSize=T;for(const b of D.querySelectorAll(s)){for(const n of A(b)){const d=n.data,f=d.replace(r,(_,n,c)=>n+"\t".repeat(c.length/w));if(f!==d)n.data=f}}}
(     2,  4,     ".highlight > pre, table.highlight td.blob-num + .blob-code"));
/*
│     ↑ │ ↑    │                 ↑                │
│  FROM │ TO   │ CSS SELECTOR FOR STUFF TO UNFUCK │
├───────┴──────┼──────────────────────────────────┘
│  TAB-SIZES   │
└──────────────┘
*/
