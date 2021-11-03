class Player {
    constructor(x,y, pos){
        this.x = x*GRID_BLOCK_W;
        this.y = y*GRID_BLOCK_H;
        this.row = x;
        this.column = y;
        this.pos = pos;
        this.speed = 4;
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
        this.sprites = [];
        this.csf = 0; //currentSpriteFrame
        
    }

    canMoveH(dir){
        spatialManager

        if(this.PASSES.SIDEWAYS.includes(gLevel[this.row][this.column+dir])) return true;
        return false;
    }

    canMoveV(dir){
        if(this.PASSES.UP.includes(gLevel[this.row+dir][this.column])) return true;

        return false;
    }

    nextMove(){

    }
    
    whereCanIMove(){

    }

    dig(dir){
        if (dir === 1) {
            if (gLevel[this.row+1][this.column+2] === 1) {
                gLevel[this.row+1][this.column+2] = 0;    
            }
        }
        else {
            if (gLevel[this.row+1][this.column] === 1) {
                gLevel[this.row+1][this.column] = 0;    
            }
        }
    }


    generateSprites(frames){
        this.sprites = [];
        let sprite;
        for(let e = 0; e < frames.length; e++){
            sprite = new Sprite(this.image,frames[e]);
            this.sprites.push(sprite);
        }
    }

    spriteAnim(frames){
        this.generateSprites(frames);
        // TODO there must be a better way to handle this
        setTimeout(() => this.sprite = this.sprites[this.csf], 60);
        ++this.csf;
        if(this.csf === this.sprites.length) this.csf = 0;
    }

    update(du){
        // TODO must be implemented differently, object must know movement
        // direction and handle the drawing
        // let cel = 0;
        if(keys[this.KEY_LEFT] && this.canMoveH(-1)) {
            // array holding the sprite index (only 1d array)
            // TODO spriteAnim, kinda works but doesn't feel right
            this.spriteAnim(this.ANIM.LEFT);
            this.x -= this.speed * du;
        }
        if(keys[this.KEY_RIGHT] && this.canMoveH(0)) {
            this.spriteAnim(this.ANIM.RIGHT);
            this.x += this.speed * du;
        }
        if(keys[this.KEY_UP] && this.canMoveV(-1)) {
            this.spriteAnim(this.ANIM.UP);
            this.y -= this.speed * du; 
        }
        if(keys[this.KEY_DOWN] && this.canMoveV(0)) {
            this.spriteAnim(this.ANIM.DOWN);
            this.y += this.speed * du; 
        }
        
        if(keys[this.KEY_HOLE_LEFT]) {
                this.dig(-1);
            }
        if(keys[this.KEY_HOLE_RIGHT]) {
                this.dig(1);
                
            }
            
        this.row = Math.ceil(this.y/GRID_BLOCK_H);
        this.column = Math.ceil(this.x/GRID_BLOCK_W);
    }
 
    render(ctx){
         // this.sprite.drawAt(ctx, this.x, this.y);
         this.sprite.drawFromSpriteSheetAt(ctx, this.x,this.y);
    }
}
