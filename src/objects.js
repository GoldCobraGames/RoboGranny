//**************************** GAME OBJECTS **************************************
function createCharacter() //generates and contains game character
{
    let obj = {};
    obj.coordinates = [0,0,30,46]; //player characters coordinates stored as x,y pair and player movement vector
    obj.moveVector = [0,0]; // character movement vector
    obj.directionFacing = 1;
    
    obj.jump1 = false;
    obj.jump2 = false;
    obj.jumpPowerup = false;
    obj.jumpTap = false;
        
    obj.dashPowerup = false;
    obj.dashTap = false;
    
    obj.state = 1;
    obj.animationFrame = 1;
    
    obj.health = 6;
    obj.maxHealth = 6;
    
    obj.maxAmmo = 5;    
    obj.ammo = 5;
    obj.ammoTimer = 0;

    obj.respawnLocation = [0,0];
    obj.dead = false;

    obj.projectiles = [];
    obj.projectilePowerup = false;
    obj.projectileTap = false;
    
    obj.iFrames = 0;
    obj.ladder = false;
    obj.ladderDir = 0;
    
    obj.crushed = 0;

    obj.jump = function()
    {
        if((this.jump1 && this.jumpTap) || (this.jump2 && this.jumpTap))
        {
            this.ladderDir = -1;
            this.moveVector[1] = -4;
            if(this.ladder)
                this.moveVector[1] = -2;
            this.jumpCharges--;
            if(!this.ladder)
            {
                if(this.jump1)
                    this.jump1 =false;
                else
                    this.jump2 =false;
                if(!this.ladder)
                    JumpSFX.play();
                this.jumpTap = false;
            }
        }
    };
    
    obj.grounded = function()
    {
        character.jump1 = true;
        if(character.jumpPowerup || this.ladder)
            character.jump2 = true;
    }
    
    obj.bounce = function(x,y)
    {
        let bounceAngle = Math.atan2(y-(this.coordinates[1]+15),x-(this.coordinates[0]+23));
        this.moveVector[0] = -20*Math.cos(bounceAngle);
        this.moveVector[1] = -5*Math.sin(bounceAngle);
    }

    obj.dash = function()
    {
        if(this.dashTap && this.dashPowerup && this.ammo > 1 )
        {
            DashSFX.play();
            this.ammo-=2;
            this.dashTap = false;
            this.moveVector[0] = 40*Math.sign(this.directionFacing);

        }
                         
    };
    
    obj.hurt = function()
    {
        if(this.iFrames <= 0)
        {
            this.health--;
            this.iFrames = 60;
            return true;
        }
        else 
            return false;
    };
    
    obj.respawn = function()
    {
            FallSFX.play();
            this.hurt();
            this.coordinates[0] = character.respawnLocation[0];
            this.coordinates[1] = character.respawnLocation[1];
            this.moveVector = [0,0];
            //camera.snap(character.coordinates[0]-300,character.coordinates[1]-300);
    };
    
    obj.updateTimers = function()
    {
        if(this.health<1)
        {
            this.dead = true;
            messageSystem("       You Are Dead        Press Enter to continue");
        }
        if(this.ammo < this.maxAmmo)
            this.ammoTimer++;
        if(this.ammoTimer > 30)
        {
            this.ammo++;
            this.ammoTimer=0;
        }
        if(this.iFrames > 0) //invincibility frame timer
            this.iFrames--;
        this.jump1 = false; //prevents using first jump after leaving platform
        this.ladder = false;
        this.ladderDir = 0;
        this.ladderTop = false;
        if(this.moveVector[0] < 0)
            this.directionFacing = -1;
        else if (this.moveVector[0] > 0)
            this.directionFacing = 1;
        if(this.crushed >= 5)
            this.respawn();
        this.crushed = 0;
    };

    obj.applyCollision = function()
    {
        for (let i= 0; i<currentRoom.static.length; i++)//handles all collision with static objects
        {
            if(tileList[currentRoom.static[i].tileNum].passable > 0)//ignores background elemnts and enemy blockers
                if(roughCollision(this.coordinates[0],this.coordinates[1],this.coordinates[2],this.coordinates[3],currentRoom.static[i].x, currentRoom.static[i].y,tileList[currentRoom.static[i].tileNum].w*2, tileList[currentRoom.static[i].tileNum].h*2))
                {
                    switch(tileList[currentRoom.static[i].tileNum].passable)
                    {
                    case 1:
                        fineCollision(this.coordinates[0],this.coordinates[1],this.coordinates[2],this.coordinates[3],currentRoom.static[i].x, currentRoom.static[i].y,tileList[currentRoom.static[i].tileNum].w*2, tileList[currentRoom.static[i].tileNum].h*2);
                        break;
                    case 2:
                        this.respawn();
                        break;
                    case 3:
                        this.ladder = true;
                        this.jumpTap = true;
                        this.grounded();
                        this.moveVector[1] = 0; //gravity
                        break;
                    case 4:
                        this.hurt();
                        FallSFX.play();		
                        this.grounded();
                        this.bounce(this.coordinates[0]+23,this.coordinates[1]+35);
                        break;

                    }

                }
        }
        for (let i= 0; i<currentRoom.active.length; i++)//handles collision with active objects
                if(roughCollision(this.coordinates[0],this.coordinates[1],this.coordinates[2],this.coordinates[3],currentRoom.active[i].coordinates[0], currentRoom.active[i].coordinates[1],currentRoom.active[i].coordinates[2],currentRoom.active[i].coordinates[3]))
                    currentRoom.active[i].colliding();
    };
    
    obj.animationSystem = function()
    {
        if (this.moveVector[1] == 0 && this.moveVector[0] != 0)//player animation handler
            this.state = 1;
        else if (this.moveVector[1] > 0 && this.moveVector[0] != 0)
             this.state = 2;
        else if (this.moveVector[1] < 0 && this.moveVector[0] != 0)
             this.state = 3; 
        if(this.moveVector[0] < 0)
            this.state = this.state*(-1);
        if(this.moveVector[0] != 0 || this.ladderDir != 0)
            this.animationFrame ++;
        if(this.animationFrame > 10000)
            this.animationFrame = 1;
        if(this.ladder)
        {
            this.state = 4*this.ladderDir;
            if(this.ladderDir == 0)
                this.state = 4;
        }

    };

    obj.shoot = function()
    {
        if(this.projectileTap && this.projectilePowerup && this.ammo >0)
        {
            this.ammo--;
            this.projectiles.push(projectile(this.coordinates[0],this.coordinates[1],this.directionFacing));
            this.projectileTap = false;
        }
    };
    
    obj.applyPhysics = function()
    {
        this.moveVector[0] = this.moveVector[0]*0.8; //friction
        if(Math.abs(this.moveVector[0])<0.1) //friction
            this.moveVector[0] = 0;
        if(!this.ladder)
            this.moveVector[1] += 0.1; //gravity
	    if(this.moveVector[1]>5)
            this.moveVector[1] = 5; //gravity
    };
    
    obj.applyMovement = function()
    {
        this.coordinates[0] += this.moveVector[0]/2;
        this.coordinates[1] += this.moveVector[1]/2;
    };
    
    obj.tick = function ()
    {
        this.applyMovement(); //i am applying the movement vector in 2 half steps and checking collision after each to attemp to reduce tunneling
        this.applyCollision();
        userInputHandler();//user input 
        this.animationSystem();
        this.applyPhysics();
        this.updateTimers();
        this.applyMovement(); 
        this.applyCollision();

    };
    obj.draw = function()
    {
        if(this.iFrames%2 == 0) //strobes player for invincibility frames
        {
            if(Math.abs(this.state) == 1)// on the ground 
            {
                if(this.state > 0) // facing right
                    onScreenSurface.drawImage(characterImage, 9+(32*((Math.floor(this.animationFrame/10))%4)), 41, 15 ,23,
                        Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),character.coordinates[2],character.coordinates[3]);
                else // facing left           
                    onScreenSurface.drawImage(characterImage, 711-(32*((Math.floor(this.animationFrame/10))%4)), 7, 15 ,23,
                        Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),character.coordinates[2],character.coordinates[3]);

            }
            else if (Math.abs(this.state) == 3)// in the air moving up
            {
                if(this.state > 0) // facing right
                    onScreenSurface.drawImage(characterImage, 201, 41, 15 ,23,
                        Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),character.coordinates[2],character.coordinates[3]);
                else // facing left           
                    onScreenSurface.drawImage(characterImage, 711-192, 7, 15 ,23,
                        Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),character.coordinates[2],character.coordinates[3]);

            }
            else if (Math.abs(this.state) == 2)// in the air moving down
            {
                if(this.state > 0) // facing right
                    onScreenSurface.drawImage(characterImage, 233, 41, 15 ,23,
                        Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),character.coordinates[2],character.coordinates[3]);
                else // facing left           
                    onScreenSurface.drawImage(characterImage, 711-224, 7, 15 ,23,
                        Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),character.coordinates[2],character.coordinates[3]);

            }
            else if (Math.abs(this.state) == 4)// in the air moving down
            {
                if(this.state > 0) // down
                    onScreenSurface.drawImage(characterImage, 9+(32*(19+((Math.floor(this.animationFrame/10))%4))), 41, 15 ,23,
                        Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),character.coordinates[2],character.coordinates[3]);
                else // up          
                    onScreenSurface.drawImage(characterImage, 9+(32*(22-((Math.floor(this.animationFrame/10))%4))), 41, 15 ,23,
                        Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),character.coordinates[2],character.coordinates[3]);
            }

        }
    };
    return (obj);
}

