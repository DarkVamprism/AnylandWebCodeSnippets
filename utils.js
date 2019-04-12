// Utils
function msg(message, tell) {
  document.getElementById("progress").innerHTML = message;
  sendTell(tell);
}

function details(message) {
  document.getElementById("log").value += message + "\n";
}

function sendTell() {
  if (window.AnylandTell) {
    AnylandTell("some string");
  }
}

function swapWords(inString, wordLeft, wordRight) {
  inString = replaceAll(inString, wordLeft, "TEMP");
  inString = replaceAll(inString, wordRight, wordLeft);
  inString = replaceAll(inString, "TEMP", wordRight);

  return inString;
}

function replaceAll(inString, replaceWhat, replaceTo){
  // Solution found here at https://stackoverflow.com/a/17820079
  replaceWhat = replaceWhat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  var re = new RegExp(replaceWhat, 'g');

  return inString.replace(re,replaceTo);
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function AnylandSetThing(json) {
  details("AnylandSetThing Called");
}