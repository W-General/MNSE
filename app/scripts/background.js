'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	//console.log(request.text);
  	var words = request.text.split(" ");
  	for (var i = 0; i < words.length; i++) {
  		words[i] = "!" + words[i];
  	}
  	console.log(words.join(" "));
    sendResponse({text: words.join(" ")});
  }
);