function door(x,y,w,h,level,cx,cy) // x,y location    width,height of door   destination level      destination x,y
{
    let obj = {};
    obj.coordinates = [x,y,w,h];
    obj.destination = [cx,cy,level]
    obj.tick = function(){};
    obj.colliding = function(){
        nextLevel(this.destination[2],this.destination[0],this.destination[1]);
    };
    obj.draw = function()
    {
       // onScreenSurface.fillStyle = 'red';
       // onScreenSurface.fillRect(this.coordinates[0]-camera.coordinates[0],this.coordinates[1]-camera.coordinates[1],this.coordinates[2],this.coordinates[3]);
    };
    return obj;
}

function breakable(x,y,num)
{
    let obj = {};
    obj.coordinates = [x,y,32,96];
    obj.num = num;
    obj.tick = function()
    {
        for(let i = 0;i<character.projectiles.length;i++)
            if (roughCollision(this.coordinates[0],this.coordinates[1],32,96,character.projectiles[i].coordinates[0],character.projectiles[i].coordinates[1],20,20))
            {
                BreakSFX.play();						
                currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
                levelPreventSpawn[this.num]= true;
                character.projectiles.splice(i, 1);
                currentRoom.active.push(explosion(this.coordinates[0],this.coordinates[1]));
                i--;
            }
    };
    
    obj.colliding = function(){
        fineCollision(character.coordinates[0],character.coordinates[1],character.coordinates[2],character.coordinates[3],
        this.coordinates[0],this.coordinates[1],32,96);
    };
    obj.draw = function()
    {
        onScreenSurface.drawImage(tilesImage,192,607,16,48,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),32,96);
    };
    return obj;
}

