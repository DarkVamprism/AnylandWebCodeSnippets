// Author GroxicTinch
var showDebug = true;

document.getElementById("main").innerHTML = "MannyCode Loaded";
document.getElementById("main").style = "color: limegreen; text-align: center;";
msg("Awaiting input", "ready");

var savingData = false;
var loadDataObj = {};

// Anyland Commands START
// When ... then tell web MESSAGE
function AnylandTold(data, isAuthority) {
  if(isAuthority) {
    if(data == "savemanny") {
      savingData = true;
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "loadmanny") {
      savingData = false;
      AnylandRequestThing(); // This calls AnylandGetThing
    }
  } else {
    msg("Unauthorized user attempt", "noauth");
  }
}

function AnylandGetThing(json) {
  if(savingData) {
    saveManny(json);
  } else {
    loadManny(json);
  }
}
// Anyland Commands END

function saveManny(json) {
  msg("Progress: Stage A - Saving Private Manny", "stagea");
  if(json == "") {
    msg("Progress: Stage A Aborted", "abort");
    details("User is not editing an object, Stage A Aborted");
  } else {
    var JSONobj = JSON.parse(json);
    details("Manny Thing JSON successfully loaded into object");
    document.getElementById("debugjsonin").value = json;

    details("Processing Right Arm");
    var armRight = processBodyPart(JSONobj["p"][1], JSONobj["p"][0]["i"][0]); // Right Arm
    details("Processing Left Arm");
    var armLeft = processBodyPart(JSONobj["p"][2], JSONobj["p"][0]["i"][1]); // Left Arm
    /*details("Processing Head");
    var head = processBodyPart(JSONobj["p"][3], JSONobj["p"][0]["i"][2]); // Head*/

    loadDataObj = {};
    if(armRight != null) {
      loadDataObj.ar = {};
      loadDataObj["ar"]["i"] = armRight["t"];
      loadDataObj["ar"]["p"] = armRight["p"];
      loadDataObj["ar"]["r"] = armRight["r"];
    }
    if(armLeft != null) {
      loadDataObj.al = {};
      loadDataObj["al"]["i"] = armLeft["t"];
      loadDataObj["al"]["p"] = armLeft["p"];
      loadDataObj["al"]["r"] = armLeft["r"];
    }
    //if(head != null) {
      //loadDataObj["h"]["i"] = head["t"];
      //loadDataObj["h"]["p"] = head["p"];
      //loadDataObj["h"]["r"] = head["r"];

      // Until I find a way to set the head to a sub-thing ill just make it so the object is done by centering the object
      loadDataObj.h = {};
      loadDataObj.h.p = [0,0,0];
      loadDataObj.h.r = [0,0,0];
    //}

    msg("Progress: Stage B - Waiting for user to edit head then click button", "stageb");
    details("Save successful, waiting for user to load");
    return true;
  }
  return false;
}

function loadManny(json) {
  msg("Progress: Stage C - Loading Manny, its all in his head", "stageC");
  if(json == "") {
    msg("Progress: Stage C Aborted", "abort");
    details("User is not editing an object, Stage C Aborted")
  } else {
    var JSONobj = JSON.parse(json);
    details("Head Thing JSON successfully loaded into object");

    JSONobj["bod"] = loadDataObj;
    details("Body attachment modifications merged to Head Thing");

    // If the attribute value isnt set then set it
    // addAttribute(JSONobj, 24)

    // If the attribute value is set then unset it so we can invert it on the plate
    removeAttribute(JSONobj, 24);

    msg("Progress: Stage D - Manny successfully loaded", "staged");
    details("Manny has saved attached body to the Head Thing, it should be good to wear now");

    AnylandSetThing(JSON.stringify(JSONobj));
    return true;
  }
  return false;
}

