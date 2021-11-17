class Gold extends Entity{
    constructor(x,y){
        super();
        super.setup();
        this.x = x ;
        this.y = y ;

        console.log(this.x,this.y);
        // this.image = g_images.gold;
        this.sprite = g_sprites.gold;
        this.type = BLOCKTYPE.GOLD_SPAWN;
    }

    reset() {
      this._isDeadNow = false;
      Entity.prototype.setPos(this.reset_pos.posX, this.reset_pos.posY);
      spatialManager.register(this);
    }

    render(ctx){
        this.sprite.drawAt(ctx, this.x, this.y);
        // this.sprite.drawFromSpriteSheetAt(ctx, this.x,this.y);
    }

    update(du){
        spatialManager.unregister(this);
        if(this._isDeadNow) return entityManager.KILL_ME_NOW;
        Entity.prototype.setPos(this.x,this.y);
        this.reset_pos = Entity.prototype.getPos();
        spatialManager.register(this);
    }

}
