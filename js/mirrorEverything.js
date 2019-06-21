// Author GroxicTinch
document.getElementById("main").innerHTML = "Mirror Code Loaded";
document.getElementById("main").style = "color: limegreen; text-align: center;";
document.getElementById("log").value = "";
msg("Awaiting input", "ready");

/*  0 = X, 1 = Y, 2 = Z
    10 = Swap all words "right" to "left" and vice-versa
    20 = Swamp given leftword with rightword
    -100 = Update to version on the server
 */
var anylandRequestType = -1;  
var wordLeft = "";
var wordRight = "";

// Anyland Commands START
// When ... then tell web MESSAGE
function AnylandTold(data, isAuthority) {
  var test = data.substring(0,10);
  if(isAuthority) {
    anylandRequestType = -1;
    if(data == "mirrorx") {
      anylandRequestType = 0;
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "mirrory") {
      anylandRequestType = 1;
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "mirrorz") {
      anylandRequestType = 2;
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "mirrorleftright") {
      anylandRequestType = 10
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data.substring(0,9) == "wordleft " && data.length >= 9) {
      wordLeft = data.substring(9);
    } else if(data.substring(0,10) == "wordright " && data.length >= 10) {
      wordRight = data.substring(10);
    } else if(data == "swapwords" && wordLeft != "" && wordRight != "") {
      // Thank you to Koolala for the suggestion of allowing the user to specify words :)
      anylandRequestType = 20
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "updatetool") {
      anylandRequestType = -100;
      AnylandRequestThing();
    }
  } else {
    msg("Unauthorized user attempt", "noauth");
  }
}

function AnylandGetThing(json) {
  if(anylandRequestType >= 0 && anylandRequestType <= 2) {
    mirror(json);
  } else if(anylandRequestType == 10) {
    mirrorLeftRight(json);
  } else if(anylandRequestType == 10) {
    mirrorWords(json, wordLeft, wordRight);
  } else if(anylandRequestType == -100) {
    startUpdate(json, "mirrortool", "mirrortool");
  }
}
// Anyland Commands END

function mirror(json) {
  var dirString = "";
  if(anylandRequestType == 0) {dirString = "x"}
  else if(anylandRequestType == 1) {dirString = "y"}
  else if(anylandRequestType == 2) {dirString = "z"}

  msg("Progress: Mirroring " + dirString, "mirroring" + dirString);
  if(json == "") {
    msg("Progress: Aborted, no json", "abort");
    details("User is not editing an object, Aborted");
  } else {
    var JSONobj = JSON.parse(json);
    details("Thing JSON successfully loaded into object");

    if(anylandRequestType >= 0) {
      var parti;
      for(parti = 0; parti < JSONobj["p"].length; parti++) {
        var statei;
        for(statei = 0; statei < JSONobj["p"][parti]["s"].length; statei++) {
          JSONobj["p"][parti]["s"][statei]["p"][anylandRequestType] *= -1;
          JSONobj["p"][parti]["s"][statei]["r"][anylandRequestType+1 % 3] *= -1;
          JSONobj["p"][parti]["s"][statei]["r"][anylandRequestType+2 % 3] *= -1;
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