/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_holes : [],
_gold : [],
_guards : [],
_player : [], //Change from array to single var
_level : [], //Change from array to single var
_blocks : [],
_player : null,
_level : null,
readyToAdvance : false,
currentLevel : 0,


_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._gold, this._level, this._blocks, this._holes, this._guards, this._player];
},

init: function() {
    gLevel = levelData[0];
    console.log(gLevel);
    this._level.push(new Level(gLevel));
    this._level[0].init();

    /* Moved to level class. Done level constructor
    this.initLevel(gLevel);
    this.generatePlayer();
    this.generateGuards();
    this.generateGold();
    */

resetLevel: function() {
    g_hasMoved = false;
    //TODO: FIX THIS FUNCTION
    //TODO: Maybe we shouldn't just loop levels
    //this.currentLevel %= levelData.length - 1;
    spatialManager.reset();
    this.reset();
    //TODO: Win screen if we run out of levels;
    this._player = null;
    gLevel = levelData[this.currentLevel];
    this._level = new Level(gLevel);
    this._level.init();
    this.deferredSetup();
},

gameOver: function() {
  g_gameOver = true;
  this.resetLevel();
  console.log("PRESS \"N\" for a new game!")
  g_hasMoved = false;
},

restartGame: function() {
  console.log("restartGame");
  g_hasMoved = false;
  g_gameOver = false;
  spatialManager.reset();
  this.reset();
  //TODO: Win screen if we run out of levels;
  this._player = null;
  gLevel = levelData[0];
  this._level = new Level(gLevel);
  this._level.init();
  this.deferredSetup();
  levelNumberManager.resetLevel();
  lifeManager.resetLife();
},

reset: function() {
    /*
    for (var c = 0; c < this._categories.length; ++c) {
        this._categories[c] = [];
    }
    */
    this._holes = [];
    this._gold = [];
    this._guards = [];
    this._blocks = [];

    this._player = null;
    this._level = null;
    this.readyToAdvance = false;
},

    // TODO better have this in Player class?
// findInitalPositionOfEntity : function(entity){
//     let entities = [];
//     for(let j=0;j<gLevel.length;j++){
//         for(let i=0;i<gLevel[j].length;i++){
//             // if (gLevel[j][i] == entity) return {x:j,y:i};
//             if (gLevel[j][i] == entity) entities.push({x:i,y:j});
//         }
//     }
//     return entities;
// },

update: function(du) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;
        // console.log(this._blocks);
        while (i < aCategory.length) {
            var status = aCategory[i].update(du);
            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            // }
            } else {
                ++i;
            }
        }
    }

    if(this._gold.length == 0) {
        let guardCarriesGold = false;
        for(let i = 0; i < this._guards.length; i++) {
            if(this._guards[i].carriesGold) {
                guardCarriesGold = true;
                break;
            }
        }
        if(!guardCarriesGold && this._level != null) {
            this._level.revealLadders();
            this.readyToAdvance = true;
        }
    }
    if(g_playerDead) {
      g_playerDead = false;
      console.log("g_playerDead");
      this.resetLevel();
    }

    if(this._player !== null) {
      if(this.readyToAdvance && gPlayer.row === 0) {
        this.currentLevel++;
        levelNumberManager.nextLevel();
        this.resetLevel();
      }
  }
},

nextLevel: function() {
    this.reset();
    spatialManager.reset();
},

revealBlock: function(column, row) {
    let blocks = this._categories[1]

    for (let i = 0; i < blocks.length; i++) {
        if(blocks[i].x === column*GRID_BLOCK_W && blocks[i].y === row*GRID_BLOCK_H)  {
            console.log(blocks[i]);
            blocks[i].revealBlock();
        }
    }
},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
            aCategory[i].render(ctx);
        }
        debugY += 10;
    }
    if(this._player !== null) {
      this._player.render(ctx);
    }


},

//Feeds the guards a reference to player, called in level when all guards and player have been initialized
initPlayerInfo: function() {
    if(this._player !== null) gPlayer = this._player;
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
