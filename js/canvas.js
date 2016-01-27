CanvasRenderingContext2D.prototype.polygon = function(){
	var a = (1 === arguments.length) ? arguments[0] : arguments;
	this.beginPath();
	for(var i = 0; i < a.length; ++i)
		this.lineTo(a[i][0], a[i][1]);
	this.closePath();
	this.stroke();
	return this;
};


/** Return the context's current font style as readable properties. */
CanvasRenderingContext2D.prototype.getFontStyle = function(){
	var o, s, e = document.createElement("div");
	e.style.cssText = "font: "+this.font+" !important;";

	this.canvas.appendChild(e);
	s = window.getComputedStyle(e);
	o = {
		fontFamily:   s.fontFamily,
		fontSize:     s.fontSize,
		fontStyle:    s.fontStyle,
		fontVariant:  s.fontVariant,
		fontWeight:   s.fontWeight,
		lineHeight:   s.lineHeight
	};
	this.canvas.removeChild(e);
	return o;
};


/**
 * Draw a rectangular region of text.
 *
 * @param {String|Array} text - Textual content, expressed as either a string or an array of substrings representing each word.
 * @param {Number} x - X ordinate of the textarea.
 * @param {Number} y - Y ordinate of the textarea.
 * @param {Number} w - Textarea's width
 * @param {Number} h - Textarea's height
 * @param {Number} leading - Multiplier adjusting the textarea's line height. 1.5 is approximately equal to 1.5em, etc. Default: 1
 * @param {Number} indent - Leading indentation to be applied to the first line. Defaults to 0.
 *
 * @return {Object} A hash containing the following properties:
 *  x, y: Coordinates that the textarea last finished drawing text (relative to the canvas object).
 *  remainder: An array of remaining words that couldn't fit within the designated textarea (if any).
 */
CanvasRenderingContext2D.prototype.textArea = function(text, x, y, w, h, leading, indent){
	var words   = text instanceof Array ? text : text.split(/\b(?=\S)|(?=\s)/g),
	font        = this.getFontStyle(),
	baseline    = this.textBaseline,
	rowLength   = (indent || 0),
	totalHeight = 0,
	fontSize    = parseInt(font.fontSize),
	leading     = (leading || 1) * fontSize,
	m, i, diff, s, breakPoint, w_l, w_r;

	this.textBaseline = "top";
	for(i = 0; i < words.length; ++i){

		/** Newline: don't bother measuring, just increase the total height. */
		if("\n" === words[i]){
			rowLength    = 0;
			totalHeight += leading;

			/** If the newline's pushed the rest of the text outside the drawing area, abort. */
			if(totalHeight + leading >= h) return {
				x: rowLength   + x,
				y: totalHeight + y,
				remainder: words.slice(i)
			}
			continue;
		}


		/** Strip any leading tabs */
		if(!rowLength && /^\t+/.test(words[i]))
			words[i] = words[i].replace(/^\t+/, "");


		m = this.measureText(words[i]).width;

		/** This is one honkin' long word, so try and hyphenate it. */
		if((diff = w - m) <= 0){
			diff = Math.abs(diff);

			/** Figure out which end of the word to start measuring from. Saves a few extra cycles in an already heavy-duty function. */
			if(diff - w <= 0) for(s = words[i].length; s; --s){
				if(w > this.measureText(words[i].substr(0, s) + "-").width + fontSize){
					breakPoint = s; break;
				}
			}

			else for(s = 0; s < words[i].length; ++s){
				if(w < this.measureText(words[i].substr(0, s+1) + "-").width + fontSize){
					breakPoint = s; break;
				}
			}

			if(breakPoint){
				w_l = words[i].substr(0, s+1) + "-";
				w_r = words[i].substr(s+1);

				words[i] = w_l;
				words.splice(i+1, 0, w_r);
				m   = this.measureText(w_l).width;
			}
		}


		/** If there's no more room on the current line to fit the next word, start a new line. */
		if(rowLength > 0 && rowLength + m >= w){

			/** We've run out of room. Return an array of the remaining words we couldn't fit. */
			if(totalHeight + leading*2 >= h) return {
				x: rowLength   + x,
				y: totalHeight + y,
				remainder: words.slice(i)
			};

			rowLength    = 0;
			totalHeight += leading;

			/** If the current word is just a space, don't bother. Skip (saves a weird-looking gap in the text) */
			if(" " === words[i]) continue;
		}


		/** Write another word and increase the total length of the current line. */
		this.fillText(words[i], rowLength+x, totalHeight+y);
		rowLength += m;
	}

	/** Restore the context's text baseline property */
	this.textBaseline = baseline;
	return {x: rowLength+x, y: totalHeight+y, remainder:[]};
};



/** Draws a DOM element to the canvas. Not supported on IE9. */
CanvasRenderingContext2D.prototype.drawHTML = function(node){
	
	/** Parse the node's HTML content as well-parsed XHTML (needed to pass it through SVG). */
	var doc     = document.implementation.createHTMLDocument("");
	doc.write(node.outerHTML);
	doc.documentElement.setAttribute("xmlns", doc.documentElement.namespaceURI);
	var html    = (new XMLSerializer).serializeToString(doc);


	var $this   = this;

	/** Begin compiling our SVG markup. */
	var d       = '<svg xmlns="http://www.w3.org/2000/svg" width="' + this.canvas.width + '" height="' + this.canvas.height + '">' +
		'<foreignObject width="100%" height="100%">' +
			'<div xmlns="http://www.w3.org/1999/xhtml" style="' + window.getComputedStyle(node).cssText + '">' +
				markup +
			'</div>' +
		'</foreignObject>' +
	'</svg>';

	/** "Blobify" our SVG markup. */
	var fnURL   = self.URL || self.webkitURL || self;
	var blob    = new Blob([d], {type:"image/svg+xml;charset=utf-8"}),
	var url     = fnURL.createObjectURL(blob);


	/** Construct a new image */
	img         = new Image(),
	img.onload  = function(){
		$this.drawImage(img, 0, 20);
		fnURL.revokeObjectURL(url);
	};
	img.src     = url;
};
