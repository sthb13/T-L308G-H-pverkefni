class Player extends Actor{
    constructor(x,y){
        super();
        super.setup();

        this.x = x;
        this.y = y;
        
        this.row = x;
        this.column = y;
        // this.pos = pos;
        this.speed = 4; // ~240 px/s
        this.image = g_images.player;
        this.sprite = g_sprites.player;
        this.KEY_LEFT = 'A'.charCodeAt(0);
        this.KEY_RIGHT = 'D'.charCodeAt(0);
        this.KEY_UP = 'W'.charCodeAt(0);
        this.KEY_DOWN = 'S'.charCodeAt(0);
        this.KEY_HOLE_LEFT = 'Z'.charCodeAt(0);
        this.KEY_HOLE_RIGHT = 'X'.charCodeAt(0);
        this.PASSES = {SIDEWAYS:[0,2,4,5,6,8], //air,ladder,rope...
                       UP:[0,2,4,5,6],
                       DOWN:[0,2,4,5,6]};
        this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6],FALL: [8,8], ROPE_RIGHT:[9,10,11], ROPE_LEFT:[12,13,14]};
        this.sprites = this.generateSprites(this.ANIM.RIGHT);
        this.csf = 0; //currentSpriteFrame
        this.dir = DIRECTION.RIGHT;
        this.dirPrev = DIRECTION.RIGHT;
        this.SPRITEFREQ = 3; // requests next sprite every 3rd update
                             // got this value by visual trial and error
                             // formula at the bottom didn't work as exptected
        this.nextSpriteCounter = this.SPRITEFREQ;
    }


    update(du){
        spatialManager.unregister(this);
        this.nextSpriteCounter -= du;
        this.dirPrev = this.dir;
        this.prevState = this.state;
        
        // track surroung blocks
        this.blocks = this.surroundingBlocks(this.row,this.column);

        if(this.state == STATE.FALLING) this.fallingDown(du);

        if(keys[this.KEY_LEFT]) this.move(du, DIRECTION.LEFT);
        if(keys[this.KEY_RIGHT]) this.move(du, DIRECTION.RIGHT);
        if(keys[this.KEY_DOWN]) this.move(du, DIRECTION.DOWN);
        if(keys[this.KEY_UP]) this.move(du, DIRECTION.UP);
        this.state = this.checkState();
        this.correctPosition();
        Entity.prototype.setPos(this.x,this.y);
        this.row = Math.round(this.y/GRID_BLOCK_H);
        this.column = Math.round(this.x/GRID_BLOCK_W);
        spatialManager.register(this);
        // this.debug();
    }

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