function slime(x,y)
{
    let obj = {};
    obj.coordinates = [x,y,32,32];
    obj.direction = true;
    if(Math.floor(Math.random()*10)%2 == 0)
        obj.direction = false;
    obj.animationTimer = Math.floor(Math.random()*60);
    obj.dead = false;
    obj.tick = function()
    {
        if(!this.dead)
        {
            for(let i = 0;i<character.projectiles.length;i++)
                if (roughCollision(this.coordinates[0],this.coordinates[1],32,32,character.projectiles[i].coordinates[0],character.projectiles[i].coordinates[1],20,20))
                {
                    SlimeSFX.play();
                    this.dead = true;
                    this.animationTimer =0;
                    character.projectiles.splice(i, 1);
                    currentRoom.active.push(explosion(this.coordinates[0],this.coordinates[1]));
                    i--;
                }
            for (let i= 0; i<currentRoom.static.length; i++)
                if(tileList[currentRoom.static[i].tileNum].passable == -1)
                    if(roughCollision(this.coordinates[0],this.coordinates[1],32,32,currentRoom.static[i].x, currentRoom.static[i].y,tileList[currentRoom.static[i].tileNum].w*2, tileList[currentRoom.static[i].tileNum].h*2))
                        this.direction = !this.direction
            if(this.direction)
                this.coordinates[0]+=1;
            else
                this.coordinates[0]-=1;
        }
        else
            if(this.animationTimer == 59)
            {
                if(Math.floor(Math.random()*50)%(character.health+1)== 0)
                    currentRoom.active.push(healthPickup(this.coordinates[0],this.coordinates[1]-10,0));
                currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
            }
        
        this.animationTimer ++;
        if(this.animationTimer > 10000)
            this.animationTimer = 0;
    };
    
    obj.colliding = function(){
        if(!this.dead)
            if(character.hurt())
            {
                FallSFX.play();		
                character.bounce(this.coordinates[0]+16,this.coordinates[1]+16)
            }
    };

    obj.draw = function()
    {
        if(!this.direction)
        {
            if(!this.dead)
            {
                onScreenSurface.drawImage(tilesImage,242+(32*(Math.floor(this.animationTimer/6)%10)),235,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
            }
            else 
            {
                onScreenSurface.drawImage(tilesImage,242+(32*(Math.floor(this.animationTimer/6)%10)),255,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
            }
        }
        else
        {
            if(!this.dead)
            {
                onScreenSurface.drawImage(tilesImage,531-(32*(Math.floor(this.animationTimer/6)%10)),274,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
            }
            else
            {
                onScreenSurface.drawImage(tilesImage,532-(32*(Math.floor(this.animationTimer/6)%10)),295,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
            }
        }
    };
    return obj;
}

function bird(x,y)
{
    let obj = {};
    obj.coordinates = [x,y,40,25];
    obj.returnCoordinates = [x,y];
    obj.targetCoordinates = [x,y];
    obj.diveState = false;
    obj.direction = true;
    obj.visualState = true;
    obj.diveTimer = 0;
    obj.characterDistance = 500;
    obj.diveAngle = 0;
    obj.animationTimer = 0;
    obj.dead = false;
    obj.tick = function()
    {
        if(!this.dead)
        {
            this.checkDive();
            if(this.direction)
                this.returnCoordinates[0]+=1.5;
            else if (!this.direction)
                this.returnCoordinates[0]-=1.5;
            this.stateManager();
            this.advanceAnimationTimer();
            this.checkCollision();
        }
        else
        {
            this.coordinates[1] +=3;
            if(this.animationTimer>200)
                currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
        }
    };
    
    obj.stateManager = function()
    {
        if(!this.diveState) //normal state
        {
            this.normalState();
        }
        else if (this.diveTimer == 0) //dive
        {
             this.diveState1();
        }
        else if (this.diveTimer <= 50) //move after dive
        {
            this.diveState2();
        }
        else // return to normal state
        {
             this.recoveryState();
        }
    };
   
    obj.normalState = function()
    {
        this.coordinates[0] = this.returnCoordinates[0];
        this.coordinates[1] = this.returnCoordinates[1];
        this.characterDistance = Math.sqrt(Math.pow(((character.coordinates[0]+15)-(this.coordinates[0]+16)),2)
                                           +Math.pow(((character.coordinates[1]+32)-(this.coordinates[1]+29)),2));
        this.visualState = this.direction;
        if(this.diveTimer<0)
            this.diveTimer++;
    };

    obj.diveState1 = function()
    {
        this.coordinates[0] += 3*Math.cos(this.diveAngle);
        this.coordinates[1] += 3*Math.sin(this.diveAngle);
        if(roughCollision(this.coordinates[0]+16,this.coordinates[1]+29,10,10,this.targetCoordinates[0],this.targetCoordinates[1],10,10))
                this.diveTimer++;
    };
    
    obj.diveState2 = function()
    {
        if(this.visualState)
            this.coordinates[0] +=2;
        else
            this.coordinates[0] -= 2;
        this.diveTimer ++;
    };
    
    obj.recoveryState = function()
    {
        this.diveAngle = Math.atan2(this.returnCoordinates[1]-this.coordinates[1],this.returnCoordinates[0]-this.coordinates[0]);
        this.coordinates[0] += 1.5*Math.cos(this.diveAngle);
        this.coordinates[1] += 1.5*Math.sin(this.diveAngle);
        if(Math.abs(this.diveAngle) > Math.PI/2 && Math.abs(this.diveAngle) < (3/2)*Math.PI )
            this.visualState = false;
        else
            this.visualState = true;
        if(roughCollision(this.coordinates[0],this.coordinates[1],10,10,this.returnCoordinates[0],this.returnCoordinates[1],10,10))
        {
            this.diveState = false;
            this.diveTimer = -60;
        }
    };
    
    obj.checkDive = function()
    {
        if(this.characterDistance < 190 && !this.diveState && this.diveTimer == 0) //checks if enemy should dive
        {
            this.diveState = true;
            this.targetCoordinates = [character.coordinates[0]+15,character.coordinates[1]+23]
            this.diveAngle = Math.atan2(this.targetCoordinates[1]-this.coordinates[1]-29,this.targetCoordinates[0]-this.coordinates[0]-16);
            this.targetCoordinates[0] += 100*Math.cos(this.diveAngle);
            this.targetCoordinates[1] += 100*Math.sin(this.diveAngle);
            this.diveAngle = Math.atan2(this.targetCoordinates[1]-this.coordinates[1]-29,this.targetCoordinates[0]-this.coordinates[0]-16);
            if(Math.abs(this.diveAngle) > Math.PI/2 && Math.abs(this.diveAngle) < (3/2)*Math.PI )
                this.visualState = false;
            else
                this.visualState = true;

            }
    };
    
    obj.checkCollision = function()
    {
        for(let i = 0;i<character.projectiles.length;i++)
            if (roughCollision(this.coordinates[0],this.coordinates[1],45,32,character.projectiles[i].coordinates[0],character.projectiles[i].coordinates[1],20,20))
            {
                BirdSFX.play();
                this.dead = true;
                this.animationTimer = 0;
                if(Math.floor(Math.random()*50)%(character.health+1)== 0)
                    currentRoom.active.push(healthPickup(this.coordinates[0],this.coordinates[1]-10,0));
                character.projectiles.splice(i, 1);
                currentRoom.active.push(explosion(this.coordinates[0],this.coordinates[1]));
                i--;
            }
        for (let i= 0; i<currentRoom.static.length; i++)
        {
            if(tileList[currentRoom.static[i].tileNum].passable == -1)
            {
                if(roughCollision(this.returnCoordinates[0],this.returnCoordinates[1],32,32,currentRoom.static[i].x, currentRoom.static[i].y,tileList[currentRoom.static[i].tileNum].w*2, tileList[currentRoom.static[i].tileNum].h*2))
                    this.direction = !this.direction;
            }
        }
    };
    
    obj.advanceAnimationTimer = function()
    {
        this.animationTimer ++;
        if(this.animationTimer > 10000)
            this.animationTimer = 0;
    };
    
    obj.colliding = function()
    {
        if(!this.dead)
            if(character.hurt())
            {
                FallSFX.play();		
                character.bounce(this.coordinates[0]+16,this.coordinates[1]+29)
            }
    };
    obj.draw = function()
    {
        if(!this.dead)
        {
            if(!this.visualState)
            {
                if(!this.diveState || this.diveTimer != 0)
                    onScreenSurface.drawImage(tilesImage,261+(32*(Math.floor(this.animationTimer/6)%5)),76,32,52,Math.floor(this.coordinates[0]-camera.coordinates[0]-16), Math.floor(this.coordinates[1]-camera.coordinates[1]-38),64,104);
                else
                    onScreenSurface.drawImage(tilesImage,261+(32*2),76,32,52,Math.floor(this.coordinates[0]-camera.coordinates[0]-16), Math.floor(this.coordinates[1]-camera.coordinates[1]-38),64,104);
            }
            else
            {
                if(!this.diveState || this.diveTimer != 0)
                    onScreenSurface.drawImage(tilesImage,397-(32*(Math.floor(this.animationTimer/6)%5)),136,32,44,Math.floor(this.coordinates[0]-camera.coordinates[0]-16), Math.floor(this.coordinates[1]-camera.coordinates[1]-38),64,88);
                else
                    onScreenSurface.drawImage(tilesImage,397-(32*2),136,32,44,Math.floor(this.coordinates[0]-camera.coordinates[0]-16), Math.floor(this.coordinates[1]-camera.coordinates[1]-38),64,88);
            }
        }
        else
        {
            onScreenSurface.drawImage(tilesImage,428,88,22,31,Math.floor(this.coordinates[0]-camera.coordinates[0]-16), Math.floor(this.coordinates[1]-camera.coordinates[1]-38),44,62);
        }
    };
    return obj;
}

function projectile(x,y,dir)
{
    let obj = {};
    obj.coordinates = [x+10,y+10];
    obj.direction;
    ShootSFX.currentTime = 0;						
    ShootSFX.play();						
    if(dir>0)
        obj.direction = true;
    else
        obj.direction = false;
    
    if(!obj.direction)
        obj.coordinates[0]-=25;
    obj.ttl = 100;
    
    obj.tick = function()
    {
        for (let i = 0; i<currentRoom.static.length; i++)
        {
            if(tileList[currentRoom.static[i].tileNum].passable == 1)
            {
                if(roughCollision(this.coordinates[0],this.coordinates[1],30,30,currentRoom.static[i].x, currentRoom.static[i].y,tileList[currentRoom.static[i].tileNum].w*2, tileList[currentRoom.static[i].tileNum].h*2))
                {
                    character.projectiles.splice(character.projectiles.indexOf(this), 1);
                    currentRoom.active.push(explosion(this.coordinates[0],this.coordinates[1]));
                    i =currentRoom.static.length;
                }
            }
        }
        if(this.direction)
           this.coordinates[0]+=5;
        else      
           this.coordinates[0]-=5;
        this.ttl--;
        if(this.ttl < 0)
        {
             character.projectiles.splice(character.projectiles.indexOf(this), 1);
             currentRoom.active.push(explosion(this.coordinates[0],this.coordinates[1]));
        }

    };
    obj.draw = function()
    {
        onScreenSurface.drawImage(tilesImage,268,8,15,15,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),30,30);
    };
    return obj;
}

function movingPlatform(x,y,length,type,x2,y2)// x,y start coordinates ,     length of platform  ,   graphic to use for platform   ,     end of path x,y
{
    let obj = {};
    obj.coordinates = [x,y,length*32,32];
    obj.start = [x,y];
    obj.destination = [x2,y2];
    
    obj.wait = 0;
    obj.remainingDistance = Math.sqrt(Math.pow((obj.destination[0]-obj.start[0]),2)+Math.pow((obj.destination[1]-obj.start[1]),2));
    obj.movementAngle = Math.atan2(obj.destination[0] - obj.coordinates[0],obj.destination[1]- obj.coordinates[1]);
    
    obj.platformCanvas = document.createElement('canvas');
    obj.platformCanvas.width = (length*32);
    obj.platformCanvas.height = 32;
    obj.platformSurface = obj.platformCanvas.getContext("2d");
    obj.platformSurface.imageSmoothingEnabled = false;   
    if (length > 1)
    {
        obj.platformSurface.drawImage(tilesImage,tileList[type].x,tileList[type].y,
                                  tileList[type].w,tileList[type].h,0,0,tileList[type].w*2,tileList[type].h*2);
        for(let i = 1;i<length-1;i++)
            obj.platformSurface.drawImage(tilesImage,tileList[type+1].x,tileList[type+1].y,
                                          tileList[type+1].w,tileList[type+1].h,i*32,0,tileList[type+1].w*2,tileList[type+1].h*2);
        obj.platformSurface.drawImage(tilesImage,tileList[type+2].x,tileList[type+2].y,
                                  tileList[type+2].w,tileList[type+2].h,((length-1)*32),0,tileList[type+2].w*2,tileList[type+2].h*2);
    }
    else
        obj.platformSurface.drawImage(tilesImage,tileList[type+3].x,tileList[type+3].y,
                                  tileList[type+3].w,tileList[type+3].h,0,0,tileList[type+3].w*2,tileList[type+3].h*2);
    obj.tick = function()
    {    
        if(this.wait < 1)
        {
            this.coordinates[0] += 1*Math.sin(this.movementAngle);
            this.coordinates[1] += 1*Math.cos(this.movementAngle);
            this.remainingDistance--;
            if(this.remainingDistance<1)
            {
                this.remainingDistance = Math.sqrt(Math.pow((this.destination[0]-this.start[0]),2)+Math.pow((this.destination[1]-this.start[1]),2));
                this.movementAngle += Math.PI
                if(this.movementAngle> Math.PI*2)
                    this.movementAngle - Math.PI*2;
                this.wait = 60;
            }
        }
        else
            this.wait--;     
    };
    
    obj.colliding = function()
    {
        fineCollision(character.coordinates[0],character.coordinates[1],character.coordinates[2],character.coordinates[3],
        this.coordinates[0],this.coordinates[1],this.coordinates[2],this.coordinates[3]);

        if(this.wait < 1)
        {
            character.coordinates[0] += 1*Math.sin(this.movementAngle);
            character.coordinates[1] += 1*Math.cos(this.movementAngle);
        }
    };

    obj.draw = function()
    {
        onScreenSurface.drawImage(this.platformCanvas,0,0,this.coordinates[2],this.coordinates[3],Math.floor(this.coordinates[0]-camera.coordinates[0]),
            Math.floor(this.coordinates[1]-camera.coordinates[1]),this.coordinates[2],this.coordinates[3]);
    };

    return obj;
   
}

function rotatingFire(x,y,length,startAngle,speed)// x,y, length of fire stick, startAngle, speed in frames to make a full rotation
{
    let obj = {};
    obj.coordinates = [x,y,32,32];
    obj.hitbox = [32,32];
    obj.rotationAngle = startAngle*(Math.PI/180);
    obj.speed = (Math.PI/15)/speed;
    obj.fireBalls = [];
    for(let i = 0;i<length;i++)
        obj.fireBalls.push(fireBall(x,y));
    
    obj.tick = function()
    {
        this.rotationAngle += this.speed;
        if(this.rotationAngle> Math.PI*2);
            this.rotationAngle - Math.PI*2;
        for(let i =0;i<this.fireBalls.length;i++)
        {
            this.fireBalls[i].coordinates[0] = this.coordinates[0]+10+(i*16)*Math.cos(this.rotationAngle);
            this.fireBalls[i].coordinates[1] = this.coordinates[1]+12+(i*16)*Math.sin(this.rotationAngle);
            this.fireBalls[i].tick();
        }
    };
    obj.colliding = function(){
        fineCollision(character.coordinates[0],character.coordinates[1],character.coordinates[2],character.coordinates[3],
            this.coordinates[0],this.coordinates[1],this.coordinates[2],this.coordinates[3]);
    };
    obj.draw = function()
    {
        onScreenSurface.drawImage(tilesImage,80,1056,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]),
            Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
        for(let i =0;i<this.fireBalls.length;i++)
            this.fireBalls[i].draw();
    };
    return obj;
}

function jumpingFire(x,y,height,delay)// x,y, length of fire stick, startAngle, speed in frames to make a full rotation
{
    let obj = {};
    obj.coordinates = [x,y,32,32];
    obj.velocity = 0;
    obj.timer = 0;
    obj.jump = height;
    obj.delay = delay;
    obj.fireBalls = [];
    obj.fireBalls.push(fireBall(x,y));
    
    obj.tick = function()
    {
        this.timer++;
        this.fireBalls[0].tick();
        if(this.timer<(this.delay*10))
            this.velocity=0;
        else if(this.timer == (this.delay*10))
            this.velocity = this.jump;
        else if(this.timer < (this.delay*10)+200)
            this.velocity -= (this.jump/(100));
        else
            this.timer = 0;
        this.fireBalls[0].coordinates[1] -= this.velocity;
    };
    obj.colliding = function(){};
    obj.draw = function()
    {
        if(this.timer > (this.delay*10))
            this.fireBalls[0].draw();
        if((this.timer > (this.delay*10) &&  this.timer < (this.delay*10)+30 )||( this.timer > 0 && this.timer < 30))
            onScreenSurface.drawImage(tilesImage,108,1011,23,13,Math.floor(this.coordinates[0]-camera.coordinates[0]-20),
            Math.floor(this.coordinates[1]-camera.coordinates[1]-26),46,26);

    };
    return obj;
}

function fireBall(x,y)// x,y
{
    let obj = {};
    obj.coordinates = [x,y];          
    obj.tick = function()
    {
        if (roughCollision(character.coordinates[0],character.coordinates[1],character.coordinates[2],character.coordinates[3],
                           this.coordinates[0],this.coordinates[1],12,8))
        {
            if(character.hurt())
            {
                FallSFX.play();
                character.bounce(this.coordinates[0]+6,this.coordinates[1]+4)
            }
        }
    };
    obj.draw = function()
    {
        onScreenSurface.drawImage(tilesImage,101,1004,12,8,Math.floor(this.coordinates[0]-camera.coordinates[0]),
        Math.floor(this.coordinates[1]-camera.coordinates[1]),24,16);
    };

    return obj;
   
}

function fallingPlatform(x,y,time,type)
{
    let obj = {};
    obj.coordinates = [x,y,32,32];
    obj.start = [x,y];
    obj.time = time;
    obj.type = type;
    obj.timer = -1;
    
    obj.tick = function()
    {    
        if(this.timer>-1)
            this.timer++;
        
        if(this.timer < 20)
            {}
        else if (this.timer < 20+this.time)
        {
            if(Math.floor(this.timer/3)%2)
                this.coordinates[0] +=1;
            else
                this.coordinates[0] -=1;
        }
        else if(this.timer < this.time+190)
        {
            this.coordinates[1] +=5;
            if(this.timer == this.time+20)
            {
                FallSFX.currentTime = 0;						
                FallSFX.play();
            }
        }
        else
        {
            this.timer=-1;
            this.coordinates[1] = this.start[1];
        }
    };
    
    obj.colliding = function()
    {
        fineCollision(character.coordinates[0],character.coordinates[1],character.coordinates[2],character.coordinates[3],
        this.coordinates[0],this.coordinates[1],this.coordinates[2],this.coordinates[3]);
        if(this.timer == -1)
            this.timer++;
    };

    
    obj.draw = function()
    {
        if(type == 1)
            onScreenSurface.drawImage(tilesImage,48,672,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]),Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
        if(type == 2)
            onScreenSurface.drawImage(tilesImage,48,592,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]),Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
        if(type == 3)
            onScreenSurface.drawImage(tilesImage,48,1040,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]),Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
    };
    return obj;
}

