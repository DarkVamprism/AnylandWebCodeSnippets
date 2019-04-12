// Author GroxicTinch
document.getElementById("main").innerHTML = "Mirror Code Loaded";
document.getElementById("main").style = "color: limegreen; text-align: center;";
document.getElementById("log").value = "";
msg("Awaiting input", "ready");

/*  0 = X, 1 = Y, 2 = Z
    10 = Swap all words "right" to "left" and vice-versa
    20 = Swamp given leftword with rightword
 */

var mirrorDir = -1;  
var wordLeft = "";
var wordRight = "";

// Anyland Commands START
// When ... then tell web MESSAGE
function AnylandTold(data, isAuthority) {
  if(isAuthority) {
    mirrorDir = -1;
    if(data == "mirrorx") {
      mirrorDir = 0;
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "mirrory") {
      mirrorDir = 1;
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "mirrorz") {
      mirrorDir = 2;
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "mirrorleftright") {
      mirrorDir = 10
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data.substring(1,9) == "wordleft " && data.length >= 10) {
      wordLeft = data.substring(10);
    } else if(data.substring(1,10) == "wordright " && data.length >= 11) {
      wordRight = data.substring(11);
    } else if(data == "swapwords" && wordLeft != "" && wordRight != "") {
      // Thank you to Koolala for the suggestion of allowing the user to specify words :)
      mirrorDir = 20
      AnylandRequestThing(); // This calls AnylandGetThing
    }
  } else {
    msg("Unauthorized user attempt", "noauth");
  }
}

function AnylandGetThing(json) {
  if(mirrorDir >= 0 && mirrorDir <= 2) {
    mirror(json);
  } else if(mirrorDir == 10){
    mirrorLeftRight(json);
  } else if(mirrorDir == 10){
    mirrorWords(json, wordLeft, wordRight);
  }
}
// Anyland Commands END

function mirror(json) {
  var dirString = "";
  if(mirrorDir == 0) {dirString = "x"}
  else if(mirrorDir == 1) {dirString = "y"}
  else if(mirrorDir == 2) {dirString = "z"}

  msg("Progress: Mirroring " + dirString, "mirroring" + dirString);
  if(json == "") {
    msg("Progress: Aborted, no json", "abort");
    details("User is not editing an object, Aborted");
  } else {
    var JSONobj = JSON.parse(json);
    details("Thing JSON successfully loaded into object");

    if(mirrorDir >= 0) {
      var parti;
      for(parti = 0; parti < JSONobj["p"].length; parti++) {
        var statei;
        for(statei = 0; statei < JSONobj["p"][parti]["s"].length; statei++) {
          JSONobj["p"][parti]["s"][statei]["p"][mirrorDir] *= -1;
          JSONobj["p"][parti]["s"][statei]["r"][mirrorDir+1 % 3] *= -1;
          JSONobj["p"][parti]["s"][statei]["r"][mirrorDir+2 % 3] *= -1;
        }
      }
    }

    msg("Progress: Mirroring Complete", "mirrorComplete");
    details("Saving changes");

    AnylandSetThing(JSON.stringify(JSONobj));

    return true;
  }
  return false;
}

function mirrorLeftRight(json) {
  return mirrorWords(json, "left", "right");
}

function mirrorWords(json, wordLeft, wordRight) {
  msg("Progress: Swapping words '" + wordLeft + "' and '" + wordRight + "'");
  if(json == "") {
    msg("Progress: Aborted, no json", "abort");
    details("User is not editing an object, Aborted");
  } else {
    var JSONobj = JSON.parse(json);
    details("Thing JSON successfully loaded into object");

    var parti;
    for(parti = 0; parti < JSONobj["p"].length; parti++) {
      var statei;
      for(statei = 0; statei < JSONobj["p"][parti]["s"].length; statei++) {
        var scripti;
        if(JSONobj["p"][parti]["s"][statei].hasOwnProperty("b")) {
          for(scripti = 0; scripti < JSONobj["p"][parti]["s"][statei]["b"].length; scripti++) {
            JSONobj["p"][parti]["s"][statei]["b"][scripti] = swapWords(JSONobj["p"][parti]["s"][statei]["b"][scripti], wordLeft, wordRight);
          }
        }
      }
    }

    msg("Progress: Mirroring Complete", "mirrorComplete");
    details("Saving changes");

    AnylandSetThing(JSON.stringify(JSONobj));

    return true;
  }
  return false;
}

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

function AnylandSetThing(json) {
  details("AnylandSetThing Called");
}

