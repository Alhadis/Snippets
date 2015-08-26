#!/usr/local/bin/phantomjs
"use strict";

var webpage	= require("webpage"), page,
	system	= require("system"),
	rotate	= false,
	url,
	width,
	height,
	size,
	presetID,
	output,

presets = {
	kindle:			[2560,	1600,	"Amazon Kindle Fire HDX"],
	cinema:			[2560,	1600,	"Apple 30\" Cinema Display"],
	ultrasharp:		[1920,	1200,	"Dell UltraSharp U2412M 24\" Monitor"],
	ipad:			[1024,	768,	"Apple iPad"],
	iphone4:		[320,	480,	"Apple iPhone 4"],
	iphone5:		[320,	568,	"Apple iPhone 5"],
	iphone6:		[375,	667,	"Apple iPhone 6"],
	"iphone6+":		[414,	736,	"Apple iPhone 6 Plus"],
	macbook:		[1680,	1050,	"Apple MacBook Pro 15-inch"],
	playbook:		[1024,	600,	"BlackBerry PlayBook"],
	blackberry:		[360,	640,	"BlackBerry Z30"],
	nexus4:			[384,	640,	"Google Nexus 4"],
	nexus5:			[360,	640,	"Google Nexus 5"],
	nexus6:			[412,	732,	"Google Nexus 6"],
	nexus7:			[960,	600,	"Google Nexus 7"],
	nexus10:		[1280,	800,	"Google Nexus 10"],
	optimus:		[384,	640,	"LG Optimus L70"],
	"hd-laptop":	[1440,	900,	"Laptop: HiDPI"],
	"md-laptop":	[1280,	800,	"Laptop: MDPI"],
	"touch-laptop":	[1280,	950,	"Laptop: Touch"],
	lumia:			[320,	533,	"Nokia Lumia 520"],
	n9:				[360,	640,	"Nokia N9"],
	note:			[360,	640,	"Samsung Galaxy Note"],
	galaxy:			[360,	640,	"Samsung Galaxy"]
};


function log(obj){
	console.log("object" === typeof obj || "function" === typeof obj ?
		JSON.stringify(obj, null, 4) : obj
	);
}

function usage(status){
	var filename	=	system.args[0].split(/^([^\/#\?]*:?\/\/)?(\/?(?:[^\/#\?]+\/)*)?([^\/#\?]+)?(?:\/(?=$))?(\?[^#]*)?(#.*)?$/) || "capture-webpage",
		cmd			=	filename[3].replace(/(\.js)?$/i, "");
	console.info("Usage: "+ cmd + " [-r | --rotate] <url> [<width> <height> | <preset>] [<format>]\n\
\n\
Parameters:\n\
    -h | --help     Print this help message and exit.\n\
    -r | --rotate   If passed, will rotate <width> and <height>\n\
    url             URL to capture a screenshot of.\n\
    width           Viewport width (default=320)\n\
    height          Viewport height (default=480)\n\
    preset          Preset device dimensions to use\n\
    format          File format to render to: png, gif, jpeg, pdf (default=png)\n\
\n\
Presets:\n\
    kindle          2560×1600     Amazon Kindle Fire HDX\n\
    cinema          2560×1600     Apple 30\" Cinema Display\n\
    ultrasharp      1920×1200     Dell UltraSharp U2412M 24\" Monitor\n\
    ipad            1024×768      Apple iPad\n\
    iphone4         320×480       Apple iPhone 4\n\
    iphone5         320×568       Apple iPhone 5\n\
    iphone6         375×667       Apple iPhone 6\n\
    iphone6+        414×736       Apple iPhone 6 Plus\n\
    macbook         1680×1050     Apple MacBook Pro 15-inch\n\
    playbook        1024×600      BlackBerry PlayBook\n\
    blackberry      360×640       BlackBerry Z30\n\
    nexus4          384×640       Google Nexus 4\n\
    nexus5          360×640       Google Nexus 5\n\
    nexus6          412×732       Google Nexus 6\n\
    nexus7          960×600       Google Nexus 7\n\
    nexus10         1280×800      Google Nexus 10\n\
    optimus         384×640       LG Optimus L70\n\
    hd-laptop       1440×900      Laptop: HiDPI\n\
    md-laptop       1280×800      Laptop: MDPI\n\
    touch-laptop    1280×950      Laptop: Touch\n\
    lumia           320×533       Nokia Lumia 520\n\
    n9              360×640       Nokia N9\n\
    note            360×640       Samsung Galaxy Note\n\
    galaxy          360×640       Samsung Galaxy\n\
\n\
Examples:\n\
    $ "+cmd+" http://google.com/ 1024 768 jpg\n\
    $ "+cmd+" http://google.com/ 1024x768       # Expands to 1024 768\n\
    $ "+cmd+" http://google.com/ 600            # Equal to 600x600\n\
");
	phantom.exit(status);
}


/** Parse command-line options */
for(var a, args = system.args, i = 0, l = args.length; i < l; ++i){
	a	=	args[i];


	/** -r: Rotate flag */
	if("-r" === a || "--rotate" === a){
		rotate = true;
		args.splice(i, 1);
		--i;
		--l;
		continue;
	}


	/** -o: Output filename */
	if("-o" === a || "--output" === a){
		if(!(args[i+1] || "").trim())
			usage(true);
		output = args[i+1];
		i -= 2;
		l -= 2;
		continue;
	}


	/** -h: Help */
	if("-h" === a || "--help" === a)
		usage();


	switch(i){
		case 1:	url		=	a;	break;
		case 2:	width	=	a;	break;
		case 3:	height	=	a;	break;
		case 4: format	=	a;	break;
	}


	if(width){

		/** Preset specified? */
		if(presets[width]){
			presetID	=	width;
			size		=	presets[presetID];
			width		=	size[0];
			height		=	size[1];
		}

		else{
			size	=	width.toString().split(/[x×]+/);
			width	=	size[0];
			height	=	height || size[1] || size[0];
		}
	}
}


/** Swap height/width specs if --rotate was passed */
if(rotate){
	a			=	width;
	width		=	height;
	height		=	a;
}

/** Normalise width and height, resorting to defaults if needed */
width	=	(+width) || 320;
height	=	(+height) || 480;

/** No URL? Tell 'em to smarten up. */
if(!url) usage(1);



page = webpage.create();

/** Prepare the viewport and output dimensions */
page.zoomFactor		= 1;
page.paperSize		=
page.viewportSize	= {width: width, height: height};


/** Load and render the page */
page.open(url, function(status){
	var orientation	=	width == height ? "" : (width < height ? "-portrait" : "-landscape");
	var filename	=	output ? output : ((presetID ? presetID + orientation : "")+".pdf");
	var size = page.evaluate(function(){
		document.documentElement.style.backgroundColor = "#fff";
		return [window.innerWidth, window.innerHeight].join(",");
	}).split(/,/);

	page.render(filename, {quality: "100"});
	phantom.exit();
});
