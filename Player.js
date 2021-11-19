class Player extends Actor{
    constructor(x,y){
        super();
        super.setup();
        this.x = x;
        this.y = y;
        
        this.column = Math.round(this.x/GRID_BLOCK_W);
        this.row = Math.round(this.y/GRID_BLOCK_H);
        
        this.speed = 4; // ~240 px/s
        this.image = g_images.player;
        this.sprite = g_sprites.player; 
        this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6],FALL: [8,8], ROPE_RIGHT:[9,10,11], ROPE_LEFT:[12,13,14]};
        this.sprites = this.generateSprites(this.ANIM.RIGHT);
        this.csf = 0; //currentSpriteFrame
       
        this.dir = DIRECTION.RIGHT;
        this.dirPrev = DIRECTION.RIGHT;
        
        this.SPRITEFREQ = 3; // requests next sprite every 3rd update
                             // got this value by visual trial and error
                             // formula at the bottom didn't work as exptected
        this.nextSpriteCounter = this.SPRITEFREQ;
        this.type = BLOCKTYPE.PLAYER_SPAWN;
        
        this.KEY_LEFT = 'A'.charCodeAt(0);
        this.KEY_RIGHT = 'D'.charCodeAt(0);
        this.KEY_UP = 'W'.charCodeAt(0);
        this.KEY_DOWN = 'S'.charCodeAt(0);
        this.KEY_HOLE_LEFT = 'J'.charCodeAt(0);
        this.KEY_HOLE_RIGHT = 'K'.charCodeAt(0);
        
        this.timeDigging = 0;
        
        //TODO: Remove this debug stuff
        this.isPlayer = true;
        this.soundFalling = new Audio("sounds/fall.ogg");
        this.soundDig = new Audio("sounds/dig.ogg");
        this.soundGold = new Audio("sounds/getGold.ogg");
        this.soundDead = new Audio("sounds/dead.ogg");
        this.soundBorn = new Audio("sounds/born.ogg");
        // TODO: needs interaction first, like press space
        this.soundBorn.play();

    }


    update(du){

        // console.log(`State: ${Object.keys(STATE)[this.state]} OnHead?: ${this.onHead}`);
        spatialManager.unregister(this);
        this.nextSpriteCounter -= du;
        this.dirPrev = this.dir;
        this.prevState = this.state;
        
        // State and movement management
        this.blocks = this.surroundingBlocks(this.row,this.column);
     
        if(this.state == STATE.FALLING || this.state == STATE.LANDING) this.fallingDown(du);
        this.setClimbingOptions();

        if(this.state == STATE.LANDING || this.state == STATE.INROPE || this.state == STATE.ONHEAD) {
            this.soundFalling.pause();
            this.soundFalling.currentTime = 0;
        }
        if(keys[this.KEY_UP] || keys[this.KEY_DOWN]) {
            if(keys[this.KEY_DOWN] && keys[this.KEY_UP]) {
                //Do Nothing
            } else if(this.state != STATE.DIGGING) {
                if(keys[this.KEY_DOWN]) this.move(du, DIRECTION.DOWN);
                if(keys[this.KEY_UP]) this.move(du, DIRECTION.UP);
            }
        } else {
            if(keys[this.KEY_LEFT] && keys[this.KEY_RIGHT]) {
                //Do nothing
            } else if(this.state != STATE.DIGGING) {
                if(keys[this.KEY_LEFT]) this.move(du, DIRECTION.LEFT);
                if(keys[this.KEY_RIGHT]) this.move(du, DIRECTION.RIGHT);
            }
            
        }

        //Should be changed before this.checkState() is called.
        if(this.state === STATE.DIGGING) {this.timeDigging += du}

        this.state = this.checkState();
        this.correctPosition();
        this.updateSprite();
        Entity.prototype.setPos(this.x,this.y);

        //Digging Logic
        if(this.state != STATE.DIGGING && this.state != STATE.FALLING && this.state != STATE.LANDING && this.state != STATE.INROPE) {
            //console.log("X: " , this.x, "Column X", this.column*GRID_BLOCK_W)
            if(keys[this.KEY_HOLE_LEFT] && 
                gLevel[this.row+1][this.column-1] === BLOCKTYPE.BREAKABLE &&
                this.INCORPOREAL_BLOCK_TYPES.includes(gLevel[this.row][this.column-1]) &&
                this.x >= this.column * GRID_BLOCK_W) {
                    this.state = STATE.DIGGING;
                    this.timeDigging = 0;
                    this.soundDig.play();
                    entityManager._holes.push(new Hole(this.column-1,this.row+1));
            }
    
            if(keys[this.KEY_HOLE_RIGHT] && gLevel[this.row+1][this.column+1] == BLOCKTYPE.BREAKABLE &&
                this.INCORPOREAL_BLOCK_TYPES.includes(gLevel[this.row][this.column+1]) &&
                this.x <= this.column * GRID_BLOCK_W) {
                    this.state = STATE.DIGGING;
                    this.timeDigging = 0;
                    this.soundDig.play();
                    entityManager._holes.push(new Hole(this.column+1,this.row+1));
                }
        }

        this.row = Math.round(this.y/GRID_BLOCK_H);
        this.column = Math.round(this.x/GRID_BLOCK_W);

        spatialManager.register(this);

        this.checkCollision();
        // console.log(spatialManager.checkCollision(this.x,this.y));
        // this.debug();
        // console.log(`State: ${Object.keys(STATE)[this.state]} OnHead?: ${this.onHead}`);

    }



}
