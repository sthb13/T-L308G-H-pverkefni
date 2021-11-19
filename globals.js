// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var gLevel;
var gPlayer;
var g_levelInfo;
var g_playerDead = false;
var g_gameOver = false;
var g_hasMoved = false;
var g_startGame = false;
// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;

var GRID_BLOCK_W = 40;
var GRID_BLOCK_H = 44;
var NUM_COLUMNS_OF_BLOCKS = 28;
var NUM_ROWS_OF_BLOCKS = 17;

var TIME_TO_DIG_HOLE = 40; //8 Sprites, 5 Frames per Sprite

var BLOCKTYPE = {
    AIR: 0,
    BREAKABLE: 1,
    LADDER: 2,
    HIDDEN_LADDER: 3,
    ROPE: 4,
    GOLD_SPAWN: 5,
    PLAYER_SPAWN: 6,
    FALSE_BREAKABLE: 7,
    GUARD_SPAWN: 8,
    SOLID: 9,
    HOLE: 10
}

var DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3
}

var STATE = {
    ONBLOCK : 0,
    CLIMBING : 1,
    FALLING : 2,
    INROPE : 3,
    LANDING: 4,
    DIGGING: 5,
    ONHEAD: 6
}
