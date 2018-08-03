function boss(x,y)
{
    let obj = {};
    obj.coordinates = [x,y,360,360];
    obj.state = 0;
    obj.stateFrames = [15,9,6,8];
    obj.animationTimer = 0;
    obj.health = 40;
    obj.flipped = false;
    obj.playerAngle = 0;
    obj.bossCanvas = document.createElement('canvas');
    obj.bossCanvas.width = 360;
    obj.bossCanvas.height = 360;
    obj.bossSurface = obj.bossCanvas.getContext("2d");
    obj.bossSurface.imageSmoothingEnabled = false;   
    
    obj.tick = function()
    {
        //idle state hitbox offsets +80 , +180 , -180 ,-180     center point is +170 +340 for bounces 
        if(this.state != 1)
        {
            this.checkDeath();
            this.checkCollision();
            if(this.state == 0)
                this.swingSword();
            if(this.state == 2)
                this.summonSlimes();
            if(this.state == 3)
                this.walkAround();

        }
        else
        {
            this.deathDelay();
        }
        this.animationCounter();
        this.drawHelper();
    };
    
    obj.summonSlimes = function()
    {
        if(this.animationTimer%60 == 0)
            currentRoom.active.push(slimeSpawner(Math.floor(Math.random()*610)+200));
        //if(this.animationTimer%100 == 0) // too hard
           // currentRoom.active.push(tempJumpingFire(character.coordinates[0],980,10,7));
        if(this.animationTimer >= 150)
            this.chooseNewState();
    };
    
    obj.swingSword = function()
    {
        if(this.animationTimer %150 == 90)
            for(let i =0;i<5;i++)
                if(this.flipped)
                    currentRoom.active.push(shootFire(this.coordinates[0]+30,Math.floor(Math.random()*100)+670,Math.floor(Math.random()*200)));
                else
                    currentRoom.active.push(shootFire(this.coordinates[0]+300,Math.floor(Math.random()*100)+670,Math.floor(Math.random()*200)));
        if(this.animationTimer %150 == 0)
            this.turnToPlayer();
        if(this.animationTimer >= 300)
            this.chooseNewState();
    };
    
    obj.walkAround = function()
    {
        if(this.animationTimer%200 == 0)
            currentRoom.active.push(spinFire(this.coordinates[0]+170,this.coordinates[1]+270,Math.floor(Math.random()*36)));
        if(this.animationTimer%60 == 0)
            this.turnToPlayer();
        if(this.flipped && this.coordinates[0] > 120)
            this.coordinates[0] -=0.75;
        else if (!this.flipped && this.coordinates[0] < 552)
            this.coordinates[0] +=0.75;
        if(this.animationTimer >= 500)
            this.chooseNewState();
    };

    obj.chooseNewState = function()
    {
        this.turnToPlayer();
        this.state = Math.floor(Math.random()*3);
        if(this.state == 1)
            this.state = 3;
        this.animationTimer = 0;
    };
    
    obj.turnToPlayer = function()
    {
        this.playerAngle = Math.atan2(this.coordinates[1]-character.coordinates[1]+195,this.coordinates[0]-character.coordinates[0]+103);
        if(Math.abs(this.playerAngle) > Math.PI/2 && Math.abs(this.playerAngle) < (3/2)*Math.PI )
            this.flipped = false;
        else
            this.flipped = true;
    };

    obj.checkCollision = function()
    {
        if(roughCollision(this.coordinates[0]+80,this.coordinates[1]+180,360-180,369-180,
            character.coordinates[0],character.coordinates[1],character.coordinates[2],character.coordinates[3])) //check collision with character    
            if(character.hurt())
            {
                FallSFX.play();		
                character.bounce(this.coordinates[0]+170,this.coordinates[1]+340);
            }
        for(let i = 0;i<character.projectiles.length;i++) //check collision with projectiles
            if (roughCollision(this.coordinates[0]+80,this.coordinates[1]+180,this.coordinates[2]-180,this.coordinates[3]-180,
                               character.projectiles[i].coordinates[0],character.projectiles[i].coordinates[1],20,20))
            {
                this.health--;
                currentRoom.active.push(explosion(character.projectiles[i].coordinates[0],character.projectiles[i].coordinates[1]));
                character.projectiles.splice(i, 1);
                i--;
            }
    };
    
    obj.drawHelper = function()
    {
        this.bossSurface.clearRect(0,0,360,360);
        if(this.flipped)
        {
            this.bossSurface.save(); // Save the current state
            this.bossSurface.scale(-1, 1); // Set scale to flip the image
            this.bossSurface.drawImage(bossImage,0+(360*((Math.floor(this.animationTimer/10))%this.stateFrames[this.state]))
                                        ,360*this.state,360,360,0+20,0,360*-1,360);
            this.bossSurface.restore(); // Restore the last saved state
        }
        else
            this.bossSurface.drawImage(bossImage,0+(360*((Math.floor(this.animationTimer/10))%this.stateFrames[this.state]))
                                       ,360*this.state,360,360,0,0,360,360);
    };
    
    obj.checkDeath = function()
    {
        if(this.health <= 0)
        {
            this.state=1;
            this.animationTimer = 0;
            BossDeathSFX.play();
        }

    };

    obj.animationCounter = function()
    {
        this.animationTimer++;
        if(this.animationTimer > 10000)
            this.animationTimer = 0;
    };
    
    obj.deathDelay = function()
    {
        if(this.animationTimer >= 90)
        {
            currentRoom.active.push(treasure(this.coordinates[0]+128,739));
            currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
        }
    };

    obj.colliding = function(){};
        
    obj.draw = function()
    {
        onScreenSurface.drawImage(this.bossCanvas,0,0,this.coordinates[2],this.coordinates[3],Math.floor(this.coordinates[0]-camera.coordinates[0]),
            Math.floor(this.coordinates[1]-camera.coordinates[1]),this.coordinates[2],this.coordinates[3]);
        
        onScreenSurface.strokeStyle = 'black';
        onScreenSurface.lineJoin = "round";
        onScreenSurface.lineWidth = 30;
        onScreenSurface.strokeRect(280,20,300,0);
        onScreenSurface.strokeStyle = 'red';
        onScreenSurface.fillStyle = 'red';
        onScreenSurface.lineWidth = 20;
        onScreenSurface.strokeRect(282-((this.health-40)*296/40),20,296+((this.health-40)*296/40),0);
    };
    return obj;
}

