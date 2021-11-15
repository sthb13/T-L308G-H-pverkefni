class Guard extends Actor{
    constructor(x,y){
        super();
        super.setup();
        this.x = x;
        this.y = y;
        this.row = Math.round(this.x/GRID_BLOCK_W);
        this.col = Math.round(this.y/GRID_BLOCK_H);
        // this.pos = pos;
        this.speed = 2; 
        this.image = g_images.guard;
        this.sprite = g_sprites.guard;
        this.PASSES = {SIDEWAYS:[0,2,4,5,6,8],
                       UP:[0,2,4,5,6],
                       DOWN:[0,2,4,5,6]};
        this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6],FALL: [8,8], ROPE_RIGHT:[9,10,11], ROPE_LEFT:[12,13,14]};
        this.sprites = this.generateSprites(this.ANIM.LEFT);
        this.csf = 0; //currentSpriteFrame
        this.dir = DIRECTION.LEFT;
        this.dirPrev = DIRECTION.LEFT;
        this.SPRITEFREQ = 3; // requests next sprite every 3rd update
        // got this value by visual trial and error
        // formula at the bottom didn't work as exptected
        this.nextSpriteCounter = this.SPRITEFREQ;
        this.dtp = this.distanceToPLayer();
        this.dx = 0;
        this.dy = 0;
        this.prevDx = 0;
        this.prevDy = 0;
        this.player;
        this.type = BLOCKTYPE.GUARD_SPAWN;

        //TODO: Remove this, debug stuff
        this.isPlayer = false;


    }

    distanceToPLayer(){
        if(entityManager._player[0]) {
            this.player = entityManager._player[0];
            // const p = {x:20,y:616};
        // console.log(p);
            let d = util.distSq(this.x,this.y,this.player.x,this.player.y);
            // console.log(d);
        return Math.sqrt(d);
        }
        // return false;
    }

    moveDown(du){
        this.move(du,DIRECTION.DOWN);
    }
    moveUp(du){
        this.move(du,DIRECTION.UP);
    }

    moveSideways(du){
        if(this.x < this.player.x) {
            this.move(du,DIRECTION.RIGHT);
        } else if (this.x > this.player.x) {
            this.move(du, DIRECTION.LEFT);
        }
        
    }

    findPlayer(du){
        if(this.y + GRID_BLOCK_H/4 < this.player.y) {
            //console.log("go down");
            if(this.state == STATE.ONBLOCK ||
               this.state == STATE.INROPE ||
               this.state == STATE.CANCLIMB && !this.PASSES.DOWN.includes(this.below)){
                this.moveSideways(du);
            }else{
                this.moveDown(du);
            }
        }else if (this.y - GRID_BLOCK_H/4 > this.player.y){
            //console.log("go up");
            if(this.state == STATE.ONBLOCK ||
               this.state == STATE.INROPE ||
               this.state == STATE.CANCLIMB && this.center != BLOCKTYPE.LADDER){
                this.moveSideways(du);
            }else{
                this.moveUp(du);
            }
        } else {
            //console.log("Right Height");
            this.moveSideways(du);
        }
   }

   findClosestWayUp() {
       //TODO: Implement
   }

   findClosestWayDown() {
       //TODO: Implement

   }

    update(du){
        spatialManager.unregister(this);
        this.nextSpriteCounter -= du;
        // const d = this.dir * this.dirPrev;
        // if(this.isDirectionChange()) this.correctPosition();
        this.dtp = this.distanceToPLayer();
        this.prevDx = this.dx;
        this.prevDy = this.dy;
        // console.log(this.dtp);
        this.dirPrev = this.dir;

        this.prevState = this.state;

        this.blocks = this.surroundingBlocks(this.row,this.column);

        if(this.state == STATE.FALLING) this.fallingDown(du);
        // if(this.blocks[2][0] == BLOCKTYPE.AIR) this._isFalling = true;
        if(this._isFalling) this.fallingDown(du);
        // if(this.canMove(DIRECTION.LEFT)) this.move(du,DIRECTION.LEFT);
        // this.move(du,DIRECTION.LEFT);
        this.dx = this.x - this.player.x;
        this.dy = this.y - this.player.y;
        this.findPlayer(du);
        this.state = this.checkState();
        this.correctPosition();

        Entity.prototype.setPos(this.x,this.y);

        this.row = Math.round(this.y/GRID_BLOCK_H);
        // determine column from center of actor
        this.column = Math.round((this.x)/GRID_BLOCK_W);
        spatialManager.register(this);
        this.checkGold();
        // this.debug();
        //this.debugGuards();
    }

    debugGuards(){
        console.log(`Distance to player: ${this.dtp}, x: ${this.dx}, y: ${this.dy}
GuardY: ${this.y}, State: ${Object.keys(STATE)[ this.state ]}
PlayerY: ${this.player.y}`);
    }
}