function doubleJumpPowerUp(x,y,num)
{
    let obj = {};
    obj.floatTimer = Math.floor(Math.random()*100);
    obj.coordinates = [x,y-(obj.floatTimer*0.1),32,32];
    obj.direction = false;
    obj.num = num;

    obj.tick = function()
    {
        if (this.floatTimer >= 100)
        {
            this.floatTimer = 0;
            this.direction = !this.direction;
        }
        else
            this.floatTimer++;
        if(this.direction)
            this.coordinates[1] += 0.1;
        else
            this.coordinates[1] -= 0.1;
    };
    
    obj.colliding = function()
    {
        character.jumpPowerup = true;
        messageSystem("    You Have Picked up           an ability        Hit Up while jumping          to double jump       Press Enter to continue");
        PowerupSFX.play();						
        currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
        levelPreventSpawn[this.num]= true;
    };

    obj.draw = function()
    {
        onScreenSurface.drawImage(powerUpImage,0,0,34,34,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),34,34);
    };

    return obj;
}

function dashPowerUp(x,y,num)
{
    let obj = {};
    obj.floatTimer = Math.floor(Math.random()*100);
    obj.coordinates = [x,y-(obj.floatTimer*0.1),32,32];
    obj.direction = false;
    obj.num = num;
    obj.tick = function()
    {
        if (this.floatTimer >= 100)
        {
            this.floatTimer = 0;
            this.direction = !this.direction;
        }
        else
            this.floatTimer++;
        if(this.direction)
            this.coordinates[1] += 0.1;
        else
            this.coordinates[1] -= 0.1;
    };
    
    obj.colliding = function()
    {
            character.dashPowerup = true;
            messageSystem("    You Have Picked up           an ability            Hit Shift to dash   and gain a burst of speed  Press Enter to continue");
            PowerupSFX.play();
            levelPreventSpawn[this.num]= true;
            currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
    };

    obj.draw = function()
    {
        onScreenSurface.drawImage(powerUpImage,34,0,34,34,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),34,34);
    };

    return obj;
}