function treasure(x,y)
{
    let obj = {};
    obj.coordinates = [x,y,64,64];
    obj.direction = false;
    obj.tick = function(){};
    
    obj.colliding = function()
    {
        character.dead = true;
        messageSystem("          YOU WIN         Press Enter to continue");
        PowerupSFX.play();						
    };

    obj.draw = function()
    {
        onScreenSurface.drawImage(tilesImage,370,2,32,32,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),64,64);
    };

    return obj;
}

function slimeSpawner(x)
{
    let obj = {};
    obj.coordinates = [x,0,32,32];
    obj.tick = function()
    {
        this.coordinates[1] += 4;
        if(this.coordinates[1] >= 770)    
        {
            currentRoom.active.push(slime(this.coordinates[0],this.coordinates[1]));
            currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
        }
        for(let i = 0;i<character.projectiles.length;i++)
            if (roughCollision(this.coordinates[0],this.coordinates[1],32,32,character.projectiles[i].coordinates[0],character.projectiles[i].coordinates[1],20,20))
                {
                    SlimeSFX.play();
                    character.projectiles.splice(i, 1);
                    currentRoom.active.push(explosion(this.coordinates[0],this.coordinates[1]));
                    i--;
                    if(Math.floor(Math.random()*50)%(character.health+1)== 0)
                        currentRoom.active.push(healthPickup(this.coordinates[0],this.coordinates[1]-10,0));
                    currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
                }
    };
    
    obj.colliding = function(){
        if(character.hurt())
        {
            FallSFX.play();		
            character.bounce(this.coordinates[0]+16,this.coordinates[1]+16)
        }
    };

    obj.draw = function()
    {
        onScreenSurface.drawImage(tilesImage,242,235,16,16,Math.floor(this.coordinates[0]-camera.coordinates[0]), Math.floor(this.coordinates[1]-camera.coordinates[1]),32,32);
    };
    return obj;
}

function shootFire(x,y,delay)
{
    let obj = {};
    obj.coordinates = [x,y,12,8];
    obj.angle = 0;
    obj.ttl = 500+delay;
    
    obj.tick = function()
    {
        this.ttl--;
        if(this.ttl == 500)
            this.angle = Math.atan2(this.coordinates[1]-character.coordinates[1],this.coordinates[0]-character.coordinates[0]);
        if(this.ttl < 500)
        {
            this.coordinates[0] -= 3*Math.cos(this.angle);
            this.coordinates[1] -= 3*Math.sin(this.angle);
        }
        if(this.ttl < 0)
            currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
    };
    
    obj.colliding = function(){
        if(character.hurt())
        {
            FallSFX.play();		
            character.bounce(this.coordinates[0]+6,this.coordinates[1]+4)
        }
    };
    
    obj.draw = function()
    {
        onScreenSurface.drawImage(tilesImage,101,1004,12,8,Math.floor(this.coordinates[0]-camera.coordinates[0]),
        Math.floor(this.coordinates[1]-camera.coordinates[1]),24,16);
    };
    return obj;
}

function spinFire(x,y,angle)// spinning fire attack
{
    let obj = {};
    obj.coordinates = [x,y,0,0];
    obj.timer = 0;
    obj.angle = angle;
    obj.fireBalls = [];
    for(let i = 0;i<10;i++)
        obj.fireBalls.push(fireBall(x,y));
    obj.tick = function()
    {
        this.timer++;
        if(this.timer < 100)
        {
            for(let i = 0;i<10;i++)
            {
                this.fireBalls[i].coordinates[0] = this.coordinates[0]+((100-this.timer)*Math.cos(((this.angle+(this.timer/2)+(i*36))*(Math.PI/180))));
                this.fireBalls[i].coordinates[1] = this.coordinates[1]+((100-this.timer)*Math.sin(((this.angle+(this.timer/2)+(i*36))*(Math.PI/180))));
                this.fireBalls[i].tick();
            }
        }
        else if (this.timer < 800)
        {
            for(let i =0;i<10;i++)
            {
                this.fireBalls[i].coordinates[0] = this.coordinates[0]+10+(3*(this.timer-100))*Math.cos((this.angle+100+(i*36))*(Math.PI/180));
                this.fireBalls[i].coordinates[1] = this.coordinates[1]+12+(3*(this.timer-100))*Math.sin((this.angle+100+(i*36))*(Math.PI/180));
                this.fireBalls[i].tick();
            }   
        }
        else
            currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
    };
    obj.colliding = function(){};
    obj.draw = function()
    {
        for(let i =0;i<10;i++)
            this.fireBalls[i].draw();
    };
    return obj;
}

function tempJumpingFire(x,y,height,delay)// not being used too hard
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
            currentRoom.active.splice(currentRoom.active.indexOf(this), 1);
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
