class Guard extends Actor{
    constructor(x,y){
        super();
        super.setup();
        this.x = x;
        this.y = y;
        this.column = Math.round(this.x/GRID_BLOCK_W);
        this.row = Math.round(this.y/GRID_BLOCK_H);
        //TODO: Remove Logging
        

        this.speed = 2; 
        this.image = g_images.guard;
        this.sprite = g_sprites.guard;
        this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6],FALL: [8,8], ROPE_RIGHT:[9,10,11], ROPE_LEFT:[12,13,14]};
        this.sprites = this.generateSprites(this.ANIM.LEFT);
        this.csf = 0; //currentSpriteFrame
        
        this.dir = DIRECTION.LEFT;
        this.dirPrev = DIRECTION.LEFT;
        this.SPRITEFREQ = 3; // requests next sprite every 3rd update
        // got this value by visual trial and error
        // formula at the bottom didn't work as exptected
        this.nextSpriteCounter = this.SPRITEFREQ;
        this.type = BLOCKTYPE.GUARD_SPAWN;
        
        this.dtp = this.distanceToPLayer();
        this.dx = 0;
        this.dy = 0;
        this.prevDx = 0;
        this.prevDy = 0;
        this.player;
       
        this.carriesGold = false;
        this.trapped = false;
        this.trapLifeSpan = 2000 / NOMINAL_UPDATE_INTERVAL;

        //TODO: Remove this, debug stuff
        this.isPlayer = false;


    }

    tryEscape(){
        
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
        //Player Tracking Logic
        //this.dtp = this.distanceToPLayer();
        //this.prevDx = this.dx;
        //this.prevDy = this.dy;
        //this.dx = this.x - this.player.x;
        //this.dy = this.y - this.player.y;
        
        if(this.y < this.player.y) {
            //console.log("go down");
            if((this.state === STATE.ONBLOCK && this.canClimbDown) ||
               (this.state === STATE.INROPE && this.canDrop) ||
               (this.isClimbing)) {
                    this.moveDown(du);
            } else {
                this.moveSideways(du)
            }
        }else if (this.y > this.player.y){
            //console.log("go up");
            if(this.state === STATE.ONBLOCK && this.canClimbUp ||
              (this.isClimbing && this.canClimbUp)){
                this.moveUp(du);
            }else{
                this.moveSideways(du);
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
        this.dirPrev = this.dir;
        this.prevState = this.state;

        //Trap Handling Logic
        if(this.trapped) this.trapLifeSpan -= du;
        if(this.trapLifeSpan < 0){
            this.kill();
            entityManager._guards.push(new Guard(Math.floor(util.randRange(1,26))*GRID_BLOCK_W,0));
            return entityManager.KILL_ME_NOW;
        }
        
        //State and movement management
        this.blocks = this.surroundingBlocks(this.row,this.column);

        if(this.state == STATE.FALLING || this.state == STATE.LANDING) this.fallingDown(du);
        this.setClimbingOptions();

        //This also handles movement and state logic
        this.findPlayer(du);
        
        this.state = this.checkState();
        this.correctPosition();
        this.updateSprite();
        Entity.prototype.setPos(this.x,this.y);

        this.row = Math.round(this.y/GRID_BLOCK_H);
        this.column = Math.round((this.x)/GRID_BLOCK_W);
        spatialManager.register(this);
        this.checkCollision();

        //this.debug();
        //this.debugGuards();
    }

    debugGuards(){
        console.log(`Distance to player: ${this.dtp}, x: ${this.dx}, y: ${this.dy}
GuardY: ${this.y}, State: ${Object.keys(STATE)[ this.state ]}
PlayerY: ${this.player.y}`);
    }
}
