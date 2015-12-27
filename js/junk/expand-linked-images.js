(function(doc){
	doc.documentElement.innerHTML = doc.documentElement.innerHTML.replace(/<a href="([^"]+)"[^>]*>[^<]+<\/a>/gi, '<img src="$1" alt="" />');
	[].forEach.call(doc.images, function(e){
		e.addEventListener("error", function(e){
			console.log("Removing broken image", e.target);
			e.target.parentNode.removeChild(e.target);
		});
	});
}(document));
