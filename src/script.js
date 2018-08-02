var offScreenCanvas = document.createElement('canvas');
offScreenCanvas.width = '5000';
offScreenCanvas.height = '5000';
var offScreenSurface = offScreenCanvas.getContext("2d");
offScreenSurface.imageSmoothingEnabled = false;

var skyCanvas = document.createElement('canvas');
skyCanvas.width = '5000';
skyCanvas.height = '5000';
var skySurface = skyCanvas.getContext("2d");
skySurface.imageSmoothingEnabled = false;

let onScreenCanvas = document.getElementById("bg");//getting canvas
let onScreenSurface = onScreenCanvas.getContext("2d");//setting canvas for drawing
onScreenSurface.imageSmoothingEnabled = false;

let keysPressed = [];//an array that holds the keys currently down

document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

let camera = createCamera(); 

let character = createCharacter();//creates variable to hold character needs to be created here because everything else references this
let tileList = [];//list of tiles and their locations on the sprite sheet and atributes
setTileList();//populates the list with hardcoded tile information

let waitTimer = 60; // prevents main menu from being skipped instantly by holding enter forces 1 second delay
let menuCursor = 0;
let messageState = false; // prevents game from updating while messages are displaying on screen 

function keyDownHandler(e) //appends key to array if it is not already present
{
    if(!keysPressed.includes(e.keyCode))
        keysPressed.push(e.keyCode)
}

function keyUpHandler(e) //removes specified key from array
{
    keysPressed.splice(keysPressed.indexOf(e.keyCode), 1);
}

window.onload = function() //this prevents game from starting before all assets are loaded
{
    mainMenuBackground();
};

function mainMenuBackground() // generates main menu background
{
    LevelTheme.pause();
    LevelTheme.currentTime = 0;
    nextLevel(0,0,700);
    generateRoomMap(0);
    generateBackground()
    waitTimer = 60;
    menuCursor = 0;
    mainMenu();   
}

function mainMenu() //main menu loop generates new character and map upon ending
{
    if(!messageState)
    {
        if(waitTimer<-950)
            waitTimer = 0;
        waitTimer--;
        if(keysPressed.includes(13) && waitTimer< 5 && menuCursor == 0)
        {
            HealSFX.play();
            StartSFX.play();	
            setTimeout(function(){LevelTheme.play();},2200);	
            character = createCharacter();
            nextLevel(0,50,920);
            //nextLevel(4,880,30);
            window.requestAnimationFrame(gameLoop);
        }
        else if(keysPressed.includes(13) && waitTimer< 5 && menuCursor == 1)
        {
            HealSFX.play();
            messageSystem(" Welcome to The Tutorial -------------------------  Move your character    left and right with the         arrow keys                                   Jump with the up arrow                          The character hp is shown    in the top left                                 collect floating icons  for powerups and health ------------------------- Press Enter to Continue");
            window.requestAnimationFrame(mainMenu);

        }
        else
        {
            drawBackground();
            onScreenSurface.drawImage(menu1Image,80,170);
            onScreenSurface.drawImage(menu2Image,250,345);
            if(Math.floor(waitTimer/30)%2)
            {
                onScreenSurface.beginPath();
                onScreenSurface.fillStyle = "orange";
                onScreenSurface.arc(240, 355+(menuCursor*30), 3, 0, 2 * Math.PI, false);
                onScreenSurface.fill();
            }
            if(keysPressed.includes(38))//up
            {
                menuCursor--;
                JumpSFX.play();
            }
            else if (keysPressed.includes(40))
            {
                menuCursor++;
                JumpSFX.play();
            }
            if(menuCursor<0)
                menuCursor =0;
            if(menuCursor>1)
                menuCursor =1;
            window.requestAnimationFrame(mainMenu);
            }
    }
    else
    {
        waitMessage();
        window.requestAnimationFrame(mainMenu);
    }
}

function gameLoop() //main control loop
{

    if(!messageState)
    {
        render();
        gameLogic();
    }
    else
       waitMessage();
    
    if(!character.dead || messageState)
        window.requestAnimationFrame(gameLoop);
    else            
        resetGame();

}

function render() //clears screen and draws all elements in turn
{
    drawBackground();
    drawUi();
    drawMain();
}

