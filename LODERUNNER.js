// ===========
// LODE RUNNER 
// ===========
/*


"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

// function createInitialShips() {

//     entityManager.generateShip({
//         cx : 200,
//         cy : 200
//     });
    
// }

function createInitialLevel(){
    entityManager.init();
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

    // Prevent perpetual firing!
    // eatKey(Ship.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
// var KEY_GRAVITY = keyCode('G');
// var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

// var KEY_0 = keyCode('0');

// var KEY_1 = keyCode('1');
// var KEY_2 = keyCode('2');

// var KEY_K = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    // if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    // if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        block   : "./images/block.png",
        brick   : "./images/brick.png",
        ground  : "./images/ground.png",
        ladder  : "./images/ladder.png",
        rope    : "./images/rope.png",
        gold    : "./images/gold.png",
        player  : "./images/runner.png", //spriteSheet
        // player : "./images/runner1.png",
        guard   : "./images/guard1.png",
        empty   : "./images/empty.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.block  = new Sprite(g_images.block);
    g_sprites.brick = new Sprite(g_images.brick);
    g_sprites.ground  = new Sprite(g_images.ground);
    g_sprites.ladder = new Sprite(g_images.ladder);
    g_sprites.rope = new Sprite(g_images.rope);
    g_sprites.gold = new Sprite(g_images.gold);
    g_sprites.player = new Sprite(g_images.player);
    g_sprites.guard = new Sprite(g_images.guard);
    g_sprites.empty = new Sprite(g_images.empty);

    // g_sprites.bullet = new Sprite(g_images.ship);
    // g_sprites.bullet.scale = 0.25;

    entityManager.init();
    // createInitialShips();
    // createInitialLevel();
    main.init();
}

// Kick it off
requestPreloads();