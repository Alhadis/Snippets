function autoFill(){
	var auto	=	{
		"first-name":		"John",
		"last-name":		"Gardner",
		"dob-day":			18,
		"dob-month":		"03",
		"dob-year":			1987,
		"city":				"Melbourne",
		"locality":			"Melbourne",
		"postcode":			3717,
		"region":			"VIC",
		"street-addr":		"65 Lotus Crescent",
		"phone-number":		"(02) 6056 5455",
		"email-addr":		"test@domain.com",
		"answer":			"Lorem ipsum dolor sit amet",
		"accepted-terms":	true
	}, i, field;

	for(i in auto){
		
		if(field = document.getElementById(i)){
			if("checkbox" === field.type)
					field.checked	=	!!auto[i];
			else	field.value		=	auto[i];
		}
	}
}
autoFill();
