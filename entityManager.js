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

_bricks   : [],
_gold : [],
_guards   : [],
_player: [],
_level: [],

// _bShowRocks : true,

// "PRIVATE" METHODS

_generateGuards : function() {
    var i,
        NUM_GUARDS = 4;

    for (i = 0; i < NUM_GUARDS; ++i) {
        this.generateGuard();
    }
},

// _findNearestShip : function(posX, posY) {
//     var closestShip = null,
//         closestIndex = -1,
//         closestSq = 1000 * 1000;

//     for (var i = 0; i < this._ships.length; ++i) {

//         var thisShip = this._ships[i];
//         var shipPos = thisShip.getPos();
//         var distSq = util.wrappedDistSq(
//             shipPos.posX, shipPos.posY, 
//             posX, posY,
//             g_canvas.width, g_canvas.height);

//         if (distSq < closestSq) {
//             closestShip = thisShip;
//             closestIndex = i;
//             closestSq = distSq;
//         }
//     }
//     return {
//         theShip : closestShip,
//         theIndex: closestIndex
//     };
// },

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
    this._categories = [this._guards, this._gold, this._bricks, this._level, this._player];
},

init: function() {
    this._level.push(new Level(gLevel));
    spatialManager.setLevel(this._level[0]);
    this.generatePlayer();
    //this._generateShip();
},

    // TODO better have this in Player class?
findInitalPositionOfPlayer : function(){
    for(let j=0;gLevel.length;j++){
        for(let i=0;i<gLevel[j].length;i++){
            if (gLevel[j][i] == 6) return {x:j,y:i};
        }
    }
},

generatePlayer : function(descr){
    const init = this.findInitalPositionOfPlayer();
    // console.log(init);
    this._player.push(new Player(init.x,init.y,init));
},

generateGuard : function(descr) {
    // this._guards.push(new Guard(descr));
},

generateGold : function(descr) {
    // this._gold.push(new Gold(descr));
},


update: function(du) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {
            var status = aCategory[i].update(du);
            // console.log(status);
            // if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                // aCategory.splice(i,1);
            // }
            // else {
                ++i;
            // }
        }
    }
    
    // if (this._rocks.length === 0) this._generateRocks();
    // console.log(this._categories);
},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        // if (!this._bShowRocks && 
        //     aCategory == this._rocks)
        //     continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

