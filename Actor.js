// ======
// ACTOR
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Actors. An Actor being a character that can move around and interact 
with the world. In this case, a guard and the player.

JavaScript's prototype-based inheritance system is unusual, and requires
some care in use. In particular, this "base" should only provide shared
functions... shared data properties are potentially quite confusing.

*/

"use strict";

//Constructor
// ========================================
// LIST OF REQUIRED CONSTRUCTOR PARAMETERS:
// ========================================
/*
    _x: Leftmost position of this actor
    _y: Topmost  position of this actor
    _speed: Movement Speed (pixls per frame, 1/60th of a second)
    _image: Image from which to get sprites
*/
function Actor(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this._isFalling = false;
    //this._sprites = this.generateSprites(this.ANIM.RIGHT);
/*
    // Diagnostics to check inheritance stuff
    this._actorProperty = true;
    console.dir(this);
*/

}

Actor.prototype = new Entity();

Actor.prototype.CLIMBABLE_BLOCK_TYPES = [BLOCKTYPE.LADDER];
Actor.prototype.COLLIDEABLE_BLOCK_TYPES = [BLOCKTYPE.BREAKABLE];
Actor.prototype.GRABBABLE_BLOCK_TYPES = [BLOCKTYPE.ROPE];

Actor.prototype.moveRight = function(du) {
    if(!this._isFalling) {
        this.dir = DIRECTION.RIGHT;
        this.spriteAnim(this.ANIM.RIGHT);
        this._velX = this._speed * du;
    }
};

Actor.prototype.moveLeft = function(du) {
    if(!this._isFalling) {
        this.dir = DIRECTION.LEFT;
        this.spriteAnim(this.ANIM.LEFT);
        this._velX = -this._speed * du;
    }
};

Actor.prototype.moveUp = function(du) {
    //console.log("canClimb : " + this._canClimb);
    if(this._canClimb) {
        this.dir = DIRECTION.UP;
        this.spriteAnim(this.ANIM.UP);
        this._velY = -this._speed * du;
    }
};

Actor.prototype.moveDown = function(du){
    //if we can climb we climb, if we cannot climb only then do we try dropping
    if(this._canClimb) {
        this.dir = DIRECTION.DOWN;
        this.spriteAnim(this.ANIM.DOWN);
        this._velY = this._speed * du;
    } else if(this._canDrop) {
        this.dir = DIRECTION.DOWN;
        this.spriteAnim(this.ANIM.FALL);
        this._velY = this._speed * du;
    }

};

Actor.prototype.move = function(du) {
    this._x += this._velX;
    if(this._isFalling) {this._velY += speed}
    this._y += this._velY;
    let collisions = spatialManager.checkLevelCollision(
        this._x + this._speed, this._y+1, GRID_BLOCK_W - 2*this._speed, GRID_BLOCK_H-2);
    let shouldFall = true;
    this._canClimb = false;
    this._canDrop = false;
    collisions.forEach(c => {
        if(c.posX === 0 && c.posY === 1 && !this.COLLIDEABLE_BLOCK_TYPES.includes(c.blockType)) {
            this._canDrop = true;
        }
        if(c.posX === 0 && c.posY === 1 && this.CLIMBABLE_BLOCK_TYPES.includes(c.blockType)) {
            this._canDrop = false;
            this._canClimb = true;
        }
        if(this.CLIMBABLE_BLOCK_TYPES.includes(c.blockType)) {
            this._canClimb = true;
            console.log("Can Climb Set");
        }
        if(this.COLLIDEABLE_BLOCK_TYPES.includes(c.blockType)) {
            //Player is moving down and collides with block below him.
            if(this._velY > 0 && c.posY === 1) { 
                 {this._y = util.gridY(this._y);}
                 shouldFall = false;
            }
            //Player is moving up and collides with block above him.
            else if(this._velY < 0 && c.posY === -1) {
                this._y = util.gridY(this._y) + GRID_BLOCK_H + 1;
            }
            //Player is moving right and collides with block to the right 
            if(this._velX > 0 && c.posX === 1) {
                this._x = util.gridX(this._x) + this._speed;
            //Player is moving left and collides with block to the left     
            } else if (this._velX < 0 && c.posX === -1) {
                this._x = util.gridX(this._x) + GRID_BLOCK_W - this._speed;
            }
        }
    });
    this._velX = 0;
    this._velY = 0;
}

// has direction of the actor changed between update cycle 
Actor.prototype.directionChanged = function() {
    if(this._dir != this._dirPrev) return true;
    return false;
};

// returns array of sprite frames
Actor.prototype.generateSprites = function(frames) {
    let sprites = [];
    let sprite;
    for(let e = 0; e < frames.length; e++){
        sprite = new Sprite(this.image,frames[e]);
        sprites.push(sprite);
    }
    return sprites;
};

// handles cycling through the spite frames and updates sprite object
Actor.prototype.spriteAnim = function(frames) {
    if(this.directionChanged) this.sprites = [];
    if(this._nextSpriteCounter < 0){
        if(this._sprites.length == 0) this._sprites = this.generateSprites(frames);
        this._nextSpriteCounter = this.SPRITEFREQ;
        this._sprite = this._sprites[this.csf];
        ++this._csf;

        if(this._csf === this._sprites.length) this._csf = 0;
    }
};

Actor.prototype.render = function(ctx){
        // this.sprite.drawAt(ctx, this._x, this._y);
        this._sprite.drawFromSpriteSheetAt(ctx, this._x,this._y);
};