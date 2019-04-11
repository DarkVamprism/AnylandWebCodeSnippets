// Author GroxicTinch
window.onerror = function(errMsg, url, line, column, error) {
            var result = !column ? '' : '\ncolumn: ' + column + "\nerror: ";
            result += !error;
            details("Error= " + errMsg + "\nline= " + line + result);
            var suppressErrorAlert = true;
            return suppressErrorAlert;
         };

var showDebug = true;

document.getElementById("main").innerHTML = "MannyCode Loaded";
document.getElementById("main").style = "color: limegreen; text-align: center;";
msg("Awaiting input", "ready");

var anylandRequestType = -1; // 0 = save, 1 = load, 100 = update manny, 101 = update head plate
var loadDataObj = {};

// Anyland Commands START
// When ... then tell web MESSAGE
function AnylandTold(data, isAuthority) {
  anylandRequestType = -1
  if(isAuthority) {
    details("Authorized user with tell '" + data + "'");
    if(data == "savemanny") {
      anylandRequestType = 0;
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "loadmanny") {
      anylandRequestType = 1;
      AnylandRequestThing(); // This calls AnylandGetThing
    } else if(data == "updatemanny") {
      anylandRequestType = 100;
      AnylandRequestThing();
    } else if(data == "updatemannyhead") {
      anylandRequestType = 101;
      AnylandRequestThing();
    }
  } else {
    msg("Unauthorized user attempt", "noauth");
  }
}

function AnylandGetThing(json) {
  details("json received: request type = '" + anylandRequestType + "'");
  if(anylandRequestType == 0) {
    saveManny(json);
  } else if(anylandRequestType == 1) {
    loadManny(json);
  } else if(anylandRequestType == 100) {
    updatemanny(json);
  } else if(anylandRequestType == 101) {
    updatemannyhead(json);
  }
}
// Anyland Commands END

function saveManny(json) {
  msg("Progress: Stage A - Saving Private Manny", "stagea");
  if(json == "") {
    msg("Progress: Stage A Aborted", "abort");
    details("User is not editing an object, Stage A Aborted");
  } else {
    var bodyOrderObj;
    var JSONobj = JSON.parse(json);
    details("Manny Thing JSON successfully loaded into object");
    document.getElementById("debugjsonin").value = json;

    // Load part order from a script since I can't read part name of placed sub-things
    loadDataObj = {};
    bodyOrderObj = processBodyOrder(JSONobj["p"][1]["s"][0]["b"][0]);
    details("body order loaded from script");

    if(JSONobj["p"][0].hasOwnProperty("su") && JSONobj["p"][0]["su"].length >= bodyOrderObj.length) {
      var i = 0;
      for(var bodyPart in bodyOrderObj) {
        if (bodyOrderObj.hasOwnProperty(bodyPart)) {
          details(bodyPart + " being processed");
          var partObj = JSONobj["p"][0]["su"][i];

          // Not doing loadDataObj[bodyPart] = partObj because we dont want placement id
          // and i is used instead of t when it comes to attached body
          loadDataObj[bodyPart] = new Array();
          loadDataObj[bodyPart]["i"] = partObj["t"];
          loadDataObj[bodyPart]["p"] = partObj["p"];
          loadDataObj[bodyPart]["r"] = partObj["r"];
          i++;
        }
      }

      details("Processing done");
    } else {
      msg("Progress: Stage A Aborted", "abort");
      details("body order length:" + bodyOrderObj.length + " was lower than the subthing count");
    }

    msg("Progress: Stage B - Waiting for user to edit head then click button", "stageb");
    details("Save successful, waiting for user to load");
    return true;
  }
  return false;
}

function loadManny(json) {
  msg("Progress: Stage C - Loading Manny, its all in his head", "stagec");
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

// This is destructive! only call this if you need to!
// Remove all your body parts first!
// You will also need to set the body part order as well as re-add the parts
function updatemanny(json) {
  msg("Progress: Updating Manny", "updatingmanny");
  if(json == "") {
    msg("Progress: Update Aborted", "abort");
    details("User is not editing an object, Update Aborted")
  } else {
    var JSONobj = JSON.parse(json);
    details("JSON successfully loaded into object");

    if(JSONobj["n"] == "manny") {
      msg("Progress: Manny Updated", "updatedmanny");
      details("JSON downloaded into manny");
      AnylandSetThing(Get("./json/manny.json"));
    } else {
      msg("Progress: Updating Failed", "abort");
      details("For safety only things called manny may be updated, this thing is not called manny");
    }
  }
}

// This is destructive! only call this if you need to!
// Remove all your body parts first!
// You will also need to re-add the parts
function updatemannyhead(json) {
  msg("Progress: Updating Mannys Head", "updatingmannyhead");
  if(json == "") {
    msg("Progress: Update Aborted", "abort");
    details("User is not editing an object, Update Aborted")
  } else {
    var JSONobj = JSON.parse(json);
    details("JSON successfully loaded into object");

    if(JSONobj["n"] == "mannyhead") {
      msg("Progress: Manny Updated", "updatedmannyhead");
      details("JSON downloaded into manny");
      AnylandSetThing(Get("./json/mannyhead.json"));
    } else {
      msg("Progress: Updating Failed", "abort");
      details("For safety only things called manny may be updated, this thing is not called manny");
    }
  }
}

function processBodyOrder(bodyOrderString) {
  return bodyOrderString.split(',');
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
  document.getElementById("log").value += message + "\n\n";
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
      JSONobj.a.splice(attributeIndex, 1);
      details("attribute " + attribute + "(attach current body when worn) was removed from attributes");
    } else {
      details("attribute " + attribute + "(attach current body when worn) didnt exist, nothing was needed");
    }
  }
}

function generateHeadplate(thingid) {

}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

// Debug
if(showDebug) {
  document.getElementById("debug").style = "display: block";
}

function debugJson() {
  var mannyJSON = {"n":"manny","v":9,"p":[{"b":7,"i":[{"t":"5cacd490b8e687096f798c5e","p":[-0.3008847,0.3763355,1.091189],"r":[7.632235,100.4204,77.60461]},{"t":"5cacd4a34404cd28945d71d4","p":[-0.311634,-0.3983806,1.154111],"r":[358.2558,102.6574,95.5042]}],"su":[{"i":"5caf99abdd16544ea8aa2ea5","t":"5caf99a473f09c2faf79f851","p":[-0.3151202,-0.3658199,1.177913],"r":[353.7249,279.1947,22.28889]}],"s":[{"p":[0,0,0],"r":[0,0,0],"s":[0.26501,0.2650105,0.1478957],"c":[1,0,0]}]},{"s":[{"p":[-0.07161512,-1.149362,1.184381],"r":[359.1775,1.055568,91.1394],"s":[0.175,0.01309201,0.08633205],"c":[0,1,0.3999999],"b":["ra"]}]},{"b":23,"e":"Change the script on the green cube below\nformat must be for example\nra,la,rl,lt,ht,ut\nra = right armn\nla = left arm\nut = upper torso\nlt = lower torso\nht = head top(hat)\nll = left leg\nrl= right leg\n\nonly add the parts you added and it MUST be in the same order you added them","s":[{"p":[-0.001510492,-1.498971,1.390899],"r":[0.9018408,93.25231,87.85188],"s":[0.00300001,0.003000013,0.003000012],"c":[1,1,1]}]}]};
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