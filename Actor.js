class Actor extends Entity{
    constructor(){
        super();

        this.collidableBlockTypes = [BLOCKTYPE.BREAKABLE, BLOCKTYPE.SOLID];
        this.incorporealBlockTypes = [BLOCKTYPE.AIR, BLOCKTYPE.HOLE, BLOCKTYPE.HIDDEN_LADDER, BLOCKTYPE.FALSE_BREAKABLE];
        this.climbableBlockTypes = [BLOCKTYPE.LADDER];
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
        this.authTrap = false;
        this.onHead = false;
    }

    setClimbingOptions(){
        if(this.climbableBlockTypes.includes(this.below) ||
            this.climbableBlockTypes.includes(this.center) &&
                (this.y < this.row * GRID_BLOCK_H || !this.collidableBlockTypes.includes(this.below))) {
            this.canClimbDown = true;
        } else {
            this.canClimbDown = false;
        }

        if((this.climbableBlockTypes.includes(this.center) && (this.y > this.row * GRID_BLOCK_H || !this.collidableBlockTypes.includes(this.above))) ||
            this.climbableBlockTypes.includes(this.below) && this.y > this.row * GRID_BLOCK_H ||
            this.climbableBlockTypes.includes(this.above) && this.y < (this.row+0.25) * GRID_BLOCK_H) {
                this.canClimbUp = true;
            }
        else {
            this.canClimbUp = false;
        }

        if((this.state === STATE.INROPE || this.state === STATE.CLIMBING) && this.incorporealBlockTypes.includes(this.below)) {
            this.canDrop = true;
        } else {
            this.canDrop = false;
        }
    }

    move(du,dir){
        g_hasMoved = true;
        g_startGame = true;
        if(this.state === STATE.FALLING || this.state === STATE.LANDING) {
            if(this.isPlayer && this.below === BLOCKTYPE.FALSE_BREAKABLE) {
                entityManager.revealBlock(this.column, this.row + 1);
            }
            return;
        }

        this.dir = dir;
        switch(dir){
            case DIRECTION.RIGHT:
                this.isClimbing = false;
                if(this.collidableBlockTypes.includes(this.right)){
                    if(this.x > this.column * GRID_BLOCK_W ) return;
                }
                if(this.state === STATE.INROPE) this.spriteAnim(this.ANIM.ROPE_RIGHT);
                if(this.state === STATE.ONBLOCK ||
                   this.state === STATE.ONHEAD) this.spriteAnim(this.ANIM.RIGHT);
                this.x += this.speed * du;
                break;
            case DIRECTION.LEFT:
                this.isClimbing = false;
                if(this.collidableBlockTypes.includes(this.left)) {
                    if(this.x < this.column * GRID_BLOCK_W ) return;
                }
                if(this.state === STATE.INROPE) this.spriteAnim(this.ANIM.ROPE_LEFT);
                if(this.state === STATE.ONBLOCK ||
                   this.state === STATE.ONHEAD) this.spriteAnim(this.ANIM.LEFT);
                this.x -= this.speed * du;
                break;
            case DIRECTION.DOWN:
                if(!this.canClimbDown) {
                    if(this.canDrop) {
                        this.x = this.column * GRID_BLOCK_W;
                        this.y += this.speed * du;
                        this.isClimbing = false;
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
        //We're digging until the hole is finished or we're interrupted
        //TODO: manage the case where we're interrupted

        if(this.center === BLOCKTYPE.HOLE) {
            //if(!this.trapped) this.soundTrap.play();
            // TODO guard getting out of hole must set this back to false
            if(!this.isPlayer && !this.trapped) {
                this.escapeTimer = this.TIME_TO_ESCAPE;
                this.trapColumn = this.column;
                this.trapRow = this.row;
                this.trapped = true;
            }
            if(this.carriesGold) {
                entityManager._gold.push(new Gold(this.column*GRID_BLOCK_W, (this.row-1)*GRID_BLOCK_H));
                this.image = g_images.guard;
                this.sprite = g_sprites.guard;

                this.carriesGold = false;
            }
        } else {
            this.trapped = false;
        }

        if(this.state === STATE.DIGGING && this.timeDigging < TIME_TO_DIG_HOLE) {
            this.x = this.column * GRID_BLOCK_W;
            return STATE.DIGGING;
        }

        //if we are climbing the we're in climbing state. isClimbing is set when attempting to move up/down
        if(this.isClimbing) {
            return STATE.CLIMBING;
        }

        //if in a stair block, and not climbing then we're standing.
        if(this.climbableBlockTypes.includes(this.center)) {
            return STATE.ONBLOCK;
        }

        // standing on top of the ladder
        if(this.climbableBlockTypes.includes(this.below) &&
            this.incorporealBlockTypes.includes(this.center)) {
                return STATE.ONBLOCK;
           }

        if(this.incorporealBlockTypes.includes(this.center) &&
           (this.below === BLOCKTYPE.ROPE ||
            this.incorporealBlockTypes.includes(this.below)) &&
            this.onHead) return STATE.ONHEAD;

        if(this.incorporealBlockTypes.includes(this.center) &&
           (this.below === BLOCKTYPE.ROPE || this.incorporealBlockTypes.includes(this.below))) {
            return STATE.FALLING;
           }

        if(this.center === BLOCKTYPE.ROPE && this.y <= this.row * GRID_BLOCK_H) return STATE.INROPE;

        if(this.collidableBlockTypes.includes(this.below) && this.y < this.row*GRID_BLOCK_H) return STATE.LANDING;

        if(this.collidableBlockTypes.includes(this.below)) return STATE.ONBLOCK;

        if(this.below == BLOCKTYPE.AIR || this.below == BLOCKTYPE.HOLE) return STATE.FALLING;
        if(this.incorporealBlockTypes.includes(this.below)) return STATE.FALLING;

        //State remains unchanged
        return this.state;
    }

    fallingDown(du){
        // TODO if time implement RIGHT_FALL and LEFT_FALL, change
        // actor into correct direction position
        if(this.type === BLOCKTYPE.PLAYER_SPAWN && !isMute) this.soundFalling.play();
        this.dir = DIRECTION.DOWN;
        this.spriteAnim(this.ANIM.FALL);

        this.y += this.speed * du;
    }

    correctPosition(){
        if(this.trapped && !this.escaping) {
            this.x = this.column * GRID_BLOCK_W;
            this.y = this.row * GRID_BLOCK_H;
        }

        if(this.state === STATE.ONBLOCK || this.state === STATE.INROPE) {
            this.y = this.row * GRID_BLOCK_H;
        }

        if(this.state === STATE.CLIMBING || ((this.state === STATE.FALLING && !this.onHead)) || this.state === STATE.LANDING) {
            this.x = this.column * GRID_BLOCK_W;
        }
    }

    /*
    escapePosition(){
        this.trapped = true;
        this.authTrap = false;
    }

    refreshEscapePosition(){
        this.trapped = false;
    }

    tellEscapePosition(){
        return this.authTrap;
    }*/

    updateSprite(){
        if(this.dir != this.dirPrev || this.state != this.prevState) {
            this.spriteChange = true;
        }
    }


    isDirectionChange(){
        if(this.dir != this.dirPrev) {
            //console.log(`Direction has changed from ${Object.keys(DIRECTION)[this.dirPrev]} to ${Object.keys(DIRECTION)[this.dir]}`);
            this.spriteChange = true;
            return true;
        }
        return false;
    }

    checkCollision(){
        const collisions = spatialManager.boxCollision(this.x,this.y);
        this.onHead = false;
        for(let i = 0; i < collisions.length; i++) {
            let obj = collisions[i];
            // catching gold
            if(obj.type === BLOCKTYPE.GOLD_SPAWN){
                if(this.type === BLOCKTYPE.PLAYER_SPAWN) {
                    if(!isMute) this.soundGold.play();
                    scoreManager.goldPoints();
                    obj._isDeadNow = true;
                }
                if(this.type === BLOCKTYPE.GUARD_SPAWN &&
                   !this.carriesGold &&
                   !this.trapped) {
                    this.image = g_images.guardRed;
                    this.sprite = g_sprites.guardRed;
                    this.spriteChange = true;
                    this.carriesGold = true;
                    obj._isDeadNow = true;
                }
            }

            if(obj.type === BLOCKTYPE.GUARD_SPAWN ) {
                //running over guard
                if(this.row < obj.row) {
                    this.onHead = true;
                }
                // player dies
                if(this.row === obj.row && this.type === BLOCKTYPE.PLAYER_SPAWN) {
                    console.log("Player died");
                    lifeManager.looseLife();
                    if(lifeManager.lifeNumber > 0) {
                        g_playerDead = true;
                    }else{
                        console.log("Game Over");
                        entityManager.gameOver();
                    }
                }
            }
        }
    }

    // tracks 9 blocks around actor
    surroundingBlocks(r,c){
        const blocks = [[1,1,1],[,1,1,1],[1,1,1]];
        // console.log(c,blocks);
        if(r > 0 && r < 15){
            this.updateElement(blocks,r,c,-1,2);
        } else if (r === 0){
            this.updateElement(blocks,r,c,0,2);
         } else if (r === 15) {
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
            if(this.sprites.length === 0) this.sprites = this.generateSprites(frames);
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
OnHead? ${this.onHead}
`)
    }


}
