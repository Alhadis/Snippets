function autoFill(){
	var auto	= {
		"first-name":		"John",
		"last-name":		"Gardner",
		"surname":			"Gardner",
		"dob-day":			18,
		"dob-month":		"03",
		"dob-year":			1987,
		"dob":				"1987-03-18",
		"city":				"Melbourne",
		"locality":			"Melbourne",
		"postcode":			3717,
		"region":			"VIC",
		"business-name":	"Offline Square Analogue",
		"street-address":	"65 Lotus Crescent",
		"phone-number":		"(02) 6056 5455",
		"email-address":	"test@domain.com",
		"answer":			"Lorem ipsum dolor sit amet",
		"caption":			"Eiusmod quis ipsum proident dolor",
		"invoice-number":	781676020027,
		"accepted-terms":	true
	}, i, j, field;

	for(i in auto){

		[i, i.replace(/-/g, "_"), i.replace(/-([a-z])/g, function(s,i){ return i.toUpperCase() })].forEach(function(j){
			if((field = document.getElementById(j)) || (field = document.querySelector("input[name='"+j+"']"))){
				if("checkbox" === field.type)
					 field.checked	= !!auto[i];
				else field.value	= auto[i];

				if("SELECT" === field.tagName && !field.value){
					var optval	=	Array.prototype.map.call(field.options, function(s){ return s.value || null }).filter(function(i){ return !!i });
					field.value	=	optval[ Math.round(Math.random() * (optval.length - 1)) ];
				}
			}
		});
	}
}
autoFill();
