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

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    // DONE: YOUR STUFF HERE!
    return this._nextSpatialID++;

},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    var width = 40;
    var height = 44;
    // var width = entity.getWidth();
    // var height = entity.getHeight()
    
    // DONE: YOUR STUFF HERE!
    this._entities[spatialID] = {posX: pos.posX, posY: pos.posY, width, height, entity}
    
    
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // DONE: YOUR STUFF HERE!
    delete this._entities[spatialID];

},

//TODO: Test and Fix
reset: function() {
    this._nextSpatialID = 1;
    this._entities = [];
},

findEntityInRange: function(posX, posY, radius) {
    // DONE: YOUR STUFF HERE!
    for (let i=0;i<this._entities.length;i++) {
        let e = this._entities[i];
        if(e){
        const d = util.distSq(posX,posY, e.posX, e.posY);
        // const r = util.square(radius+e.radius);
        const b = util.square(40);
        // if(d < b) return e.entity;
            console.log(d,b);
            
            if(d < b) return true;
        }
    }
    return false;
},

render: function(ctx) {
    // console.log(this._entities);
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    // for (var ID in this._entities) {
     for (let i=0;i<this._entities.length;i++) {
        const e = this._entities[i];
        if(e) {
            console.log(e.entity);
            util.fillBox(ctx, e.posX, e.posY, 40,44,"rgba(255,0,0,0.5)") };
    }
    ctx.strokeStyle = oldStyle;
},

//Returns true if any of the entities in entities collide with the box defined by posX, posY, width, height
    checkBoxCollision: function(posX, posY, width, height, entities) {
        // console.log(this._entities);
        // console.log(entities);
        // if(this._entities.length > 0){
             // let collision = true;
        // console.log(`_entities: ${this._entities[3]}`);
            for (let i=0;i<this._entities.length;i++) {
                const e = this._entities[i];
                if(e){
                    console.log("posX: " + posX, e.posX + "  posY: " + posY, e.posY);
                    if(posX > e.posX && posY == e.posY) return true;
                // if(posX < e.posX + e.width) { collision = false;} //A.X1 < B.X2
                // else if(posX + width > e.posX) { collision = false;} //A.X2 > B.X1
                // else if(posY < e.posY + e.height) {collision = false;} //A.Y1 < B.Y2
                // else if(posY + height > e.posY) {collision = false;} //A.Y2 > B.Y1
                }}
            // return collision;

    },
    // } 
    checkExtremeties: function(x,y){
        if(x > 0 && x < 1080 && y > 0 && y < 704) return true;
        return false;
    },

    boxCollision: function(x,y,type){
    const t = 30; //tolerance
        for (let i=0;i<this._entities.length;i++) {
            const e = this._entities[i];
            if(e){
                //don't check collision with itself
                if (e.entity.type != type){
                    if  (x < e.posX + e.width - t &&
                         x + e.width - t> e.posX &&
                         y < e.posY + e.height &&
                         e.height + y > e.posY) return e.entity;
                }
            }
            
        }
    return false;
},

}
