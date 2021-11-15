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

_holes   : [],
_gold : [],
_guards   : [],
_player: [],
_level: [],
_blocks: [],


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
    this._level.push(new Level(gLevel));
    this._level[0].init();
    // this.initLevel(gLevel);
    // this.generatePlayer();
    // this.generateGuards();
    // this.generateGold();

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

//     generatePlayer : function(x,y){
//     // const init = this.findInitalPositionOfEntity(BLOCKTYPE.PLAYER_SPAWN);
//         this._player.push(new Player(x,y));
// },

//     generateGuard : function(x,y) {
//     // const init = this.findInitalPositionOfEntity(BLOCKTYPE.GUARD_SPAWN);
//     // for(let i=0;i<init.length;i++){
//     //     this._guards.push(new Guard(init[i].x,init[i].y));
//     // }
//     this._guards.push(new Guard(x,y));
// },

//     generateGold : function(x,y) {
//         this._gold.push(new Gold(x,y));
// },

//     generateBlock : function(e,x,y){
//         this._blocks.push(e,x,y);
//     },


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
                guardHasGold = true;
                break;
            }
        }
        if(!guardCarriesGold) {
            this._level[0].revealLadders();
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

