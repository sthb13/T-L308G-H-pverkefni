class Hole extends Entity{
    constructor(x,y){
        super();
        super.setup();
        this.x = x * GRID_BLOCK_W;
        this.y = y * GRID_BLOCK_H;
        this.row = x;
        this.column = y;
        this.image = g_images.hole;
        this.sprite = g_sprites.hole;

        this.digLifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL; // dig timer.

        this.ANIM = {LEFT:[0,1,2,3,4,5,6,7],RIGHT:[9,10,11,12,13,14,15,16]};
        this.sprites = this.generateSprites(this.ANIM.RIGHT);
        this.csf = 0; //currentSpriteFrame
        this.SPRITEFREQ = 10; // requests next sprite every 3rd update
        this.nextSpriteCounter = this.SPRITEFREQ;
    }

    update(du){
        console.log("hole?", this.column, this.row);
        this.spriteAnim(this.ANIM.RIGHT)
        this.nextSpriteCounter -= du;
        gLevel[this.column][this.row] = 0;
        this.digLifeSpan -= du;
        if (this.digLifeSpan < 0) return gLevel[this.column][this.row] = 0;

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
        // if(this.isDirectionChange()) this.sprites = [];
        //if(this.nextSpriteCounter < 0){
            if(this.sprites.length === 0) this.sprites = this.generateSprites(frames);
            this.nextSpriteCounter = this.SPRITEFREQ;
            this.sprite = this.sprites[this.csf];
            ++this.csf;

            if(this.csf === this.sprites.length) this.csf = 7;
        //}
    }

    render(ctx){
        //this.sprite.drawAt(ctx, this.x, this.y);
        this.sprite.drawFromSpriteSheetAt(ctx, this.x,this.y);
    }

}
