class Level {
    constructor(level){
        this.level = level;
        this.x = 0;
        this.y = 0;
        this.width = GRID_BLOCK_W;
        this.height = GRID_BLOCK_H;
        this.sprite = g_sprites.empty;
    }

    update (du){
        
    }
    
    render (ctx){
        let offsetY = 0;
        //row
        for(let j=0;j<this.level.length;j++){
            let offsetX = 0;
            //column
            for(let i=0;i<this.level[j].length;i++){
                const e = this.level[j][i];
                    switch (e){
                    case 1:
                        this.sprite = g_sprites.brick;
                        break;
                    case 2:
                         this.sprite = g_sprites.ladder;
                        break;
                    case 3:
                         this.sprite = g_sprites.ladder;
                        break;
                    case 4:
                         this.sprite = g_sprites.rope;
                        break;
                    default:
                        this.sprite = g_sprites.empty;
                        break;
                    }

                this.sprite.drawAt(ctx, this.x+offsetX, this.y+offsetY);

                offsetX += this.width;
            }

            offsetY += this.height;
        }
    }

    //initializes the level by spawning objects, and changing the level data to be empty tiles in those places.
    initialize() {
        for(let i = 0; i < NUM_COLUMNS_OF_BLOCKS; i++) {
            for(let j = 0; j < NUM_ROWS_OF_BLOCKS; j++) {
                block = this.level[j][i];
                switch(block){
                    case BLOCKTYPE.GOLD_SPAWN:
                        spawnGold(i, j);
                        this.level[j][i] = BLOCKTYPE.empty;
                        break;
                    case BLOCKTYPE.GUARD_SPAWN:
                        spawnGuard(i, j);
                        this.level[j][i] = BLOCKTYPE.empty;
                        break;
                    case BLOCKTYPE.PLAYER_SPAWN:
                        spawnPlayer(i, j);
                        this.level[j][i] = BLOCKTYPE.empty;
                        break;
                }
            }
        }
    }

    //reveals hidden ladders by changing the block type to ladder.
    revealLadders() {
        for(let i = 0; i < NUM_COLUMNS_OF_BLOCKS; i++) {
            for(let j = 0; j < NUM_ROWS_OF_BLOCKS; j++) {
                block = this.level[j][i];
                if(block === BLOCKTYPE.HIDDEN_LADDER) {
                    level[j][i] = BLOCKTYPE.LADDER;
                }
            }
        }
    }

    getBlockType(x, y) {
        return this.level[y][x];
    }

    renderElement (ctx,x,y,w,h, col){
        // if(this.sprite !== g_sprites.empty){
        // ctx.beginPath();
        // ctx.strokeStyle='black';
        // ctx.rect(x, y, w, h);
        // // ctx.fillStyle = COLORS[col];
        // ctx.fillStyle = 'red';
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        // }
        this.sprite.drawAt(ctx, x, y);

    }

}