function generateBackground()// draws background layer should only be called during screen transitions
{

    offScreenSurface.clearRect(0,0,5000,5000);
    for(let i =0; i<currentRoom.static.length; i++)
    {
        offScreenSurface.drawImage(tilesImage,tileList[currentRoom.static[i].tileNum].x,tileList[currentRoom.static[i].tileNum].y,
            tileList[currentRoom.static[i].tileNum].w,tileList[currentRoom.static[i].tileNum].h,
            currentRoom.static[i].x,currentRoom.static[i].y,
            tileList[currentRoom.static[i].tileNum].w*2,tileList[currentRoom.static[i].tileNum].h*2);
        /*if(tileList[currentRoom.static[i].tileNum].passable == -1)
            {
                offScreenSurface.fillStyle = 'green';
                offScreenSurface.fillRect(currentRoom.static[i].x,currentRoom.static[i].y,
                tileList[currentRoom.static[i].tileNum].w*2,tileList[currentRoom.static[i].tileNum].h*2);
            }//shows enemy blockers*/
    }
}

function drawMain() //draws all enemies player and interactive objects
{
    character.draw();
    for(let i = 0; i < currentRoom.active.length;i++)
        currentRoom.active[i].draw();
    for(let i = 0; i < character.projectiles.length;i++)
        character.projectiles[i].draw();
}

function drawUi() //draws hearts 
{
    for(let i=0;i<Math.floor(character.health/2);i++) //draws full hearts ui
        onScreenSurface.drawImage(heartImage,0,0,16,16,5+(35*i),5,32,32);
    if(character.health%2 === 1) // draws half hearts for ui
        onScreenSurface.drawImage(heartImage,0,15,16,16,5+(35*(Math.floor(character.health/2))),5,32,32);
    for(let i=0;i<Math.ceil((character.maxHealth-character.health)/2)-character.health%2;i++) // draws empty hearts for ui
        onScreenSurface.drawImage(heartImage,1,30,16,16,5+(35*(i+Math.ceil(character.health/2))),5,32,32);
    if(character.projectilePowerup || character.dashPowerup)
        for(let i=0;i<character.ammo;i++) //draws ammo ui
            onScreenSurface.drawImage(tilesImage,268,8,15,15,5+(35*i),42,30,30);
}

function drawBackground() // draws UI ontop of everything else currently showing debug info
{
	onScreenSurface.clearRect(0,0,600,600);
    onScreenSurface.drawImage(skyCanvas,Math.floor(camera.coordinates[0]/1.5),Math.floor(camera.coordinates[1]/1.5),600,600,0,0,600,600);
	onScreenSurface.drawImage(offScreenCanvas,Math.floor(camera.coordinates[0]),Math.floor(camera.coordinates[1]),600,600,0,0,600,600);
}

function userInputHandler() //accepts and applies player input
{
    if(keysPressed.includes(37))//left
        character.moveVector[0] -= 0.3;
    if(keysPressed.includes(39))//right
        character.moveVector[0] += 0.3;
    if(keysPressed.includes(38))//up
        character.jump();
    else
        character.jumpTap = true;
    if(keysPressed.includes(40) && character.ladder)//down
    {
        character.moveVector[1] += 2;
        character.ladderDir = 1;
    }
    if(keysPressed.includes(16))//shift
        character.dash();
    else
        character.dashTap = true;
    if(keysPressed.includes(90))//z
        character.shoot();
    else
        character.projectileTap = true;
}

function gameLogic() //updates all game functions and objects
{
    for(let i = 0; i < character.projectiles.length;i++)
        character.projectiles[i].tick();
    character.tick(); //ticks character
    for(let i = 0; i < currentRoom.active.length;i++)
        currentRoom.active[i].tick();
	camera.tick();
}

function generateRoomMap (goto) //called by floor map generator to generate each room
{
    switch(goto)
    {
        case 0:
            return level0();
            break;
        case 1:
            return level1();
            break;
        case 2:
            return level2();
            break;
        case 3:
            return level3();
            break;
        case 4:
            return level4();
            break; 
        case 5:
            return level5();
            break; 
        case 6:
            return level6();
            break;
    }
}

function roughCollision(x1,y1,w1,h1,x2,y2,w2,h2) //takes the x,y,width and height of 2 objects and checks for collision returns true or false
{
    return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2);
}

