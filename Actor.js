class Actor extends Entity{
    constructor(){
        super();

        this._isFalling = false;
        this.CLIMBABLE_BLOCK_TYPES = [BLOCKTYPE.LADDER];
        this.COLLIDEABLE_BLOCK_TYPES = [BLOCKTYPE.BREAKABLE];
        this.GRABBABLE_BLOCK_TYPES = [BLOCKTYPE.ROPE];
        this.blocks = this.surroundingElements(this.row,this.column);
        this.prevX = this.x;
        this.prevY = this.x;
        this.prevX = this.x;
        this.prevY = this.y;
    }

    canMove(where){
        //check 9 blocks around itself
        //      13,14,15
        // 13 [[ 0, 0, 0]    
        // 14  [ 0, 6, 0] // blocks[1][1] is current pos 
        // 15  [ 1, 1, 1]]
        
        const cx = this.getPos().posX;
        // console.log(cx, this.x);
        this.blocks = this.surroundingElements(this.row, this.column);
        // console.log(blocks[1][0], this.PASSES.SIDEWAYS);
        // if(where == DIRECTION.LEFT && this.PASSES.SIDEWAYS.includes(this.blocks[1][0])) return true;
        // if(where == DIRECTION.RIGHT && this.PASSES.SIDEWAYS.includes(this.blocks[1][2])) return true;
        // if(where == DIRECTION.UP
          // && this.PASSES.UP.includes(this.blocks[0][1])
           // && (this.blocks[1][1] == BLOCKTYPE.LADDER
               // ||  this.blocks[1][1] == BLOCKTYPE.ROPE)) return true;

        // if(where == DIRECTION.DOWN
           // && this.PASSES.DOWN.includes(this.blocks[0][1])
           // && (this.blocks[1][1] == BLOCKTYPE.LADDER
               // || this.blocks[2][1] == BLOCKTYPE.LADDER)) return true;
        return true;
    }

    correctPosition(){
        // const d = this.dirPrev - this.dir;
        // if(d % 2 !== 0){
        if(this.x != this.prevX){
            console.log("moving to: " + this.column * GRID_BLOCK_W);
            // this.x = this.column * GRID_BLOCK_W;
            // this.y = this.row * GRID_BLOCK_H;
        }
        // if(this.y != this.prevY) this.x = this.column * GRID_BLOCK_H;
    }

    surroundingElements(r,c){
        const blocks = [[],[],[]];
        // console.log(c,blocks);
         if(r > 0 && r < 15){
             this.updateElement(blocks,r,c,-1,2);
         } else if (r == 0){
             this.updateElement(blocks,r,c,0,2);
         } else if (r == 15) {
             this.updateElement(blocks,r,c,-1,1);
         }
        return blocks;
    }

    updateElement(blocks, r,c,s,e){
        for(let j=s;j<e;j++){
            for(let i=-1;i<2;i++){
                if(typeof gLevel[r+j][c+i] !== 'undefined') {
                    blocks[j+1][i+1] = gLevel[r+j][c+i];
                } else {
                    blocks[j+1][i+1] = undefined;
                }
            }
        }
    }

    move(du,dir){
        if(this._isFalling) return;
        if(!spatialManager.checkCollision(this.x,this.y) &&
           spatialManager.checkExtremeties(this.x,this.y)){
            if(dir == DIRECTION.RIGHT || dir == DIRECTION.LEFT) this.prevX = this.x;
            if(dir == DIRECTION.UP || dir == DIRECTION.DOWN) this.prevY = this.y;
            this.dir = dir;
            switch(dir){
            case DIRECTION.RIGHT:
                this.spriteAnim(this.ANIM.RIGHT);
                this.x += this.speed * du;
                break;
            case DIRECTION.LEFT:
                this.spriteAnim(this.ANIM.LEFT);
                this.x -= this.speed * du;
                break;
            case DIRECTION.DOWN:
                this.spriteAnim(this.ANIM.DOWN);
                this.y += this.speed * du;
                break;
            case DIRECTION.UP:
                this.spriteAnim(this.ANIM.UP);
                this.y -= this.speed * du;
                // this.correctPosition();
                break;
            }
            // this.correctPosition();
            // this.blocks = this.surroundingElements(this.row,this.column);
            
        }else{
            if(dir == DIRECTION.RIGHT || dir == DIRECTION.LEFT) this.x = this.prevX;
            if(dir == DIRECTION.UP || dir == DIRECTION.DOWN) this.x = this.prevX;
        }
    }
  
    fallingDown(du){
        // this.correctPosition();
        // this.x = this.prevX;
        if(!spatialManager.checkCollision(this.x,this.y) &&
           spatialManager.checkExtremeties(this.x,this.y)){

            this._isFalling = true;
            this.dir = DIRECTION.DOWN;
            this.spriteAnim(this.ANIM.FALL);
            this.y += this.speed * du;

        }else{
        // if(this.y == this.prevY){
            this._isFalling = false;
            // this.move(du,DIRECTION.RIGHT);
        }
    }
    
// moveDown(du){
//     //if we can climb we climb, if we cannot climb only then do we try dropping
//     if(this._canClimb) {
//         this.dir = DIRECTION.DOWN;
//         this.spriteAnim(this.ANIM.DOWN);
//         this._velY = this._speed * du;
//     } else if(this._canDrop) {
//         this.dir = DIRECTION.DOWN;
//         this.spriteAnim(this.ANIM.FALL);
//         this._velY = this._speed * du;
//     }

// };

    isDirectionChange(){
        if(this.dir != this.dirPrev) {
            // TODO should be called somewhere else
            // this.correctPosition();
            return true;
        }
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
        if(this.isDirectionChange()) {
            this.csf = 0;
            this.sprites = [];
        }
        if(this.nextSpriteCounter < 0){
            if(this.sprites.length == 0) this.sprites = this.generateSprites(frames);
            this.nextSpriteCounter = this.SPRITEFREQ;
            // console.log(this.csf);
            this.sprite = this.sprites[this.csf];
            this.csf++;

            if(this.csf === this.sprites.length) this.csf = 0;
        }
    }

    render(ctx){
        // this.sprite.drawAt(ctx, this.x, this.y);
        // console.log(this.sprite);
        this.sprite.drawFromSpriteSheetAt(ctx, this.x,this.y);
    }


}
