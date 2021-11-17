class Guard extends Actor{
    constructor(x,y){
        super();
        super.setup();
        this.x = x;
        this.y = y;

        this.row = Math.round(this.x/GRID_BLOCK_W);
        this.col = Math.round(this.y/GRID_BLOCK_H);
        //TODO: Remove Logging
        console.log("Guard Spawned at: X:" , x, " Y:", y)


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

        // Remember my reset positions
        this.reset_x = this.x;
        this.reset_y = this.y;
        this.reset_row = this.row;
        this.reset_col = this.col;

        this.carriesGold = false;
        this.trapped = false;
        this.trapLifeSpan = 2000 / NOMINAL_UPDATE_INTERVAL;

        //TODO: Remove this, debug stuff
        this.isPlayer = false;


    }

    tryEscape(){

    }

    halt() {
      this.speed = 0;
    }

    setPos(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.row = r;
    this.col = c;
}

    reset() {
      g_hasMoved = false;
      this.setPos(this.reset_x, this.reset_y, this.reset_row, this.reset_col);
      // this._isFalling = false;
      // this.CLIMBABLE_BLOCK_TYPES = [BLOCKTYPE.LADDER];
      this.COLLIDEABLE_BLOCK_TYPES = [BLOCKTYPE.BREAKABLE, BLOCKTYPE.SOLID];
      // this.GRABBABLE_BLOCK_TYPES = [BLOCKTYPE.ROPE];
      this.blocks = this.surroundingBlocks(this.row,this.column);
      this.state = STATE.ONBLOCK; //check if this is true
      this.prevState = this.state;
      this.spriteChange = false;

      this.above = this.blocks[0][1];  //
      this.center = this.blocks[1][1]; //
      this.below = this.blocks[2][1];  // convenience fields to avoid
      this.left = this.blocks[1][0];   // logic errors
      this.right = this.blocks[1][2];  //
      this.maxX = 0;
      this.correctionNeeded = false;
      this.canClimbUp = false;
      this.canClimbDown = false;
      this.isClimbing = false;
      this.dtp = this.distanceToPLayer();
      this.dx = 0;
      this.dy = 0;
      this.prevDx = 0;
      this.prevDy = 0;
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
        if(g_hasMoved) {
          if(this.y + GRID_BLOCK_H/4 < this.player.y) {
              //console.log("go down");
              if((this.state === STATE.ONBLOCK && this.canClimbDown) ||
                 (this.state === STATE.INROPE && this.canDrop) ||
                 (this.isClimbing)) {
                      this.moveDown(du);
              } else {
                  this.moveSideways(du)
              }
          }else if (this.y - GRID_BLOCK_H/4 > this.player.y){
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

        if(this.state === STATE.FALLING || this.STATE === STATE.LANDING) this.fallingDown(du);
        if(this._isFalling) this.fallingDown(du); //What's this for?
        this.setClimbingOptions();

        //This also handles movement and state logic
        this.findPlayer(du);

        this.state = this.checkState();
        this.correctPosition();
        this.updateSprite();

        Entity.prototype.setPos(this.x,this.y);

        this.row = Math.round(this.y/GRID_BLOCK_H);
        // determine column from center of actor
        this.column = Math.round((this.x)/GRID_BLOCK_W);
        spatialManager.register(this);
        this.checkCollision();

        // this.debug();
        //this.debugGuards();
    }

    debugGuards(){
        console.log(`Distance to player: ${this.dtp}, x: ${this.dx}, y: ${this.dy}
GuardY: ${this.y}, State: ${Object.keys(STATE)[ this.state ]}
PlayerY: ${this.player.y}`);
    }
}