function fineCollision(x1,y1,w1,h1,x2,y2,w2,h2)//will use penetration testing to determine what vector to apply to character to move out of walls
{
    let b_collision = y2+h2-y1;
    let t_collision = y1+h1-y2;
    let l_collision = x1+w1-x2;
    let r_collision = x2+w2-x1;

    if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision && character.moveVector[1]>=0 )
    {
        character.grounded();        
        character.moveVector[1]  = 0;
        character.coordinates[1]  -= t_collision;
    }
    else if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision && character.moveVector[1]<=0)
    {
        character.moveVector[1]  = 0;
        character.coordinates[1]  += b_collision;
    }
    else if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision && character.moveVector[0]>=0)
    {
        character.coordinates[0]  -= l_collision;
        character.moveVector[0]  = 0;
    }
    else if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision && character.moveVector[0]<=0)
    {
        character.moveVector[0]  = 0;
        character.coordinates[0]  += r_collision;
    }
    character.crushed ++;
}

function resetGame() //retuns to main menu
{
    for(let i=0;i<levelPreventSpawn.length;i++)
        levelPreventSpawn[i] = false;
    DeathSFX.play();
    mainMenuBackground();
}

function nextLevel(goto,x,y) //loads specified level at specified coordinates also sets player spawn and zeroes movement also makes sure camera starts in bounds
{
    skySurface.clearRect(0,0,5000,5000);
    currentRoom = generateRoomMap(goto);
    character.coordinates[0] = x;
    character.coordinates[1] = y;
    character.respawnLocation[0] = character.coordinates[0];
    character.respawnLocation[1] = character.coordinates[1];
    character.moveVector[0] = 0;
    character.moveVector[1] = 0;
    camera.snap(character.coordinates[0]-300,character.coordinates[1]-300);
    generateBackground();
}

function createCamera() // camera object behaves diferently from all other objects has no draw method
{
	let obj = {};
	obj.coordinates = [0,0];
	obj.tick = function ()
	{
		if(character.coordinates[0]-this.coordinates[0] > 300 && this.coordinates[0] < currentRoom.maxCamera[0]-599)
			this.coordinates[0] += Math.ceil((character.coordinates[0]-this.coordinates[0]-300)/50);
		if(character.coordinates[0]-this.coordinates[0] < 300 && this.coordinates[0] > 1)
			this.coordinates[0] += Math.ceil((character.coordinates[0]-this.coordinates[0]-300)/50);		
		if(character.coordinates[1]-this.coordinates[1] > 300 && this.coordinates[1] < currentRoom.maxCamera[1]-599)
			this.coordinates[1] += Math.ceil((character.coordinates[1]-this.coordinates[1]-300)/50);
		if(character.coordinates[1]-this.coordinates[1] < 300 && this.coordinates[1] > 1)
			this.coordinates[1] += Math.ceil((character.coordinates[1]-this.coordinates[1]-300)/50);
	};
    obj.snap = function (x,y)
	{
        camera.coordinates[0] = x;
        camera.coordinates[1] = y;
        if(camera.coordinates[0]<0)
            camera.coordinates[0] = 1;
        if(camera.coordinates[0]>currentRoom.maxCamera[0]-600)
            camera.coordinates[0] = currentRoom.maxCamera[0]-600;
        if(camera.coordinates[1]<0)
            camera.coordinates[1] = 1;
        if(camera.coordinates[1]>currentRoom.maxCamera[1]-600)
            camera.coordinates[1] = currentRoom.maxCamera[1]-600;
	};

	return obj;
}

function messageSystem(message) //generates and displays message
{
    messageState = true;
    let lines = [];
    for(let i =0;i<=Math.ceil(message.length/25);i++)
        lines[i] = message.substring(i*25-25,i*25);
    waitTimer = 60;
    onScreenSurface.strokeStyle = 'white';
    onScreenSurface.lineJoin = "round";
    onScreenSurface.lineWidth = 20;
    onScreenSurface.strokeRect(206, 301-(lines.length*6), 236, (lines.length*12)-14);
    onScreenSurface.strokeStyle = 'black';
    onScreenSurface.fillStyle = 'black';
    onScreenSurface.strokeRect(208, 303-(lines.length*6), 232, (lines.length*12)-18);
    onScreenSurface.fillRect(208,303-(lines.length*6), 232, (lines.length*12)-18);
    onScreenSurface.fillStyle = 'white';
	onScreenSurface.font = "15px Courier New";
    for(let i = 0;i<lines.length;i++)
        onScreenSurface.fillText(lines[i],205, 300 -(lines.length*6)+(12*i));
}

function waitMessage() //pauses game till message is recived
{
    waitTimer--;
    if(waitTimer<-950)
        waitTimer = 0;
    if(keysPressed.includes(13) && waitTimer < 5)
    {
        messageState = false;
        waitTimer = 30;
    }
}