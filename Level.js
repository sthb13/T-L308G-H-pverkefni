class Level {
    constructor(level){
        this.level = level;
        this.x = 0;
        this.y = 0;
        this.width = GRID_BLOCK_W;
        this.height = GRID_BLOCK_H;
        this.sprite = g_sprites.empty;

        this.soundPass = new Audio("sounds/pass.ogg");
        this.soundPassPlayer = false;
    }

    update (du){
        //Should not be called
    }
    
    render (ctx){
        //Should not be called
    }
    
    init(){
        let offsetY = 0;
        //row
        for(let j=0;j<this.level.length;j++){
            let offsetX = 0;
            //column
            for(let i=0;i<this.level[j].length;i++){
                const e = this.level[j][i];
                const x = this.x+offsetX;
                const y = this.y+offsetY;
                switch (e){
                case BLOCKTYPE.BREAKABLE:
                    entityManager._blocks.push(new Wall(x,y, true));
                    break;
                case BLOCKTYPE.LADDER:
                    entityManager._blocks.push(new Ladder(x,y));
                    break;
                case BLOCKTYPE.ROPE:
                     entityManager._blocks.push(new Rope(x,y));
                    break;
                case BLOCKTYPE.GOLD_SPAWN:
                    entityManager._gold.push(new Gold(x,y));
                    this.level[j][i] = BLOCKTYPE.AIR;
                    break;
                case BLOCKTYPE.PLAYER_SPAWN:
                    entityManager._player = (new Player(x,y));
                    this.level[j][i] = BLOCKTYPE.AIR;
                    break;
                case BLOCKTYPE.FALSE_BREAKABLE:
                    console.log("Creating False Wall");
                    entityManager._blocks.push(new FalseWall(x,y));
                    break;
                case BLOCKTYPE.GUARD_SPAWN:
                    entityManager._guards.push(new Guard(x,y));
                    this.level[j][i] = BLOCKTYPE.AIR;
                    break;
                case BLOCKTYPE.HOLE:
                    entityManager._holes.push(new Hole(x,y));
                    break;
                case BLOCKTYPE.SOLID:
                    entityManager._blocks.push(new Wall(x,y,false));
                    break;
                default:
                    console.log("defaultinit?");
                    break;
                    
            }

            offsetX += this.width;
        }

        offsetY += this.height;
        }
        entityManager.initPlayerInfo();

    }

    //reveals hidden ladders by changing the block type to ladder.
    revealLadders() {
        for(let i = 0; i < this.level[0].length; i++) {
            for(let j = 0; j < this.level.length; j++) {
                let block = this.level[j][i];
                if(block === BLOCKTYPE.HIDDEN_LADDER) {
                    this.level[j][i] = BLOCKTYPE.LADDER;
                    const x = this.x+i*GRID_BLOCK_W;
                    const y = this.y+j*GRID_BLOCK_H;
                    entityManager._blocks.push(new Ladder(x,y));
                }
            }
        }

        if(!this.soundPassPlayed) this.soundPass.play();
        this.soundPassPlayed = true;
    }

    //Deprecated, gLevel used instead
    /*
    getBlockType(x, y) {
        return this.level[y][x];
    }
    */

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