function shootPowerUp(x,y,num)
{
    let obj = {};
    obj.floatTimer = Math.floor(Math.random()*100);
    obj.coordinates = [x,y-(obj.floatTimer*0.1),32,32];
    obj.num = num;
    obj.direction = false;

    obj.tick = function()
    {
        if (this.floatTimer >= 100)
        {
            this.floatTimer = 0;
            this.direction = !this.direction;
        }
        else
            this.floatTimer++;
        if(this.direction)
            this.coordinates[1] += 0.1;
        else
            this.coordinates[1] -= 0.1;
    };
    
    obj.colliding = function()
    {
            character.projectilePowerup = true;
            messageSystem("    You Have Picked up           an ability            Hit Z to shoot and       destroy obstacles     Press Enter to continue");
            PowerupSFX.play();
            levelPreventSpawn[this.num]= true;
            currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
    };

    obj.draw = function()
    {
        onScreenSurface.drawImage(powerUpImage,68,0,34,34,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),34,34);
    };

    return obj;
}

function healthPickup(x,y,num)
{
    let obj = {};
    obj.floatTimer = Math.floor(Math.random()*100);
    obj.coordinates = [x,y-(obj.floatTimer*0.1),32,32];
    obj.num = num;
    obj.direction = false;

    obj.tick = function()
    {
        if (this.floatTimer >= 100)
        {
            this.floatTimer = 0;
            this.direction = !this.direction;
        }
        else
            this.floatTimer++;
        if(this.direction)
            this.coordinates[1] += 0.1;
        else
            this.coordinates[1] -= 0.1;
    };
    
    obj.colliding = function()
    {
        if(character.health<character.maxHealth)
        {
            character.health++;
            HealSFX.play();						
            currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
            levelPreventSpawn[this.num]= true;
        }
    };

    obj.draw = function()
    {
        onScreenSurface.drawImage(heartImage,0,15,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]),Math.floor(this.coordinates[1]-camera.coordinates[1]),16*2,16*2);
    };

    return obj;
}

