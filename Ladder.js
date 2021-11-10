class Ladder extends Entity{
    constructor(x,y){
        super();
        this.x = x;
        this.y = y;
        this.secret = false;
        this.visible = true;
        // TODO
        this.sprite = this.secret ? g_sprites.ladder : g_sprites.ladder;
    }

    update(du){
        
    }

    render(ctx){
        
        this.sprite.drawAt(ctx, this.x, this.y);
    }
}
