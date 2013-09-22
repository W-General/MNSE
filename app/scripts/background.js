'use strict';

var timeToken;

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});



chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		var result;
		getToken(request);
		console.log(result);
		//sendResponse(result);
	}
);


function getToken(text) {
	var timeNow = new Date();
	if (timeNow-timeToken > 600000) {
		var client_id = "msne";
		var client_secret ="Y0bN/QOAUerNYpqBAgao2MJzD/uBplfth5P7XrqiwQo=";
		var scope = "http://api.microsofttranslator.com";
		var grant_type = "client_credentials";
		var request = "client_id=msne&client_secret="+encodeURIComponent(client_secret)+"&scope="+encodeURIComponent(scope)+"&grant_type=client_credentials";
		var token;
		var xhr = new XMLHttpRequest();

		xhr.open("POST", "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13", true);
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4 && xhr.status==200) {
				token = JSON.parse(xhr.responseText);
				timeToken = new Date();
				translate(text,token.access_token);
			}
		}
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(request);
	}
}

function translate(text, token) {
	var from = "en", to = "zh-TW";
	var request = "http://api.microsofttranslator.com/v2/Http.svc/Translate?text=" + encodeURIComponent(text) + "&from=" + from + "&to=" + to;
	console.log(request);
	var authToken = "Bearer " + token;
	console.log(authToken);
	var xhr = new XMLHttpRequest();
	xhr.open("GET", request, true);
	xhr.setRequestHeader("Authorization", authToken);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200) {
			var response = xhr.responseText;
			var response_parse_half = response.substring(response.indexOf(">")+1);
			result = response_parse_half.substring(0, response_parse_half.indexOf("<"));
		}
	}
	xhr.send();
}