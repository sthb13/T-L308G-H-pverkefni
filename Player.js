function Player(x,y,pos) {
    this._x = x*GRID_BLOCK_W;
    this._velX = 0;
    this._y = y*GRID_BLOCK_H;
    this._velY = 0;
    this._row = x;
    this._column = y;
    this._pos = pos;
    this._speed = 4; // ~240 px/s
    this._image = g_images.player;
    this._sprite = g_sprites.player;
    this._shouldFall = false;
    this.KEY_LEFT = 'A'.charCodeAt(0);
    this.KEY_RIGHT = 'D'.charCodeAt(0);
    this.KEY_UP = 'W'.charCodeAt(0);
    this.KEY_DOWN = 'S'.charCodeAt(0);
    this.KEY_HOLE_LEFT = 'J'.charCodeAt(0);
    this.KEY_HOLE_RIGHT = 'K'.charCodeAt(0);
    this.COLLIDEABLE_BLOCK_TYPES = [BLOCKTYPE.BREAKABLE, BLOCKTYPE.UNBREAKABLE];
    this.CLIMBABLE_BLOCK_TYPES = [BLOCKTYPE.LADDER];
    this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6]};
    this._sprites = this.generateSprites(this.ANIM.RIGHT);
    this._csf = 0; //currentSpriteFrame
    this._dir = DIRECTION.RIGHT;
    this._dirPrev = DIRECTION.RIGHT;
    this.SPRITEFREQ = 3; // requests next sprite every 3rd update
                            // got this value by visual trial and error
                            // formula at the bottom didn't work as exptected
    this._nextSpriteCounter = this.SPRITEFREQ;
}

Player.prototype = new Actor();

Player.prototype.update = function(du) {
    this.nextSpriteCounter -= du;
    //track previous direction
    this.dirPrev = this.dir;
    if(keys[this.KEY_LEFT]) this.moveLeft(du);
    if(keys[this.KEY_RIGHT]) this.moveRight(du);
    if(keys[this.KEY_UP]) this.moveUp(du);
    if(keys[this.KEY_DOWN]) this.moveDown(du);
    this.move();
}

/*

  player moves 240px/s at speed 4 (60 x 4)
  sprite is 40px wide
  we need 6 updates to cover that distance
  60/6 = 10 so should update every 10th of a second

  4 * 60 = 240
  240 / 40 = 6
  60/6 = 10

  60 / 4 * 60 / 40

  SECS_TO_NOMINALS/((speed*SECS_TO_NOMINALS)/sprite.width


*/
