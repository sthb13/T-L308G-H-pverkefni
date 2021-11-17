class Wall extends Entity{
    constructor(x,y,breakable){
        super();
        super.setup();
        // Entity.prototype.setPos(x,y);
        this.x = x;
        this.y = y;
        this.breakable = breakable;
        this.visible = true;
        this.sprite = this.breakable ? g_sprites.brick : g_sprites.block;
        
    }

    update(du){
        
        // Entity.prototype.setPos(this.x,this.y);
        // console.log(this.x);
        // spatialManager.register(this); 
    }

    render(ctx){
        
        this.sprite.drawAt(ctx, this.x, this.y);
    }
}
