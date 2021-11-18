class FalseWall extends Entity{
    constructor(x,y){
        console.log("FalseWall constructor");
        super();
        super.setup();
        // Entity.prototype.setPos(x,y);
        this.x = x;
        this.y = y;
        this.visible = true;
        this.sprite = g_sprites.brick;
        this.revealed;
        this.revealedTimer = 0;
        this.TIME_REVELED = 3*SECS_TO_NOMINALS;
    }

    revealBlock(){
        this.revealed = true;
    }

    update(du){
        if(this.revealed) {
            this.revealedTimer += du;
            if(this.revealedTimer > this.TIME_REVELED) {
                this.revealedTimer = 0;
                this.revealed = false;
            }
        }
    }

    render(ctx){
        if(this.revealed) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            this.sprite.drawAt(ctx, this.x, this.y);
            ctx.restore();
        } else {
            this.sprite.drawAt(ctx, this.x, this.y);
        }
    }
}