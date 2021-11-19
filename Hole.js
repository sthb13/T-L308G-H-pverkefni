class Hole extends Entity{
    constructor(x,y){
        super();
        super.setup();
        this.x = x * GRID_BLOCK_W;
        this.y = y * GRID_BLOCK_H;
        Entity.prototype.setPos(this.x,this.y);
        this.row = x;
        this.column = y;
        this.image = g_images.hole;
        this.sprite = g_sprites.hole;

        this.digLifeSpan = 5000 / NOMINAL_UPDATE_INTERVAL; // dig timer.
        this.secretLifeSpan = 3999 / NOMINAL_UPDATE_INTERVAL;

        this.ANIM = {LEFT:[0,1,2,3,4,5,6,7],RIGHT:[9,10,11,12,13,14,15,16]};
        this.sprites = this.generateSprites(this.ANIM.RIGHT);
        this.csf = 0; //currentSpriteFrame
        this.SPRITEFREQ = 5; // requests next sprite every 3rd update
        this.nextSpriteCounter = this.SPRITEFREQ;
        this.type = BLOCKTYPE.HOLE;

        spatialManager.register(this);
    }

    update(du){
        // console.log("hole?", this.column, this.row);

        this.spriteAnim(this.ANIM.RIGHT);
        this.nextSpriteCounter -= du;
        gLevel[this.column][this.row] = BLOCKTYPE.HIDDEN_LADDER;

        this.secretLifeSpan -= du;
        this.digLifeSpan -= du;

        if (this.secretLifeSpan < 0) {
            gLevel[this.column][this.row] = BLOCKTYPE.LADDER;
            //gLevel[this.column-2][this.row] = BLOCKTYPE.LADDER;
        }

        if (this.digLifeSpan < 0) {
            this.kill();
            this.sprite = g_sprites.brick;
            gLevel[this.column][this.row] = BLOCKTYPE.BREAKABLE;
            spatialManager.unregister(this);
            return entityManager.KILL_ME_NOW;
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

        if(this.nextSpriteCounter < 0){
            if(this.sprites.length == 0) this.sprites = this.generateSprites(frames);
            this.nextSpriteCounter = this.SPRITEFREQ;
            // console.log(this.csf);
            this.sprite = this.sprites[this.csf];
            this.csf++;

            if(this.csf === this.sprites.length) this.csf = this.sprites.length-1;
        }
    }

    render(ctx){
        //this.sprite.drawAt(ctx, this.x, this.y);
        this.sprite.drawFromSpriteSheetAt(ctx, this.x,this.y);
    }

}
