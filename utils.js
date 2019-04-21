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

// Auto-Update Function
function checkUpdate(toolName, fileName) {
  // [TODO]
}

function startUpdate(json, toolName, fileName) {
  msg("Progress: Updating gt_"+ toolName, "updating");
  if(json == "") {
    msg("Progress: Update Aborted", "abort");
    details("User is not editing an object, Update Aborted")
  } else {
    var JSONobj = JSON.parse(json);
    details("JSON successfully loaded into object");

    if(JSONobj["n"] == "gt_"+ toolName) {
      msg("Progress: gt_"+ toolName +" Updated", "updated");
      details("JSON downloaded into object");
      AnylandSetThing(Get("./json/" + fileName));
    } else {
      msg("Progress: Updating Failed", "abort");
      details("For safety only things called 'gt_"+ toolName +"' may be updated");
    }
  }
}