// Takes the anchor points(left of Manny) and checks them for included things
// If an included thing exists(only one) then process it, else return.
function processBodyPart(subJSONobj, bodyPartJSONobj) {
  if(subJSONobj.hasOwnProperty("i") && subJSONobj["i"].length >= 1) {
    var thingObj = subJSONobj["i"][0];

    var thingRefID = thingObj["t"];
    var posOnAnchor = thingObj["p"];
    var rotOnAnchor = thingObj["r"];

    var posOfAnchor = subJSONobj["s"][0]["p"];
    var rotOfAnchor = subJSONobj["s"][0]["r"];

    var posOfBodyPart = bodyPartJSONobj["p"];
    var rotOfBodyPart = bodyPartJSONobj["r"];

    // Parts new pos X, Y and Z?? Not sure what order they are saved
    thingObj["p"][0] = posOfAnchor[0] - posOnAnchor[0];// - posOfBodyPart[0];
    thingObj["p"][1] = posOfAnchor[1] - posOnAnchor[1];// - posOfBodyPart[1];
    thingObj["p"][2] = posOfAnchor[2] - posOnAnchor[2];// - posOfBodyPart[2];

    // Parts new rot X, Y and Z?? Not sure what order they are saved
    thingObj["r"][0] = rotOfAnchor[0] - rotOnAnchor[0];// - rotOfBodyPart[0];
    thingObj["r"][1] = rotOfAnchor[1] - rotOnAnchor[1];// - rotOfBodyPart[1];
    thingObj["r"][2] = rotOfAnchor[2] - rotOnAnchor[2];// - rotOfBodyPart[2];

    return thingObj;
  } else {
    return null;
  }
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

function addAttribute(JSONobj, attribute) {
  if(!JSONobj.hasOwnProperty("a")) {
      JSONobj.a = [attribute];
      details("attribute " + attribute + " was added(attach current body when worn)");
    } else {
      if(JSONobj.a.indexOf(attribute) == -1) {
        JSONobj.a.push(attribute);
        details("attribute " + attribute + " was appended to attributes(attach current body when worn)");
      } else {
        details("attribute " + attribute + " already exists(attach current body when worn)");
      }
    }
}

function removeAttribute(JSONobj, attribute) {
  if(!JSONobj.hasOwnProperty("a")) {
    details("attribute " + attribute + "(attach current body when worn) didnt exist, nothing was needed");
  } else {
    var attributeIndex = JSONobj.a.indexOf(attribute)
    if(attributeIndex > -1) {
      JSONobj.a.splice(attributeIndex);
      details("attribute " + attribute + "(attach current body when worn) was removed from attributes");
    } else {
      details("attribute " + attribute + "(attach current body when worn) didnt exist, nothing was needed");
    }
  }
}

function generateHeadplate(thingid) {

}

// Debug
if(showDebug) {
  document.getElementById("debug").style = "display: block";
}

function debugJson() {
  var mannyJSON = {"n":"mannyin base","v":9,"p":[{"b":7,"i":[{"t":"5cacd490b8e687096f798c5e","p":[-0.3008847,0.3763355,1.091189],"r":[7.632235,100.4204,77.60461]},{"t":"5cacd4a34404cd28945d71d4","p":[-0.311634,-0.3983806,1.154111],"r":[358.2558,102.6574,95.5042]},{"t":"5cacd4acc00cf628a1e8809f","p":[-0.09392388,-0.4829694,0.1024855],"r":[344.1286,5.552521,1.133034]}],"s":[{"p":[0,0,0],"r":[0,0,0],"s":[0.26501,0.2650105,0.1478957],"c":[1,1,1]}]},{"i":[{"t":"5cacdb644404cd28945d71d6","p":[0.2474788,0.7989041,-0.3735869],"r":[349.4547,201.6307,242.1065]}],"s":[{"p":[0.1058055,-1.097303,1.425857],"r":[351.813,88.56218,0.2238511],"s":[0.01971389,0.02454419,0.05866548],"c":[0,1,0.2285714]}]},{"s":[{"p":[0.1192045,-0.9431875,1.419201],"r":[1.522318,88.02814,2.984132],"s":[0.01971399,0.02454427,0.05866557],"c":[0,0.05714229,1]}]},{"s":[{"p":[0.1685406,-1.020715,1.521154],"r":[357.175,91.18453,359.9312],"s":[0.01971399,0.02713601,0.02168681],"c":[1,0,0.3428572]}]}]};
  var blankHeadJSON = {"n": "head test","v": 9,"p": [{"s": [{"p": [0,0,0],"r": [0,0,0],"s": [0.175,0.175,0.175],"c": [1,1,1]}]}]};
  if(saveManny(JSON.stringify(mannyJSON))) {
    loadManny(JSON.stringify(blankHeadJSON));
  } 
}

function processTextAreaJson() {
  var blankHeadJSON = {"n": "head test","v": 9,"p": [{"s": [{"p": [0,0,0],"r": [0,0,0],"s": [0.175,0.175,0.175],"c": [1,1,1]}]}]};
  if(saveManny(document.getElementById("debugjsonin").value)) {
    loadManny(JSON.stringify(blankHeadJSON));
  } 
}

function AnylandSetThing(json) {
  document.getElementById("debugjsonout").value = json;
}