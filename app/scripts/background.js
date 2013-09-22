'use strict';
var timeToken;
var known_words = {}
// read in high school word list
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
    if (xhr.readyState != 4)
        return;
    var w = JSON.parse(xhr.responseText);
    for (var i in w.words) {
      //console.log(w.words[i]);
      known_words[stemmer(w.words[i])] = 1;
    }
    //  console.log(known_words);
}
xhr.open("GET", chrome.extension.getURL('/words/highschool.json'), true);
xhr.send();


// read in 4 level word list
xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
    if (xhr.readyState != 4)
        return;
    var w = JSON.parse(xhr.responseText);
    for (var i in w.words) {
      //console.log(w.words[i]);
      known_words[stemmer(w.words[i])] = 1;
    }
    //  console.log(known_words);
}
xhr.open("GET", chrome.extension.getURL('/words/4level.json'), true);
xhr.send();



//see if it's english word
function is_english(word) {
  for (var i = 0; i < word.length; i ++) {
    if ((word[i] >= 'a' && word[i] <= 'z') ||
      (word[i] >= 'a' && word[i] <= 'z')) {
    } else {
      return false;
    }
  }
  return true;
}

//communication

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});


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
  var result;
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


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    getToken(request);
  	var words = request.text.split(" ");
  	for (var i = 0; i < words.length; i++) {
      if (is_english(words[i]) && !known_words[stemmer(words[i])]) {
        //translate
        console.log(words[i]);
        words[i] = words[i] + " " + getToken(words[i]);
      }
  	}
  	//console.log(words.join(" "));
    sendResponse({text: words.join(" ")});
  }
);


