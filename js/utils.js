// Utils
function msg(message, tell = "") {
  document.getElementById("progress").innerHTML = message;
  if(tell != "") {
    sendTell(tell);
  }
}

function details(message) {
  document.getElementById("log").value += message + "\n";
}

function printObj(obj) {
  details(JSON.stringify(obj, null, 3));
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

// Anyland replacement functions for debugging
function sendTell(tell) {
  if (window.AnylandTell) {
    AnylandTell(tell);
  }
}

function AnylandRequestThing() {
  if (!window.AnylandTell) {
    AnylandGetThing("{\"v\":9,\"a\":[7],\"p\":[{\"b\":5,\"s\":[{\"p\":[0,0,0],\"r\":[0,0,0],\"s\":[0.1000021,0.1000061,0.4600464],\"c\":[1,1,1]}]},{\"b\":14,\"s\":[{\"p\":[1,1,0],\"r\":[90,90,0],\"s\":[0.06001307,0.06001284,0.0600025],\"c\":[1,1,1]}]}]}");
  }
}

function AnylandSetThing(json) {
  details("AnylandSetThing Called");
  console.log(JSON.parse(json));
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








// *******************************************************************************************
// Used for Thing format readability
const _thingAttr = {
    _ : "a",
    isClonable : 1,
    isHoldable : 2,
    remainsHeld : 3,
    isClimbable : 4,
    isPassable : 6,
    isUnwalkable : 5,
    doSnapAngles : 7,
    isBouncy : 9,
    currentlyUnused1 : 10,
    doShowDirection : 12,
    keepPreciseCollider : 13,
    doesFloat : 14,
    doesShatter : 15,
    isSticky : 16,
    isSlidy : 17,
    doSnapPosition : 18,
    amplifySpeech : 19,
    benefitsFromShowingAtDistance : 20,
    scaleAllParts : 21,
    doSoftSnapAngles : 22,
    doAlwaysMergeParts : 23,
    addBodyWhenAttached : 24,
    hasSurroundSound : 25,
    canGetEventsWhenStateChanging : 26,
    replacesHandsWhenAttached : 27,
    mergeParticleSystems : 28,
    isSittable : 29,
    smallEditMovements : 30,
    scaleEachPartUniformly : 31,
    snapAllPartsToGrid : 32,
    invisibleToUsWhenAttached : 33,
    replaceInstancesInArea : 34,
    addBodyWhenAttachedNonClearing : 35,
    avoidCastShadow : 36,
    avoidReceiveShadow : 37,
    omitAutoSounds : 38,
    omitAutoHapticFeedback : 39,
    keepSizeInInventory : 40,
    autoAddReflectionPartsSideways : 41,
    autoAddReflectionPartsVertical : 42,
    autoAddReflectionPartsDepth : 43,
    activeEvenInInventory : 44,
    stricterPhysicsSyncing : 45,
    removeOriginalWhenGrabbed : 46,
    persistWhenThrownOrEmitted : 47,
    invisible : 48,
    uncollidable : 49,
    movableByEveryone : 50,
    isNeverClonable : 51,
    floatsOnLiquid : 52,
    
    hideEffectShapes_deprecated : 8
};

const _part = {
  _ : "p",
  states : {
    _ : "s",
    pos : "p",
    rot : "r",
    scale : "s",
    colour : "c",
    scripts : "b"
  },
  attr : {
    _ : "a",
    offersScreen : 1,
    scalesUniformly : 3,
    videoScreenHasSurroundSound : 4,
    isLiquid : 5,
    offersSlideshowScreen : 6,
    isCamera : 8,
    isFishEyeCamera : 10,
    useUnsoftenedAnimations : 11,
    invisible : 12,
    isUnremovableCenter : 13,
    omitAutoSounds : 14,
    doSnapTextureAngles : 15,
    textureScalesUniformly : 16,
    avoidCastShadow : 17,
    looselyCoupledParticles : 18,
    textAlignCenter : 19,
    textAlignRight : 20,
    isAngleLocker : 21,
    isPositionLocker : 22,
    isLocked : 23,
    avoidReceiveShadow : 24,
    isImagePasteScreen : 25,
    allowBlackImageBackgrounds : 26,
    videoScreenLoops : 27,
    videoScreenIsDirectlyOnMesh : 28,
    useTextureAsSky : 29,
    stretchSkydomeSeam : 30,
    subThingsFollowDelayed : 31,
    hasReflectionPartSideways : 32,
    hasReflectionPartVertical : 33,
    hasReflectionPartDepth : 34,
    videoScreenFlipsX : 35,
    persistStates : 36,
    uncollidable : 37,
    isDedicatedCollider : 38,
    
    // Deprecated as now possible via scripting,
    // will load but not save after clone-editing:
    isVideoButton : 2,
    isSlideshowButton : 7,
    isCameraButton : 9
  },
  shape : {
    _ : "b",
    Cube : 1,
    Pyramid : 2,
    Sphere : 3,
    Cone : 4,
    Cylinder : 5,
    Triangle : 6,
    Trapeze : 7,
    Hedra : 8,
    Icosphere : 9,
    LowPolySphere : 10,
    Ramp : 11,
    JitterCube : 12,
    ChamferCube : 13,
    Spike : 14,
    LowPolyCylinder : 15,
    HalfSphere : 16,
    JitterSphere : 17,
    TextArialBold : 18,
    TextTimesBold : 19,
    TextArCena : 20,
    TextGeometr : 21,
    TextRockwell : 22,
    TextGillSans : 23,
    BigDialog : 25,
    QuarterPipe1 : 26,
    QuarterPipe2 : 27,
    QuarterPipe3 : 28,
    QuarterPipe4 : 29,
    QuarterPipe5 : 30,
    QuarterPipe6 : 31,
    QuarterTorus1 : 32,
    QuarterTorus2 : 33,
    QuarterTorus3 : 34,
    QuarterTorus4 : 35,
    QuarterTorus5 : 36,
    QuarterTorus6 : 37,
    CurvedRamp : 38,
    CubeRotated : 39,
    QuarterPipeRotated1 : 40,
    QuarterPipeRotated2 : 41,
    QuarterPipeRotated3 : 42,
    QuarterPipeRotated4 : 43,
    QuarterPipeRotated5 : 44,
    QuarterPipeRotated6 : 45,
    QuarterTorusRotated1 : 46,
    QuarterTorusRotated2 : 47,
    QuarterTorusRotated3 : 48,
    QuarterTorusRotated4 : 49,
    QuarterTorusRotated5 : 50,
    QuarterTorusRotated6 : 51,
    Hexagon : 52,
    HexagonBevel : 53,
    Ring1 : 54,
    Ring2 : 55,
    Ring3 : 56,
    Ring4 : 57,
    Ring5 : 58,
    Ring6 : 59,
    CubeBevel1 : 60,
    CubeBevel2 : 61,
    CubeBevel3 : 62,
    Triangle2 : 63,
    HalfCylinder : 64,
    QuarterCylinder : 65,
    QuarterSphere : 66,
    SphereEdge : 67,
    RoundCube : 68,
    Capsule : 69,
    Heptagon : 70,
    Pentagon : 71,
    Octagon : 72,
    HighPolySphere : 73,
    Bowl1 : 74,
    Bowl2 : 75,
    Bowl3 : 76,
    Bowl4 : 77,
    Bowl5 : 78,
    Bowl6 : 79,
    BowlCube : 80,
    QuarterBowlCube : 81,
    CubeHole : 82,
    HalfCubeHole : 83,
    BowlCubeSoft : 84,
    QuarterBowlCubeSoft : 85,
    Bowl1Soft : 86,
    QuarterSphereRotated : 87,
    HalfBowlSoft : 88,
    QuarterBowlSoft : 89,
    TextOrbitron : 90,
    TextAlfaSlab : 91,
    TextAudioWide : 92,
    TextBangers : 93,
    TextBowlby : 94,
    TextCantata : 95,
    TextChewy : 96,
    TextComingSoon : 97,
    TextExo : 98,
    TextFredoka : 99,
    TextKaushan : 100,
    TextMonoton : 101,
    TextPatrick : 102,
    TextPirata : 103,
    TextShrikhand : 104,
    TextSpinnaker : 105,
    TextDiplomata : 106,
    TextHanalei : 107,
    TextJoti : 108,
    TextMedieval : 109,
    TextSancreek : 110,
    TextStalinist : 111,
    TextTradewinds : 112,
    TextBaloo : 113,
    TextBubbler : 114,
    TextCaesarDressing : 115,
    TextDhurjati : 116,
    TextFascinateInline : 117,
    TextFelipa : 118,
    TextInknutAntiqua : 119,
    TextKeania : 120,
    TextLakkiReddy : 121,
    TextLondrinaSketch : 122,
    TextLondrinaSolid : 123,
    TextMetalMania : 124,
    TextMolle : 125,
    TextRisque : 126,
    TextSarpanch : 127,
    TextUncialAntiqua : 128,
    Text256Bytes : 129,
    TextAeroviasBrasil : 130,
    TextAnitaSemiSquare : 131,
    TextBeefd : 132,
    TextCrackdown : 133,
    TextCreampuff : 134,
    TextDataControl : 135,
    TextEndor : 136,
    TextFreshMarker : 137,
    TextHeavyData : 138,
    TextPropaganda : 139,
    TextRobotoMono : 140,
    TextTitania : 141,
    TextTobagoPoster : 142,
    TextViafont : 143,
    Wheel : 144,
    Wheel2 : 145,
    Wheel3 : 146,
    Wheel4 : 147,
    WheelVariant : 148,
    Wheel2Variant : 149,
    JitterCubeSoft : 150,
    JitterSphereSoft : 151,
    LowJitterCube : 152,
    LowJitterCubeSoft : 153,
    JitterCone : 154,
    JitterConeSoft : 155,
    JitterHalfCone : 156,
    JitterHalfConeSoft : 157,
    JitterChamferCylinder : 158,
    JitterChamferCylinderSoft : 159,
    Gear : 160,
    GearVariant : 161,
    GearVariant2 : 162,
    GearSoft : 163,
    GearVariantSoft : 164,
    GearVariant2Soft : 165,
    Branch : 166,
    Bubbles : 167,
    HoleWall : 168,
    JaggyWall : 169,
    Rocky : 170,
    RockySoft : 171,
    RockyVerySoft : 172,
    Spikes : 173,
    SpikesSoft : 174,
    SpikesVerySoft : 175,
    WavyWall : 176,
    WavyWallVariant : 177,
    WavyWallVariantSoft : 178,
    Quad : 179,
    FineSphere : 180,
    Drop : 181,
    Drop2 : 182,
    Drop3 : 183,
    DropSharp : 184,
    DropSharp2 : 185,
    DropSharp3 : 186,
    Drop3Flat : 187,
    DropSharp3Flat : 188,
    DropCut : 189,
    DropSharpCut : 190,
    DropRing : 191,
    DropRingFlat : 192,
    DropPear : 193,
    DropPear2 : 194,
    Drop3Jitter : 195,
    DropBent : 196,
    DropBent2 : 197,
    SharpBent : 198,
    Tetrahedron : 199,
    Pipe : 200,
    Pipe2 : 201,
    Pipe3 : 202,
    ShrinkDisk : 203,
    ShrinkDisk2 : 204,
    DirectionIndicator : 205,
    Cube3x2 : 207,
    Cube4x2 : 208,
    Cube5x2 : 209,
    Cube6x2 : 210,
    Cube2x3 : 211,
    Cube3x3 : 212,
    Cube4x3 : 213,
    Cube5x3 : 214,
    Cube6x3 : 215,
    Cube2x4 : 216,
    Cube3x4 : 217,
    Cube4x4 : 218,
    Cube5x4 : 219,
    Cube6x4 : 220,
    Cube2x5 : 221,
    Cube3x5 : 222,
    Cube4x5 : 223,
    Cube5x5 : 224,
    Cube6x5 : 225,
    Cube6x6 : 226,
    Quad3x2 : 227,
    Quad4x2 : 228,
    Quad5x2 : 229,
    Quad6x2 : 230,
    Quad2x3 : 231,
    Quad3x3 : 232,
    Quad4x3 : 233,
    Quad5x3 : 234,
    Quad6x3 : 235,
    Quad2x4 : 236,
    Quad3x4 : 237,
    Quad4x4 : 238,
    Quad5x4 : 239,
    Quad6x4 : 240,
    Quad2x5 : 241,
    Quad3x5 : 242,
    Quad4x5 : 243,
    Quad5x5 : 244,
    Quad6x5 : 245,
    Quad6x6 : 246,
    Icosahedron : 247,
    Cubeoctahedron : 248,
    Dodecahedron : 249,
    Icosidodecahedron : 250,
    Octahedron : 251
  },
  mat : {
    _ : "t",
    None : 0,
    Metallic : 1,
    Glow : 2,
    PointLight : 3,
    SpotLight : 4,
    Particles : 5,
    ParticlesBig : 6,
    Transparent : 7,
    Plastic : 9,
    Unshiny : 10,
    VeryMetallic : 11,
    DarkMetallic : 12,
    BrightMetallic : 13,
    TransparentGlossy : 14,
    TransparentGlossyMetallic : 15,
    VeryTransparent : 16,
    VeryTransparentGlossy : 17,
    SlightlyTransparent : 18,
    Unshaded : 19,
    Inversion : 20,
    Brightness : 21,
    TransparentTexture : 22,
    
    InvisibleWhenDone_Deprecated : 8
  },
  texture : {
    None             : 0,
    Gradient         : 2,
    Geometry_Gradient : 161,
    WoodGrain         : 3,
    VoronoiPolys     : 4,
    WavyLines         : 5,
    VoronoiDots     : 6,
    PerlinNoise1     : 7,
    QuasiCrystal     : 8,
    PlasmaNoise     : 12,
    Pool            : 13,
    Bio             : 14,
    FractalNoise    : 15,
    LightSquares    : 16,
    Machine         : 17,
    SweptNoise      : 18,
    Abstract        : 19,
    Dashes          : 20,
    LayeredNoise    : 21,
    SquareRegress   : 22,
    Swirly          : 23,

    SideGlow         : 10,

    Ground_Spotty           : 24,
    Ground_SpottyBumpMap    : 25,
    Ground_LineBumpMap      : 26,
    Ground_SplitBumpMap     : 27,
    Ground_Wet              : 28,
    Ground_Rocky            : 29,
    Ground_RockyBumpmap     : 30,
    Ground_Broken           : 31,
    Ground_BrokenBumpMap    : 32,
    Ground_Pebbles          : 33,
    Ground_PebblesBumpMap   : 34,
    Ground_1BumpMap         : 35,

    Misc_IceSoft            : 11,
    Misc_CrackedIce         : 36,
    Misc_CrackedGround      : 37,
    Misc_LinesPattern       : 38,
    Misc_StoneGround        : 39,
    Misc_Lava               : 40,
    Misc_LavaBumpMap        : 41,
    Misc_StraightIce        : 42,
    Misc_CrackedIce2        : 43,
    Misc_Shades             : 44,
    Misc_Cork               : 45,
    Misc_Wool               : 46,
    Misc_Salad              : 47,
    Misc_CrossLines         : 48,
    Misc_Holes              : 49,
    Misc_Waves              : 50,
    Misc_WavesBumpMap       : 51,
    Misc_1                  : 155,
    Misc_1BumpMap           : 52,
    Misc_2                  : 53,
    Misc_2BumpMap           : 54,
    Misc_3                  : 55,
    Misc_3BumpMap           : 56,
    Misc_SoftNoise          : 57,
    Misc_SoftNoiseBumpMap   : 58,
    Misc_SoftNoiseBumpMapVariant    : 157,
    Misc_Stars              : 59,
    Misc_StarsBumpMap       : 60,
    Misc_CottonBalls        : 61,
    Misc_4                  : 62,
    Misc_4BumpMap           : 63,
    Misc_5                  : 64,
    Misc_5BumpMap           : 65,
    Misc_Glass              : 66,
    
    Geometry_Circle_1               : 67,
    Geometry_Circle_2               : 68,
    Geometry_Circle_3               : 69,
    Geometry_Half                   : 70,
    Geometry_TiltedHalf             : 71,
    Geometry_Pyramid                : 72,
    Geometry_Dots                   : 73,
    Geometry_MultiGradient          : 74,
    Geometry_Wave                   : 75,
    Geometry_Checkerboard           : 76,
    Geometry_CheckerboardBumpMap    : 77,
    Geometry_Lines                  : 78,
    Geometry_LinesBumpMap           : 79,
    Geometry_DoubleGradient         : 80,
    Geometry_Rectangles             : 81,
    Geometry_RectanglesBumpMap      : 82,
    Geometry_Border_1               : 156,
    Geometry_Border_2               : 83,
    Geometry_Border_3               : 84,
    Geometry_Border_4               : 85,
    Geometry_Border_2BumpMap        : 86,
    Geometry_Circle_2BumpMap        : 87,
    Geometry_Lines2                 : 88,
    Geometry_Lines2Blurred          : 89,
    Geometry_RoundBorder            : 90,
    Geometry_RoundBorder2           : 91,
    Geometry_RoundBorderBumpMap     : 92,
    Geometry_Line_1                 : 93,
    Geometry_Line_2                 : 94,
    Geometry_Line_3                 : 95,
    Geometry_Line_2BumpMap          : 96,
    Geometry_Octagon_1              : 97,
    Geometry_Octagon_2              : 98,
    Geometry_Octagon_3              : 99,
    Geometry_Hexagon                : 100,
    Geometry_Hexagon2               : 101,
    Geometry_Hexagon2BumpMap        : 102,
    
    Metal_1     : 103,
    Metal_2     : 104,
    Metal_Wet   : 105,
    
    Marble_1    : 106,
    Marble_2    : 107,
    Marble_3    : 108,

    Tree_1BumpMap   : 109,
    Tree_2          : 110,
    Tree_3          : 111,
    Tree_4          : 112,

    Grass_4         : 113,
    Grass_4BumpMap  : 114,
    Grass_3         : 115,
    Grass_3BumpMap  : 116,
    Grass_2         : 117,
    Grass_1         : 119,
    Grass_1BumpMap  : 120,
    Grass_2BumpMap  : 118,
    Grass_5         : 121,
    Grass_5BumpMap  : 122,
    Grass_6BumpMap  : 123,
    
    Wall_1                      : 124,
    Wall_1BumpMap               : 125,
    Wall_2                      : 126,
    Wall_2BumpMap               : 127,
    Wall_3BumpMap               : 128,
    Wall_Rocky                  : 129,
    Wall_RockyBumpMap           : 130,
    Wall_Freckles               : 131,
    Wall_FrecklesBumpMap        : 132,
    Wall_Freckles2              : 133,
    Wall_Freckles2BumpMap       : 134,
    Wall_Scratches              : 135,
    Wall_ScratchesBumpMap       : 136,
    Wall_Mossy                  : 137,
    Wall_MossyBumpMap           : 138,
    Wall_Wavy                   : 139,
    Wall_WavyBumpMap            : 140,
    Wall_Lines                  : 141,
    Wall_LinesBumpMap           : 142,
    Wall_Lines2                 : 143,
    Wall_Lines2BumpMap          : 144,
    Wall_Lines3                 : 145,
    Wall_Lines3BumpMap          : 146,
    Wall_ScratchyLines          : 147,
    Wall_ScratchyLinesBumpMap   : 148,

    Cloth_1         : 149,
    Cloth_2         : 150,
    Cloth_2BumpMap  : 151,
    Cloth_3         : 152,
    Cloth_4         : 153,
    Cloth_4BumpMap  : 154,
    
    Geometry_RadialGradient : 158,
    Geometry_MoreLines      : 159,
    Geometry_MoreRectangles : 160,
    
    Filled : 162,
    
    Vertex_Scatter : 163,
    Vertex_Expand  : 165,
    Vertex_Slice   : 166,
    
    Wireframe : 167,
    Outline : 168
  },
  particle : {
    _ : "pr",
    None : 0,
    Flares : 1,
    Twinkle : 2,
    Clouds : 3,
    GlowSpheres : 4,
    Fumes : 5,
    FumesDirected : 6,
    Rain : 7,
    GroundSmoke : 8,
    Ripples : 9,
    RipplesVertical : 10,
    TwisterPoints : 11,
    TwisterLines : 12,
    NoisyWater : 13,
    Bubbles : 14,
    Fire : 15,
    TwistedSmoke : 16,
    FireRain : 17,
    SmokeRain : 18,
    FireRainWild : 19,
    FireMore : 20,
    OrganicSplatter : 21,
    Rings : 22,
    FireCrackerBurst : 23,
    FireCrackerSmoke : 24,
    FireCrackerFlares : 25,
    Embers : 26,
    Beams : 27,
    BeamsCustom : 28,
    Dust : 29,
    Fog : 30,
    AreaEmbers : 31,
    Rays : 32,
    ScatterRays : 33,
    CenteredElectric : 34,
    Smoke : 35,
    CircularSmoke : 36,
    CircularSmokeCustom : 37,
    Shards : 38,
    RoughShards : 39,
    FireThrow : 40,
    SoftFire : 41,
    SpiralSmoke : 42,
    TwisterSmoke : 43,
    ShrinkSmoke : 44,
    ThickSmoke : 45,
    PopSmoke : 46,
    PlopSmoke : 47,
    LightStreaks : 48,
    Fractals : 49,
    WaterFlow : 50,
    WaterFlowSoft : 51,
    StoppingEmbers : 52,
    Sparks : 53,
    Puffs : 54,
    Flame : 55,
    FlameCustom : 56,
    SoftSmoke : 57,
    Starry : 58,
    BubblingBlobs : 59,
    Spheres : 60
  },
};

const _body = {
    _ : "bod",
    head : {
      _ : "h",
      pos : "p",
      rot : "r",
    },
    headTop : {
      _ : "ht",
      id : "i",
      pos : "p",
      rot : "r",
    },
    upperTorso : {
      _ : "ut",
      id : "i",
      pos : "p",
      rot : "r",
    },
    lowerTorso : {
      _ : "lt",
      id : "i",
      pos : "p",
      rot : "r",
    },
    armLeft : {
      _ : "al",
      id : "i",
      pos : "p",
      rot : "r",
    },
    armRight : {
      _ : "ar",
      id : "i",
      pos : "p",
      rot : "r",
    },
    legLeft : {
      _ : "ll",
      id : "i",
      pos : "p",
      rot : "r",
    },
    legRight : {
      _ : "lr",
      id : "i",
      pos : "p",
      rot : "r",
    },
};

const _autocomplete = {
  _ : "ac",
  id : "id",
  count : "c",
  waves : "w",
  randPos : "rp",
  randRot : "rr",
  randScale : "rs"
};

const _includedSubthing = {
  _ : "i",
  thingId : "t",
  name : "n",
  pos : "p",
  rot : "r",
  attrInverted : _part.attr // Inverted
};

const _placedSubthing = {
  _ : "su",
  thingId : "t",
  placementId : "i",
  pos : "p",
  rot : "r"
};

const _thing = {
  name : "n",
  version : "v",

  // Physics
  mass : "tp_m",
  drag : "tp_d",
  angDrag : "tp_ad",
  lockPos : "tp_lp",
  lockRot : "tp_lr",

  // Attributes "a"
  attr : _thingAttr,

  // Parts "p"
  parts : {
    _ : "p",
    id : "id",
    desc : "d",

    // Text
    text : "e",
    lineHeight : "lh",

    // Attributes "a"
    attr : _part.attr,

    // Shape
    shape : _part.shape,
    mat : _part.mat,

    textureOne : "t1",
    textureTwo : "t2",
    texture : _part.texture,

    particle : _part.particle,

    // Image
    img : "im",
    imgType : {
      _ : "imt",
      Jpeg : 0,
      Png : 1
    },

    changedVertices : "c",

    states : _part.states,
    body : _body,
    autocompletes : _autocomplete,
    includedSubthings : _includedSubthing,
    placedSubthings : "su",
  },

  includedSubthings : "inc"
};