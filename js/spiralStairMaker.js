// Author GroxicTinch
document.getElementById("main").style = "display: block;";
document.getElementById("codeIndicator").style = "display: none;";
document.getElementById("log").value = "";
document.getElementById("btnUpdate").disabled = true;
document.getElementById("btnUndo").disabled = true;

msg("Awaiting input", "ready");

var stairDefaultObj;

// loadType : 1 = Loading Stair, 2 = Updating
var loadType = 0;

// Anyland Commands START
// When ... then tell web MESSAGE
function AnylandTold(data, isAuthority) {
  /*if(isAuthority && data == "loadstep") {
    document.getElementById("log").value = "";
    msg("Told recieved, requesting Thing", "requesting");
    AnylandRequestThing();
  } else if(isAuthority && data == "createstairs") {
    msg("Told recieved, requesting Thing", "requesting");
    AnylandRequestThing();
  } else {
    msg("Unauthorized user attempt", "noauth");
  }*/
}

function AnylandGetThing(json) {
  if(json == "") {
    msg("User not editing part!", "abort");
    details("User is not editing an object, Stair maker Aborted");
  } else {
    var JSONobj = JSON.parse(json);
    details("Staircase JSON successfully loaded into object");

    if(loadType == 1) {
      // Unfortunaltely this is the best way to clone an object
      stairDefaultObj = JSON.parse(JSON.stringify(JSONobj[_thing.parts._]));
      StairsLoaded();
    } else if(loadType == 2) {
      ModifyParts(JSONobj);
    } else if(loadType == 3) {
      ReduceToOneStair(JSONobj);
    }

    loadType = 0;

    return true;
  }
  return false;
}
// Anyland Commands END

function LoadStairParts() {
  msg("Requesting Thing", "requesting");
  loadType = 1;
  AnylandRequestThing();
}

function StairsLoaded() {
  document.getElementById("btnLoadPart").style = "background-color: #d0741f";
  document.getElementById("btnLoadPart").innerHTML = "Re-load parts";

  document.getElementById("btnUpdate").disabled = false;
  document.getElementById("btnUpdate").style = "background-color: green";

  document.getElementById("btnUndo").disabled = false;
  msg("Thing loaded, hit update", "requesting");
}

function UpdateStairs() {
  msg("Starting Update", "startingupdate");
  loadType = 2;
  AnylandRequestThing();
}

function ModifyParts(JSONobj) {
  var stepAmount = parseInt(document.getElementById("stepAmount").value);
  var rotAmount = parseFloat(document.getElementById("rotAmount").value);
  var heightAmount = parseFloat(document.getElementById("heightAmount").value);

  // Restore the default and also make an object we can edit
  JSONobj["p"] = JSON.parse(JSON.stringify(stairDefaultObj));
  var stairObj = JSON.parse(JSON.stringify(stairDefaultObj));

  var step;
  for(step = 1; step < stepAmount; step++) {
    details("Adding Step " + step);

    // for each step, calculate each parts new pos and rot
    var i;
    for(i = 0; i < stairObj.length; i++) {
      var stateIdx;
      for(stateIdx = 0; stateIdx < stairObj[i][_thing.parts.states._].length; stateIdx++) {
        // [TODO] each state, add tag to stairs
        var posX = stairObj[i][_thing.parts.states._][0][_thing.parts.states.pos][0];
        var posY = stairObj[i][_thing.parts.states._][0][_thing.parts.states.pos][1];
        var posZ = stairObj[i][_thing.parts.states._][0][_thing.parts.states.pos][2];
        var posAsAngle = (Math.atan2(posX, posZ));
        var radius = Math.hypot(posX, posZ)

        var newAngle = (posAsAngle + rotAmount) % 360;

        posX = Math.sin(newAngle) * radius;
        posY += heightAmount;
        posZ = Math.cos(newAngle) * radius;

        stairObj[i][_thing.parts.states._][0][_thing.parts.states.pos][0] = posX;
        stairObj[i][_thing.parts.states._][0][_thing.parts.states.pos][1] = posY;
        stairObj[i][_thing.parts.states._][0][_thing.parts.states.pos][2] = posZ;

        stairObj[i][_thing.parts.states._][0][_thing.parts.states.rot][1] += rotAmount;

        stairObj[i][_thing.parts.states._][0][_thing.parts.states.rot][1] %= 360;

        JSONobj[_thing.parts._].push(JSON.parse(JSON.stringify(stairObj[i])));
      }
    }
  }

  json = JSON.stringify(JSONobj);
  AnylandSetThing(json);

  msg("Complete", "complete");
  details("Object updated");
}

function UndoChanges() {
  msg("Undoing changes", "undoing");
  loadType = 3;
  AnylandRequestThing();
}

function ReduceToOneStair(JSONobj) {
  JSONobj["p"] = JSON.parse(JSON.stringify(stairDefaultObj));
  json = JSON.stringify(JSONobj);
  AnylandSetThing(json);
}