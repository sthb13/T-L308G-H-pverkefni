/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],
_level : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    // DONE: YOUR STUFF HERE!
    return this._nextSpatialID++;

},

setLevel : function(level) {
    this._level = level;
    //console.log("Level Set", this._level);
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    var width = entity.getWidth();
    var height = entity.getHeight()
    
    // DONE: YOUR STUFF HERE!
    this._entities[spatialID] = {posX: pos.posX, posY: pos.posY, width, height, entity};
    
    
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // DONE: YOUR STUFF HERE!
    delete this._entities[spatialID];

},

findEntityInRange: function(posX, posY, radius) {
    // DONE: YOUR STUFF HERE!
    for (const ID in this._entities){
        let e = this._entities[ID];
        const d = util.distSq(posX,posY, e.posX, e.posY);
        const r = util.square(radius+e.radius);
        if(d < r) return e.entity;
    }
    return false;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
},

//Returns true if any of the entities in entities collide with the box defined by posX, posY, width, height
checkBoxCollision: function(posX, posY, width, height, entities) {
    for (const ID in entities) {
        let e = this._entities[ID];
        let collision = true;
        if(posX > e.posX + e.width) { collision = false;} //A.X1 > B.X2
        else if(posX + width < e.posX) { collision = false;} //A.X2 < B.X1
        else if(posY > e.posY + e.height) {collision = false;} //A.Y1 > B.Y2
        else if(posY + height < e.posY) {collision = false;} //A.Y2 < B.Y1
    }
    return collision;
},

//Returns the blocktypes adjacent to an object at posisiton given.
//From top left to bottom right (in reading order.) Return Unbreakable type if out of bounds.
getAdjacentBlocks: function(posX, posY, width, height) {
    let centerX = posX + width/2;
    let centerY = posY + height/2;
    centerX = Math.floor(centerX / GRID_BLOCK_W);
    centerY = Math.floor(centerY / GRID_BLOCK_H);
    let adjacentBlocks = [];
    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            if(centerX + j < 0 || centerX + j >= NUM_COLUMNS_OF_BLOCKS || centerY + i < 0 || centerY + i >= NUM_ROWS_OF_BLOCKS) {
                adjacentBlocks.push(BLOCKTYPE.UNBREAKABLE);
            } else {
                adjacentBlocks.push(this._level.getBlockType(centerX + j, centerY + i));
            }
        }
    }
    return adjacentBlocks;
}

}
