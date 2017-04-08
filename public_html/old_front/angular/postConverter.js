var postConverter = function(obj){
	var result = "";
	var keys = Object.keys(obj);
	for (var i = 0; i < keys.length; i++){
		result+=keys[i]+"="+obj[keys[i]];
		if (i<keys.length - 1) result += "&";
	}
	return result;
};