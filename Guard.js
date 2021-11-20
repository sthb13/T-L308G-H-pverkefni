class Guard extends Actor{
    constructor(x,y){
        super();
        super.setup();
        this.x = x;
        this.y = y;
        this.column = Math.round(this.x/GRID_BLOCK_W);
        this.row = Math.round(this.y/GRID_BLOCK_H);
        this.trapped = false;
        this.escaping = false;
        this.escapeTimer = 0;
        this.trapColumn = 0;
        this.TIME_TO_ESCAPE = 3*SECS_TO_NOMINALS;


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

        gPlayer; //To Find Player

        this.carriesGold = false;

        /*
        this.escapeLifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;
        this.sound = false;

        this.timeit = false;
        this.timeLifeSpan = 2000 / NOMINAL_UPDATE_INTERVAL;
        */

        this.isPlayer = false;

        this.soundTrap = new Audio("sounds/trap.ogg");

    }

    moveDown(du){
        this.move(du,DIRECTION.DOWN);
    }
    moveUp(du){
        this.move(du,DIRECTION.UP);
    }

    moveSideways(du){
        if(this.canReach(gPlayer.column)) {
            if(this.x < gPlayer.x) {
                if(this.state == STATE.CLIMBING && this.y > this.row*GRID_BLOCK_H) {//Always climb all the way up the ladder
                    this.moveUp(du);
                } else {
                    this.move(du, DIRECTION.RIGHT);
                }
            } else if (this.x > gPlayer.x) {
                if(this.state == STATE.CLIMBING && this.y > this.row*GRID_BLOCK_H) {//Always climb all the way up the ladder
                    this.moveUp(du);
                } else {
                    this.move(du, DIRECTION.LEFT);
                }
            }
            return true;
        }
        return false;
    }


   findPlayer(du) {
      if(g_hasMoved) {
            if(this.escaping && this.trapRow == this.row) {
                this.moveUp(du);
                return;
        }
         //Try to go straight
          if(gPlayer.row == this.row && this.moveSideways(du)){
             //All is well.
          } else {
             //If player is below us go down, if he's at same height or above go up.
             if(gPlayer.row > this.row) {
                 if(this.canClimbDown || this.canDrop) {
                     this.moveDown(du); //Can you go down here? Go for it!
                  } else {
                      let dir = this.findBestWayDown();
                      if(!isNaN(dir)) {
                          this.move(du, dir); //This way to find a ladder, or a drop.
                      } else { //No way down, try to go up!
                          if(this.canClimbUp) {
                              this.moveUp(du); //Can you go up here? Go for it!
                          } else {
                              dir = this.findBestWayUp(); //This way to find a ladder
                              if(!isNaN(dir)) {
                                  this.move(du, dir);
                              } else { //No way Up either! We're Stuck!
                                  this.move(du, DIRECTION.RIGHT) //LOST
                                  //TODO: Remove this debug line
                                //  console.log("A Guard doesn't know how to reach the player!");
                              }
                          }
                      }
                  }
              } else {
                 if(this.canClimbUp) {
                     this.moveUp(du); //Can you go up here? Go for it!
                 } else {
                     let dir = this.findBestWayUp();
                     if(!isNaN(dir)) {
                          this.move(du, dir); //This way to find a ladder
                      } else { //No way up, try to go down!
                          if(this.canClimbDown || this.canDrop) {
                              this.moveDown(du); //Can you go down here? Go for it!
                          } else {
                              dir = this.findBestWayDown();
                              if(!isNaN(dir)) {
                                  this.move(du, dir); //This way to find a ladder, or a drop.
                              } else { //No way down either! We're Stuck!
                                  this.move(du, DIRECTION.RIGHT) //LOST
                                  //TODO: Remove this debug line
                                  //console.log("A Guard doesn't know how to reach the player!");
                              }
                          }
                      }
                  }
              }
          }
     }
   }


   canReach(c) {
        let reachable = true;
        //console.log(`c = ${c}`);
        //console.log(`this.column = ${this.column}`);
        //console.log(`i = ${Math.min(this.column, c)}, i < ${Math.min(this.column, c)}`)
        for(let i = Math.min(this.column, c); i < Math.max(this.column, c); i++) {
            if(!(this.row + 1 < gLevel.length)) {
                if(this.COLLIDEABLE_BLOCK_TYPES.includes(gLevel[this.row][i])){
                    reachable = false;
                }
           } else {
                if(this.COLLIDEABLE_BLOCK_TYPES.includes(gLevel[this.row][i]) ||
                (gLevel[this.row + 1][i] === BLOCKTYPE.AIR && gLevel[this.row][i] != BLOCKTYPE.ROPE)) {
                reachable = false;
                }
           }
       }
       return reachable;
   }

    findBestWayUp() {
        let targetDir = NaN;
        let closestDist = Infinity; //inf

        for(let i = 0; i < gLevel[0].length; i++) {
                if(gLevel[this.row][i] === BLOCKTYPE.LADDER) {
                    let distance = Math.abs(this.column - i) + Math.abs(gPlayer.column - i);
                    if(distance < closestDist) {
                        if(this.canReach(i)) {
                            closestDist = distance;
                            if(i > this.column) {
                                targetDir = DIRECTION.RIGHT;
                            } else {
                                targetDir = DIRECTION.LEFT;
                            }
                        }
                    }
                }
            }
            return targetDir;
    }

    findBestWayDown() {
        if(!(this.row + 1 < gLevel.length)) {
            return NaN;
        }
        let targetDir = NaN;
        let closestDist = Infinity; //inf

        for(let i = 0; i < gLevel[0].length; i++) {
            if(!this.COLLIDEABLE_BLOCK_TYPES.includes(gLevel[this.row + 1][i])) {
                let distance = Math.abs(this.column - i) + Math.abs(gPlayer.column - i);
                if(distance < closestDist) {
                    if(this.canReach(i)) {
                        closestDist = distance;
                        if(i > this.column) {
                            targetDir = DIRECTION.RIGHT;
                        } else {
                            targetDir = DIRECTION.LEFT;
                    }
                    }

                }
            }
        }

        return targetDir;
    }

    update(du){
        spatialManager.unregister(this);
        this.nextSpriteCounter -= du;
        this.dirPrev = this.dir;
        this.prevState = this.state;


        //State and movement management
        this.blocks = this.surroundingBlocks(this.row,this.column);

        //Escaping Holes
        if(this.trapped) {
            this.escapeTimer -= du;
            if(this.escapeTimer <= 0) {
                this.escaping = true;
                console.log("escaping");
            }
        }
        
        if(this.trapColumn != this.column) {
            if(this.escaping) {
                console.log("done escaping");
            }
            this.escaping = false;
        }

        //Guard death
        if(this.blocks[1][1] === BLOCKTYPE.BREAKABLE){
            this.kill();
            entityManager._guards.push(new Guard(Math.floor(util.randRange(1,26))*GRID_BLOCK_W,0));
            return entityManager.KILL_ME_NOW;
        }

        // This used?
        //State and movement management
        //this.blocks = this.surroundingBlocks(this.row,this.column);

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
        this.checkCollision();

        spatialManager.register(this);
        //this.debug();
        //this.debugGuards();
    }

    debugGuards(){
        console.log(`
GuardY: ${this.y}, State: ${Object.keys(STATE)[ this.state ]}
PlayerY: ${gPlayer.y}
OnHead?: ${this.onHead}
`);
    }
}
