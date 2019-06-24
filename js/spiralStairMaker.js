// Author GroxicTinch
document.getElementById("main").style = "display: block;";
document.getElementById("codeIndicator").style = "display: none;";
document.getElementById("log").value = "";

msg("Awaiting input", "ready");

// loadType : 1 = Update, 2 = Undo
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
      var stepAmount = parseInt(document.getElementById("stepAmount").value);
      var rotAmount = parseFloat(document.getElementById("rotAmount").value);
      var heightAmount = parseFloat(document.getElementById("heightAmount").value);
      ModifyParts(JSONobj, stepAmount, rotAmount, heightAmount);
    } else if(loadType == 2) {
      RemoveStairs(JSONobj);
    }

    loadType = 0;

    return true;
  }
  return false;
}
// Anyland Commands END

function RequestThing(type, message, tell = "") {
  loadType = type;
  msg(message, tell);
  AnylandRequestThing();
}

function ModifyParts(JSONobj, stepAmount, rotAmount, heightAmount) {
  // Make an object we can edit without affecting the original
  var stairObj = JSON.parse(JSON.stringify(JSONobj[_thing.parts._]));

  var step;
  for(step = 1; step < stepAmount; step++) {
    details("Adding Step " + step);

    // for each step, calculate each parts new pos and rot
    var i;
    for(i = 0; i < stairObj.length; i++) {
      var scriptsOnFirstState;
      if(stairObj[i][_thing.parts.states._][0].hasOwnProperty(_thing.parts.states.scripts)) {
        scriptsOnFirstState = stairObj[i][_thing.parts.states._][0][_thing.parts.states.scripts].length;
      } else {
        scriptsOnFirstState = 0;
      }

      if(scriptsOnFirstState > 0 && stairObj[i][_thing.parts.states._][0][_thing.parts.states.scripts][scriptsOnFirstState -1] == "[gt_stair]") {
        stairObj.splice(i,1);
        JSONobj[_thing.parts._].splice(i,1);
        i--;
      } else {
        var stateIdx;
        for(stateIdx = 0; stateIdx < stairObj[i][_thing.parts.states._].length; stateIdx++) {
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

          var length = JSONobj[_thing.parts._].length - 1;
          if(scriptsOnFirstState <= 0) {
            JSONobj[_thing.parts._][length][_thing.parts.states._][0][_thing.parts.states.scripts] = [
              "[gt_stair]"
            ];
          } else {
            JSONobj[_thing.parts._][length][_thing.parts.states._][0][_thing.parts.states.scripts][scriptsOnFirstState -1] = "[gt_stair]";
          }
        }
      }
    }
  }

  json = JSON.stringify(JSONobj);
  AnylandSetThing(json);

  msg("Complete", "complete");
  details("Object updated");
}

function RemoveStairs(JSONobj) {
  // Check every part for my tag and remove it if it does
    var i;
    for(i = 0; i < JSONobj[_thing.parts._].length; i++) {
      var scriptsOnFirstState;
      if(JSONobj[_thing.parts._][i][_thing.parts.states._][0].hasOwnProperty(_thing.parts.states.scripts)) {
        scriptsOnFirstState = JSONobj[_thing.parts._][i][_thing.parts.states._][0][_thing.parts.states.scripts].length;
      } else {
        scriptsOnFirstState = 0;
      }

      if(scriptsOnFirstState > 0 && JSONobj[_thing.parts._][i][_thing.parts.states._][0][_thing.parts.states.scripts][scriptsOnFirstState -1] == "[gt_stair]") {
        JSONobj[_thing.parts._].splice(i,1);
        i--;
      }
  }

  json = JSON.stringify(JSONobj);
  AnylandSetThing(json);

  msg("Complete", "complete");
  details("Object updated");
}