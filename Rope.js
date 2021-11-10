class Rope extends Entity{
    constructor(x,y){
        super();
        super.setup();
        this.x = x;
        this.y = y;
        // this.breakable = true;
        // this.secret = false;
        // this.visible = true;
        // this.sprite = this.breakable ? g_sprites.brick : g_sprites.block;
        this.sprite = g_sprites.rope;
    }

    update(du){
        
    }

    render(ctx){
        
        this.sprite.drawAt(ctx, this.x, this.y);
    }
}
