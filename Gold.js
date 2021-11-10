class Gold extends Entity{
    constructor(x,y){
        super();
        super.setup();
        this.x = x ;
        this.y = y ;

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
