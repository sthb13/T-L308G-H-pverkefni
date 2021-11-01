class Player {
    constructor(x,y, pos){
        this.x = x*GRID_BLOCK_X;
        this.y = y*GRID_BLOCK_Y;
        this.row = x;
        this.column = y;
        this.pos = pos;
        this.speed = 4;
        this.sprite = g_sprites.player;
        this.KEY_LEFT = 'A'.charCodeAt(0);
        this.KEY_RIGHT = 'D'.charCodeAt(0);
        this.KEY_UP = 'W'.charCodeAt(0);
        this.KEY_DOWN = 'S'.charCodeAt(0);
        this.KEY_HOLE_LEFT = 'J'.charCodeAt(0);
        this.KEY_HOLE_RIGHT = 'K'.charCodeAt(0);
        this.passesThroughH = [0,2,4,5,6];
        this.passesThroughUp = [2,5,6,7];
        this.passesThroughDown = [0,2,5,6,7];
        this.animationFrames = [0,1,2];
        this.sprites = [];
        this.upddateFrame = 0;
    }

    canMoveH(dir){
        if(this.passesThroughH.includes(gLevel[this.row][this.column+dir])) return true;
        return false;
    }

    canMoveV(dir){
        if(this.passesThroughUp.includes(gLevel[this.row+dir][this.column])) return true;

        return false;
    }

    nextMove(){

    }
    whereCanIMove(){

    }

    spriteAnimition(frames){
        var celWidth = 40;
        var celHeight = 44;
        let sprite;
        for(let e = 0; e < frames.length; e++){
           sprite = new Sprite(frames[e]*celWidth,0, celWidth, celHeight);
            sprites.push(sprite)
        }
    }

    update(du){
        // TODO must be implemented differently, object must know movement
        // direction and handle the drawing
        if(keys[this.KEY_LEFT] && this.canMoveH(-1)) {
            // array holding the sprite index (only 1d array)
            this.animationFrames = [3,4,5];
            // TODO spriteAnimation

            this.x -= this.speed * du;
            this.upddateFrame++;
        }
        if(keys[this.KEY_RIGHT] && this.canMoveH(0)) {
            this.animationFrames = [0,1,2];
            this.x += this.speed * du;
        }
        if(keys[this.KEY_UP] && this.canMoveV(-1)) this.y -= this.speed * du;
        if(keys[this.KEY_DOWN] && this.canMoveV(0)) this.y += this.speed * du;
        this.row = Math.ceil(this.y/44);
        this.column = Math.ceil(this.x/40);
        console.log(this.row,this.column);
    }

    render(ctx){
        this.sprite.drawAt(ctx, this.x, this.y);
    }
}
