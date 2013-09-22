'use strict';

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
      console.log("<3333 : " + word);
      return false;
    }
  }
  return true;
}

//communication
chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	//console.log(request.text);
  	var words = request.text.split(" ");
  	for (var i = 0; i < words.length; i++) {
      if (is_english(words[i]) && !known_words[stemmer(words[i])]) {
        //translate
        console.log(words[i]);
        words[i] = words[i] + "!!!!!!!!";
      }
  	}
  	//console.log(words.join(" "));
    sendResponse({text: words.join(" ")});
  }
);


