class Guard extends Actor{
    constructor(x,y){
        super();
        super.setup();
        this.x = x;
        this.y = y;
        this.row = x;
        this.column = y;
        // this.pos = pos;
        this.speed = 2; 
        this.image = g_images.guard;
        this.sprite = g_sprites.guard;
        this.PASSES = {SIDEWAYS:[0,2,4,5,6,8],
                       UP:[0,2,4,5,6],
                       DOWN:[0,2,4,5,6]};
        this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6],FALL: [8,8]};
        this.sprites = this.generateSprites(this.ANIM.LEFT);
        this.csf = 0; //currentSpriteFrame
        this.dir = DIRECTION.LEFT;
        this.dirPrev = DIRECTION.LEFT;
        this.SPRITEFREQ = 3; // requests next sprite every 3rd update
        // got this value by visual trial and error
        // formula at the bottom didn't work as exptected
        this.nextSpriteCounter = this.SPRITEFREQ;
        this.dtp = this.distanceToPLayer();


    }

    distanceToPLayer(){
        if(entityManager._player[0]) {
            const p = entityManager._player[0];
        // console.log(p);
        return util.distSq(this.x,this.y,p.x,p.y);
        }
        return false;
    }

    findPlayer(du, dir){
        let d = this.dtp;
        // console.log(this.dtp);
        if(this.distanceToPLayer() > this.dtp){
            this.move(du,DIRECTION.RIGHT);
        }else{
            this.move(du,DIRECTION.LEFT);
        }

        if(this.distanceToPLayer() > this.dtp){
            // this.move(du,DIRECTION.DOWN);
        }else{
            // this.move(du,DIRECTION.UP);
        }


        this.dtp = this.distanceToPLayer();
        if(this.dtp < d){
            this.move(du,DIRECTION.LEFT);
            // console.log("right path");
        }else{
            this.move(du,DIRECTION.RIGHT);
            // console.log("wrong path");
        } 
    }

    update(du){
        // spatialManager.unregister(this);
        this.nextSpriteCounter -= du;
        const d = this.dir * this.dirPrev;
        // if(this.isDirectionChange()) this.correctPosition();
        //track previous direction
        this.dirPrev = this.dir;

        this.blocks = this.surroundingElements(this.row,this.column);
        if(this.blocks[2][0] == BLOCKTYPE.AIR) this._isFalling = true;
        if(this._isFalling) this.fallingDown(du);
        // if(this.canMove(DIRECTION.LEFT)) this.move(du,DIRECTION.LEFT);
        // this.move(du,DIRECTION.LEFT);
        this.findPlayer(du, DIRECTION.LEFT);
        Entity.prototype.setPos(this.x,this.y);

        this.row = Math.ceil(this.y/GRID_BLOCK_H);
        // determine column from center of actor
        this.column = Math.ceil((this.x)/GRID_BLOCK_W);
        // spatialManager.register(this);
    }
}
