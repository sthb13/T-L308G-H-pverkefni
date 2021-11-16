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
        this.player; //To Find Player

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
            this.move(du, DIRECTION.RIGHT);
        } else if (this.x > this.player.x) {
            this.move(du, DIRECTION.LEFT);
        }
    }

    /*
    oldFindPlayer(du){
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
   */

   findPlayer(du) {
       if(this.player.row == this.row) {
           this.moveSideways(du);
       } else {
           if(this.player.row > this.row) {
               if(this.canClimbDown || this.canDrop) {
                   this.moveDown(du);
               } else {
                    this.move(du, this.findBestWayDown());
               }
           } else {
               if(this.canClimbUp) {
                   this.moveUp(du);
               } else {
                   this.move(du, this.findBestWayUp());
               }
           }
       }
   }

    findBestWayUp() {
        let targetDir = NaN;
        let closestDist = Infinity; //inf
        
        for(let i = 0; i < gLevel[0].length; i++) {
             if(gLevel[this.row][i] === BLOCKTYPE.LADDER) {
                 let distance = Math.abs(this.column - i) + Math.abs(this.player.column - i);
                 if(distance < closestDist) {
                     closestDist = distance;
                     if(i > this.column) {
                         targetDir = DIRECTION.RIGHT;
                     } else {
                         targetDir = DIRECTION.LEFT;
                     }
                 }
             }
         }
         return targetDir;
   }

   findBestWayDown() {
       let targetDir = NaN;
       let closestDist = Infinity; //inf
       
       for(let i = 0; i < gLevel[0].length; i++) {
            if(!this.COLLIDEABLE_BLOCK_TYPES.includes(gLevel[this.row + 1][i])) {
                let distance = Math.abs(this.column - i) + Math.abs(this.player.column - i);
                if(distance < closestDist) {
                    closestDist = distance;
                    if(i > this.column) {
                        targetDir = DIRECTION.RIGHT;
                    } else {
                        targetDir = DIRECTION.LEFT;
                    }
                }
            }
        }
        
        return targetDir;
    }

    update(du){

        //console.log(this.column, ":", this.row);
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
