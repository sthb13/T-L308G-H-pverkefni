class Gold extends Entity{
    constructor(x,y){
        super();
        super.setup();
        this.x = x ;
        this.y = y ;
        // this.image = g_images.gold;
        this.sprite = g_sprites.gold;
        this.type = BLOCKTYPE.GOLD_SPAWN;
    }

    render(ctx){
        this.sprite.drawAt(ctx, this.x, this.y);
        // this.sprite.drawFromSpriteSheetAt(ctx, this.x,this.y);
    }

    update(du){
        spatialManager.unregister(this);
        if(this._isDeadNow) return entityManager.KILL_ME_NOW;
        Entity.prototype.setPos(this.x,this.y);
        spatialManager.register(this);
    }

}
