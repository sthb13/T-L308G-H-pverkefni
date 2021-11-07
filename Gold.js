class Gold extends Entity{
    constructor(x,y){
        super();
        this.x = x * GRID_BLOCK_W;
        this.y = y * GRID_BLOCK_H;

        // this.image = g_images.gold;
        this.sprite = g_sprites.gold;
    }

    render(ctx){
        this.sprite.drawAt(ctx, this.x, this.y);
        // this.sprite.drawFromSpriteSheetAt(ctx, this.x,this.y);
    }

    update(du){
        
    }

   
}
