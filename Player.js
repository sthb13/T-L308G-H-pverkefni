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

        if(this.state == STATE.FALLING || this.state == STATE.LANDING) this.fallingDown(du);

        if(keys[this.KEY_LEFT]) this.move(du, DIRECTION.LEFT);
        if(keys[this.KEY_RIGHT]) this.move(du, DIRECTION.RIGHT);
        if(keys[this.KEY_DOWN]) this.move(du, DIRECTION.DOWN);
        if(keys[this.KEY_UP]) this.move(du, DIRECTION.UP);
        this.state = this.checkState();
         this.correctPosition();
        Entity.prototype.setPos(this.x,this.y);
        // this.row = Math.floor(this.y/GRID_BLOCK_H);
        // this.column = Math.floor(this.x/GRID_BLOCK_W);
        this.row = Math.round(this.y/GRID_BLOCK_H);
        this.column = Math.round(this.x/GRID_BLOCK_W);
        // this.row = Math.ceil(this.y/GRID_BLOCK_H);
        // this.column = Math.ceil(this.x/GRID_BLOCK_W);
        spatialManager.register(this);
         // this.debug();
    }
}
