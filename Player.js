class Player {
    constructor(x,y, pos){
        this.x = x*GRID_BLOCK_W;
        this.y = y*GRID_BLOCK_H;
        this.row = x;
        this.column = y;
        this.pos = pos;
        this.speed = 4; // ~240 px/s
        this.image = g_images.player;
        this.sprite = g_sprites.player;
        this.KEY_LEFT = 'A'.charCodeAt(0);
        this.KEY_RIGHT = 'D'.charCodeAt(0);
        this.KEY_UP = 'W'.charCodeAt(0);
        this.KEY_DOWN = 'S'.charCodeAt(0);
        this.KEY_HOLE_LEFT = 'J'.charCodeAt(0);
        this.KEY_HOLE_RIGHT = 'K'.charCodeAt(0);
        this.PASSES = {SIDEWAYS:[0,2,4,5,6],
                       UP:[2,5,6,7],
                       DOWN:[0,2,5,6,7]};
        this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6]};
        this.sprites = this.generateSprites(this.ANIM.RIGHT);
        this.csf = 0; //currentSpriteFrame
        this.dir = DIRECTION.RIGHT;
        this.dirPrev = DIRECTION.RIGHT;
        this.SPRITEFREQ = 3; // requests next sprite every 3rd update
                             // got this value by visual trial and error
                             // formula at the bottom didn't work as exptected
        this.nextSpriteCounter = this.SPRITEFREQ;
    }

    canMoveH(dir){
        // TODO spatialManager should take care of this

        if(this.PASSES.SIDEWAYS.includes(gLevel[this.row][this.column+dir])) return true;
        return false;
    }

    canMoveV(dir){
        if(this.PASSES.UP.includes(gLevel[this.row+dir][this.column])) return true;

        return false;
    }

    dig(dir){
                gLevel[this.row+1][this.column+dir] = 0;    
    }

    // has direction of player changed between update cycle 
    isDirectionChange(){
        if(this.dir != this.dirPrev) return true;
        return false;
    }

    // returns array of sprite frames
    generateSprites(frames){
        let sprites = [];
        let sprite;
        for(let e = 0; e < frames.length; e++){
            sprite = new Sprite(this.image,frames[e]);
            sprites.push(sprite);
        }
        return sprites;
    }

    // handles cycling through the spite frames and updates sprite object
    spriteAnim(frames){
        if(this.isDirectionChange) this.sprites = [];
        if(this.nextSpriteCounter < 0){
            if(this.sprites.length == 0) this.sprites = this.generateSprites(frames);
            this.nextSpriteCounter = this.SPRITEFREQ;
            this.sprite = this.sprites[this.csf];
            ++this.csf;

            if(this.csf === this.sprites.length) this.csf = 0;
        }
    }

    moveRight(du){
        this.dir = DIRECTION.RIGHT;
        this.spriteAnim(this.ANIM.RIGHT);
        this.x += this.speed * du;
    }

    moveLeft(du){
        this.dir = DIRECTION.LEFT;
        this.spriteAnim(this.ANIM.LEFT);
        this.x -= this.speed * du;
    }

    moveUp(du){
        this.dir = DIRECTION.UP;
        this.spriteAnim(this.ANIM.UP);
        this.y -= this.speed * du;
    }

    moveDown(du){
        this.dir = DIRECTION.DOWN;
        this.spriteAnim(this.ANIM.DOWN);
        this.y += this.speed * du;
    }

    update(du){
        this.nextSpriteCounter -= du;
        //track previous direction
        this.dirPrev = this.dir;
        if(keys[this.KEY_LEFT] && this.canMoveH(-1)) this.moveLeft(du);
        if(keys[this.KEY_RIGHT] && this.canMoveH(0)) this.moveRight(du);
        if(keys[this.KEY_UP] && this.canMoveV(-1)) this.moveUp(du);
        if(keys[this.KEY_DOWN] && this.canMoveV(0)) this.moveDown(du);
        if(keys[this.KEY_HOLE_RIGHT]) this.dig(1);
        if(keys[this.KEY_HOLE_LEFT]) this.dig(-1);

        // track current grid cel
        this.row = Math.ceil(this.y/GRID_BLOCK_H);
        this.column = Math.ceil(this.x/GRID_BLOCK_W);
    }

    render(ctx){
         // this.sprite.drawAt(ctx, this.x, this.y);
         this.sprite.drawFromSpriteSheetAt(ctx, this.x,this.y);
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
