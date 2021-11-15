class Actor extends Entity{
    constructor(){
        super();

        // this._isFalling = false;
        // this.CLIMBABLE_BLOCK_TYPES = [BLOCKTYPE.LADDER];
        this.COLLIDEABLE_BLOCK_TYPES = [BLOCKTYPE.BREAKABLE, BLOCKTYPE.SOLID];
        // this.GRABBABLE_BLOCK_TYPES = [BLOCKTYPE.ROPE];
        this.blocks = this.surroundingBlocks(this.row,this.column);
        this.state = STATE.ONBLOCK; //check if this is true
        this.prevState = this.state;
        this.spriteChange = false;

        this.above = this.blocks[0][1];  //
        this.center = this.blocks[1][1]; //
        this.below = this.blocks[2][1];  // convenience fields to avoid
        this.left = this.blocks[1][0];   // logic errors
        this.right = this.blocks[1][2];  //
        this.maxX = 0;
        this.correctionNeeded = false;
        this.canClimbUp = false;
        this.canClimbDown = false;
        this.isClimbing = false;
    }

    move(du,dir){
        if(this.state == STATE.FALLING) return;
        //console.log(this.below == BLOCKTYPE.LADDER && this.y < this.row * GRID_BLOCK_H)
        if(this.isPlayer) {
            //console.log(this.below == BLOCKTYPE.LADDER);
        }

        if(this.below == BLOCKTYPE.LADDER ||
            this.center == BLOCKTYPE.LADDER && this.y < this.row * GRID_BLOCK_H) {
            this.canClimbDown = true;
        } else {
            this.canClimbDown = false;
        }

        if(this.center == BLOCKTYPE.LADDER ||
            this.below == BLOCKTYPE.LADDER && this.y > this.row * GRID_BLOCK_H ||
            this.above == BLOCKTYPE.LADDER && this.y < (this.row+0.25) * GRID_BLOCK_H ) {
                this.canClimbUp = true;
            }
        else {
            this.canClimbUp = false;
        }

        if(this.state == STATE.INROPE && this.below == BLOCKTYPE.AIR) {
            this.canDrop = true;
        } else {
            this.canDrop = false;
        }


        this.dir = dir;
        switch(dir){
        case DIRECTION.RIGHT:
            this.isClimbing = false;
            if(this.COLLIDEABLE_BLOCK_TYPES.includes(this.right)){
                if(this.x > this.column * GRID_BLOCK_W ) return;
            }
            if(this.state == STATE.INROPE) this.spriteAnim(this.ANIM.ROPE_RIGHT);
            if(this.state == STATE.ONBLOCK) this.spriteAnim(this.ANIM.RIGHT);
            this.x += this.speed * du;
            break;
        case DIRECTION.LEFT:
            this.isClimbing = false;
            if(this.COLLIDEABLE_BLOCK_TYPES.includes(this.left)) {
                if(this.x < this.column * GRID_BLOCK_W ) return;
            }
            if(this.state == STATE.INROPE) this.spriteAnim(this.ANIM.ROPE_LEFT);
            if(this.state == STATE.ONBLOCK) this.spriteAnim(this.ANIM.LEFT);
            this.x -= this.speed * du;
            break;
        case DIRECTION.DOWN:
            if(!this.canClimbDown) {
                if(this.canDrop) {
                    this.x = this.column * GRID_BLOCK_W;
                    this.y += this.speed * du;
                }
                return;
            }

            this.isClimbing = true;
            this.spriteAnim(this.ANIM.DOWN);
            this.x = this.column * GRID_BLOCK_W;
            this.y += this.speed * du;
            break;
        case DIRECTION.UP:
            if(!this.canClimbUp) {
                return;
            }

            this.isClimbing = true;
            this.spriteAnim(this.ANIM.UP);
            this.x = this.column * GRID_BLOCK_W;
            this.y -= this.speed * du;
            break;
        }
    }

    checkState(){
        // more specific states need to be on top

        // close to the top of the ladder
        /*
        if(this.center == BLOCKTYPE.LADDER &&
           (this.above == BLOCKTYPE.LADDER ||
            this.above == BLOCKTYPE.AIR ||
            this.above == BLOCKTYPE.ROPE)) return STATE.CANCLIMB;


        // climbing in the ladder
        if(this.below == BLOCKTYPE.BREAKABLE &&
           this.center == BLOCKTYPE.LADDER) return STATE.CANCLIMB;
        */

        if(this.isClimbing) {
            return this.CLIMBING;
        }

        //TODO: Remove this Debug statement
        if(this.isPlayer) {
            // console.log(this.center);
        }
        //End of DEBUG

        if(this.center == BLOCKTYPE.LADDER) {
            this.ONBLOCK;
        }

        // standing on top of the ladder
        if(this.below == BLOCKTYPE.LADDER &&
           this.center == BLOCKTYPE.AIR) {
                //return STATE.ONLADDER;
                return this.ONBLOCK;
           }

        if(this.center == BLOCKTYPE.AIR &&
           this.below == BLOCKTYPE.ROPE) return STATE.FALLING;

        if(this.center == BLOCKTYPE.ROPE &&
            this.y >= this.row * GRID_BLOCK_H) return STATE.INROPE;

        if(this.COLLIDEABLE_BLOCK_TYPES.includes(this.below) && this.y < this.row*GRID_BLOCK_H) return STATE.LANDING;
        if(this.COLLIDEABLE_BLOCK_TYPES.includes(this.below)) return STATE.ONBLOCK;

        if(this.below == BLOCKTYPE.AIR) return STATE.FALLING;
        //console.log("No State?");
    }

    fallingDown(du){
        // TODO if time implement RIGHT_FALL and LEFT_FALL, change
        // actor into correct direction position

        this.dir = DIRECTION.DOWN;
        this.spriteAnim(this.ANIM.FALL);

        this.x = this.column * GRID_BLOCK_W;
        this.y += this.speed * du;

    }
    correctPosition(){

        // hack to put actor on ground after falling or transitioning
        // to or from ladder
        if(this.isDirectionChange()){
            this.y = this.row * GRID_BLOCK_H;
        }
        if(this.isStateChange()){
        }
    }

    isStateChange(){
        if(this.prevState != this.state) {
            //console.log(`State has changed from ${Object.keys(STATE)[this.prevState]} to ${Object.keys(STATE)[this.state]}`);
            this.spriteChange = true;
            return true;
        }
        return false;
    }

    isDirectionChange(){
        if(this.dir != this.dirPrev) {
            //console.log(`Direction has changed from ${Object.keys(DIRECTION)[this.dirPrev]} to ${Object.keys(DIRECTION)[this.dir]}`);
            this.spriteChange = true;
            return true;
        }
        return false;
    }


    checkGold(){
        const obj = spatialManager.checkCollision(this.x,this.y,this.type);
        if(obj.type == BLOCKTYPE.GOLD_SPAWN){

            if(this.type == BLOCKTYPE.PLAYER_SPAWN) {
                scoreManager.goldPoints();
                obj._isDeadNow = true;
                           }
            if(this.type == BLOCKTYPE.GUARD_SPAWN &&
               this.carriesGold == false) {
                this.image = g_images.guardRed;
                this.sprite = g_sprites.guardRed;
                this.spriteChange = true;
                this.carriesGold = true;
                obj._isDeadNow = true;
            }

        }
    }

    // tracks 9 blocks around actor
    surroundingBlocks(r,c){
        const blocks = [[1,1,1],[,1,1,1],[1,1,1]];
        // console.log(c,blocks);
        if(r > 0 && r < 15){
            this.updateElement(blocks,r,c,-1,2);
        } else if (r == 0){
            this.updateElement(blocks,r,c,0,2);
         } else if (r == 15) {
            this.updateElement(blocks,r,c,-1,1);
        }
        this.above = blocks[0][1];
        this.center = blocks[1][1];
        this.below = blocks[2][1];
        this.left = blocks[1][0];
        this.right = blocks[1][2];
        return blocks;
    }

    updateElement(blocks, r,c,s,e){
        for(let j=s;j<e;j++){
            for(let i=-1;i<2;i++){
                if(typeof gLevel[r+j][c+i] !== 'undefined') {
                    blocks[j+1][i+1] = gLevel[r+j][c+i];
                } else {
                    blocks[j+1][i+1] = BLOCKTYPE.BREAKABLE;
                }
            }
        }
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
        if(this.spriteChange) {
            this.csf = 0;
            this.sprites = [];
            this.spriteChange = false;
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

    debug(){
        console.log(`X: ${this.x}, Y: ${this.y}, Row: ${this.row*GRID_BLOCK_H}, Column: ${this.column*GRID_BLOCK_W}, Direction: ${Object.keys(DIRECTION)[ this.dir ]}
Above: ${Object.keys(BLOCKTYPE)[this.above]}
Center: ${Object.keys(BLOCKTYPE)[this.center]}
Below: ${Object.keys(BLOCKTYPE)[this.below]}
Left: ${Object.keys(BLOCKTYPE)[this.left]}
Right: ${Object.keys(BLOCKTYPE)[this.right]}
State: ${Object.keys(STATE)[this.state]}
`)
    }


}