function fullHealthPickup(x,y,num)
{
    let obj = {};
    obj.floatTimer = Math.floor(Math.random()*100);
    obj.coordinates = [x,y-(obj.floatTimer*0.1),32,32];
    obj.num = num;
    obj.direction = false;

    obj.tick = function()
    {
        if (this.floatTimer >= 100)
        {
            this.floatTimer = 0;
            this.direction = !this.direction;
        }
        else
            this.floatTimer++;
        if(this.direction)
            this.coordinates[1] += 0.1;
        else
            this.coordinates[1] -= 0.1;
    };
    
    obj.colliding = function()
    {
        character.health = character.maxHealth;
        HealSFX.play();						
        currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
        levelPreventSpawn[this.num]= true;
    };

    obj.draw = function()
    {
        onScreenSurface.drawImage(heartImage,0,0,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]),Math.floor(this.coordinates[1]-camera.coordinates[1]),16*2,16*2);
    };

    return obj;
}

function explosion(x,y)
{
    let obj = {};
    obj.coordinates = [x,y,0,0];
    obj.ticks = 0;
    obj.tick = function ()
    {
        this.ticks++;
        if(this.ticks>30)
            currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
    };
    
    obj.colliding = function() {};
    
    obj.draw = function ()
    {
        onScreenSurface.drawImage(explosionImage,Math.floor(this.ticks/3)*32,0,32,32,
            Math.floor(this.coordinates[0]-(this.ticks/2)-camera.coordinates[0]),Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
    };
    return obj;