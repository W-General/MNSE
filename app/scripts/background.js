'use strict';

var timeToken;
//var result;
var accToken;

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});


function getToken(callback) {
	var timeNow = new Date();

	if (!timeToken || timeNow-timeToken > 600000) {
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

				accToken = token.access_token;
				callback(accToken);
			}
		}
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(request);
	}
	else {
		callback(accToken);
	}
}

function translate(text, callback) {
	getToken(function(token){
			var from = "en", to = "zh-TW";
			var request = "http://api.microsofttranslator.com/v2/Http.svc/Translate?text=" + encodeURIComponent(text) + "&from=" + from + "&to=" + to;
			var authToken = "Bearer " + token;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", request, true);
			xhr.setRequestHeader("Authorization", authToken);
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4 && xhr.status == 200) {
					var response = xhr.responseText;
					var response_parse_half = response.substring(response.indexOf(">")+1);
					var translated = response_parse_half.substring(0, response_parse_half.indexOf("<"));
					callback(translated);
				}
			}
			xhr.send();
		}
	);
	
}

function breakup(request, callback) {
	var words = request.text.split(" ");
	var sum = (1+words.length)*words.length/2;
	var accum = 0;
	for(var i=0; i < words.length;i++){
		(function(i){
			translate(words[i], function(translated){
			words[i] = translated;
			accum = accum+i+1;
			if(accum == sum) {
				callback(words.join(" "));
			}
			});	
		})(i);
	}
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	breakup(request, function(words){
  		console.log(words);
  		sendResponse({text: words});
  	});
  	return true;
  }
);