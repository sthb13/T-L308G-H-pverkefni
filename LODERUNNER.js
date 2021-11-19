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

// =============
// GATHER INPUTS
// =============

function gatherInputs() {

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
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;

var KEY_SPATIAL = keyCode('X');

var KEY_RESET = keyCode('R');

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

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
    scoreManager.render(ctx);
    lifeManager.render(ctx);
    levelNumberManager.render(ctx);

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
        guard   : "./images/guard.png",
        guardRed   : "./images/redhat.png",
        empty   : "./images/empty.png",
        hole    : "./images/hole.png",
        gameOver : "./images/over.png",
        welcome : "./images/welcome.png"
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
    g_sprites.guardRed = new Sprite(g_images.guardRed);
    g_sprites.empty = new Sprite(g_images.empty);
    g_sprites.hole = new Sprite(g_images.hole);
    g_sprites.gameOver = new Sprite(g_images.gameOver);
    g_sprites.welcome = new Sprite(g_images.welcome);

    // g_sprites.bullet = new Sprite(g_images.ship);
    // g_sprites.bullet.scale = 0.25;

    entityManager.init();



    main.init();
}

// Kick it off
requestPreloads();
