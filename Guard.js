class Guard extends Actor{
    constructor(x,y){
        super();
        this.x = x*GRID_BLOCK_W;
        this.y = y*GRID_BLOCK_H;
        this.row = x;
        this.column = y;
        // this.pos = pos;
        this.speed = 2; 
        this.image = g_images.guard;
        this.sprite = g_sprites.guard;
        this.PASSES = {SIDEWAYS:[0,2,4,5,6,8],
                       UP:[0,2,4,5,6],
                       DOWN:[0,2,4,5,6]};
        this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6],FALL: [8,8]};
        this.sprites = this.generateSprites(this.ANIM.LEFT);
        this.csf = 0; //currentSpriteFrame
        this.dir = DIRECTION.LEFT;
        this.dirPrev = DIRECTION.LEFT;
        this.SPRITEFREQ = 3; // requests next sprite every 3rd update
        // got this value by visual trial and error
        // formula at the bottom didn't work as exptected
        this.nextSpriteCounter = this.SPRITEFREQ;


    }

    update(du){
        this.nextSpriteCounter -= du;
        const d = this.dir * this.dirPrev;
        if(this.isDirectionChange()) this.correctPosition();
        //track previous direction
        this.dirPrev = this.dir;
        if(this.canMove(DIRECTION.LEFT)) this.moveLeft(du);

        Entity.prototype.setPos(this.x+GRID_BLOCK_W/2,this.y+GRID_BLOCK_H/2);

        this.row = Math.ceil(this.y/GRID_BLOCK_H);
        // determine column from center of actor
        this.column = Math.ceil((this.x-20)/GRID_BLOCK_W);
    }
}
