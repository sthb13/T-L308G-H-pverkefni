class Player extends Actor{
    constructor(x,y){
        super();
        this.x = x*GRID_BLOCK_W;
        this.y = y*GRID_BLOCK_H;
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
        this.KEY_HOLE_LEFT = 'J'.charCodeAt(0);
        this.KEY_HOLE_RIGHT = 'K'.charCodeAt(0);
        this.PASSES = {SIDEWAYS:[0,2,4,5,6,8], //air,ladder,rope...
                       UP:[0,2,4,5,6],
                       DOWN:[0,2,4,5,6]};
        this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6],FALL: [8,8]};
        this.sprites = this.generateSprites(this.ANIM.RIGHT);
        this.csf = 0; //currentSpriteFrame
        this.dir = DIRECTION.RIGHT;
        this.dirPrev = DIRECTION.RIGHT;
        this.SPRITEFREQ = 3; // requests next sprite every 3rd update
                             // got this value by visual trial and error
                             // formula at the bottom didn't work as exptected
        this.nextSpriteCounter = this.SPRITEFREQ;
    }

 
    // has direction of player changed between update cycle 

    update(du){

        this.nextSpriteCounter -= du;
        const d = this.dir * this.dirPrev;
        if(this.isDirectionChange()) this.correctPosition();
        //track previous direction
        this.dirPrev = this.dir;
        // if(keys[this.KEY_LEFT] && this.canMoveH(-1)) this.moveLeft(du);
        if(this.blocks[2][1] == BLOCKTYPE.AIR) this.fallingDown(du);
        if(this.blocks[2][1] == BLOCKTYPE.BREAKABLE) this.correctPosition();
        
        if(keys[this.KEY_LEFT] && this.canMove(DIRECTION.LEFT)) this.moveLeft(du);
        // if(keys[this.KEY_RIGHT] && this.canMoveH(0)) this.moveRight(du);
        if(keys[this.KEY_RIGHT] && this.canMove(DIRECTION.RIGHT)) this.moveRight(du);
        if(keys[this.KEY_UP] && this.canMove(DIRECTION.UP)) this.moveUp(du);
        if(keys[this.KEY_DOWN] && this.canMove(DIRECTION.DOWN)) this.moveDown(du);

        if(keys[this.KEY_HOLE_LEFT]) {
            entityManager._holes.push(new Hole(this.column-1,this.row+1));
        }

        if(keys[this.KEY_HOLE_RIGHT]) {
            entityManager._holes.push(new Hole(this.column+1,this.row+1));
            }

        Entity.prototype.setPos(this.x+GRID_BLOCK_W/2,this.y+GRID_BLOCK_H/2);
        this.row = Math.ceil(this.y/GRID_BLOCK_H);
        // determine column from center of actor
        this.column = Math.ceil((this.x-20)/GRID_BLOCK_W);
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
