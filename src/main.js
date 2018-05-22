//test//test
var mainStage = document.getElementById("mainStage");
var drawingSurface = mainStage.getContext("2d");

var fillRectX = 0;
var fillRectY = 0;

var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;
var SPACE = 32;


var moveUp = false;
var moveDown = false;
var moveRight = false;
var moveLeft = false;
var spaceBar = false;


//Sample 2D map array system
var mapArray = [
    [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [7,0,0,0,0,2,0,2,0,2,0,2,0,2,0,2,0,0,0,0],
    [2,2,2,2,0,2,2,2,0,2,0,2,2,2,2,2,0,0,0,0],
    [2,2,2,2,0,2,2,2,0,2,0,0,0,0,0,2,0,0,0,0],
    [2,2,2,2,0,2,2,0,0,0,2,2,2,2,0,2,0,0,0,0],
    [2,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],
    [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2]
];

//map code
var EMPTY = 0;
var CEILING = 1;
var FLOOR = 2;
var DESTROY_WALL = 3;
var ITEM = 4;
var PLATFORM = 5;
var NOTIFICATION = 6;
var ENTRANCE = 7;
var EXIT = 8;

//size of each cell
var SIZE = 50;

//number of rows and columns
var ROWS = mapArray.length;
var COLUMNS = mapArray[0].length;

//number of columns on map sprite sheet
var mapSpriteSheetColumns = 8;

//arrays to store game objects
var sprites = [];

var assetsToLoad = [];
var assetsLoaded = 0;

//loading the map sprite sheet image
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "img/mapSpriteSheet.png";
assetsToLoad.push(image);

//game variables

//sprite object
var spriteObject =
    {
        sourceX: 0,
        sourceY: 0,
        sourceWidth: 50,
        sourceHeight: 50,
        width: 50,
        height: 50,
        x: 0,
        y: 0,
        visible: true
    };

//Game States
var LOADING = 0;
var BUILD_MAP = 1;
var PLAYING = 2;
var OVER = 3;
var gameState = LOADING;

//Key down event listener to see if player presses key
window.addEventListener("keydown", onKeyDown, false);

function onKeyDown(event) {

    switch (event.keyCode) {
        case UP:
            moveUp = true;
            break;
        case DOWN:
            moveDown = true;
            break;
        case LEFT:
            moveLeft = true;
            break;
        case RIGHT:
            moveRight = true;
            break;
        case SPACE:
            spaceBar = true;
            break;
    }
}

//event listener checking if the player has stopped pressing the key
window.addEventListener("keyup", onKeyUp, false);

function onKeyUp(event) {
    switch (event.keyCode) {
        case UP:
            moveUp = false;
            break;
        case DOWN:
            moveDown = false;
            break;
        case LEFT:
            moveLeft = false;
            break;
        case RIGHT:
            moveRight = false;
            break;
        case SPACE:
            spaceBar = false;
            break;

    }
}


//drawing rectangle shape as placeholder for game sprite
function drawRect()
{
    drawingSurface.fillStyle = "red";
    drawingSurface.fillRect(fillRectX,fillRectY,60,60);
}


//rendering the shape
function renderRect()
{
    drawRect();
}

//function to move the Rectangle shape
function moveRect()
{
    if (moveLeft && fillRectX > 0)
    {
        fillRectX -=5;
    }
    if (moveRight && fillRectX < mainStage.width - 60)
    {
        fillRectX+=5;
    }
    if (moveUp && fillRectY > 0)
    {
        fillRectY -=5;
    }
    if (moveDown && fillRectY < mainStage.height - 60 )
    {
        fillRectY+=5;
    }
}

update();

function update()
{
    //animation loop
    requestAnimationFrame(update);

    //switching the game state
    //Change what the game is doing based on the game state
    switch(gameState)
    {
        case LOADING:
            console.log("loading...");
            break;

        case BUILD_MAP:
            buildMap(mapArray);
            //createOtherObjects();
            gameState = PLAYING;
            break;

        case PLAYING:
            moveRect();
            break;

        case OVER:
            endGame();
            break;
    }
    //Render the game
    render();
}

function loadHandler()
{
    assetsLoaded++;
    if(assetsLoaded === assetsToLoad.length)
    {
        //Remove the load handlers
        image.removeEventListener("load", loadHandler, false);

        //Build the map
        gameState = BUILD_MAP;
    }
}


function buildMap(levelMap) {
    for (var row = 0; row < ROWS; row++) {
        for (var column = 0; column < COLUMNS; column++) {
            var currentTile = levelMap[row][column];
            if (currentTile !== EMPTY) {
                //Find the tile's X and Y positions on the tilesheet
                var mapSpriteSheetX = Math.floor((currentTile -1) % mapSpriteSheetColumns) *SIZE;
                var mapSpriteSheetY = Math.floor((currentTile - 1) /mapSpriteSheetColumns) *SIZE;
                switch (currentTile) {
                    case CEILING: //number 1
                        var ceiling = Object.create(spriteObject);
                        ceiling.sourceX = mapSpriteSheetX;
                        ceiling.sourceY = mapSpriteSheetY;
                        ceiling.x = column * SIZE;
                        ceiling.y = row * SIZE;
                        sprites.push(ceiling);
                        break;

                    case FLOOR: //number 2
                        var floor = Object.create(spriteObject);
                        floor.sourceX = mapSpriteSheetX;
                        floor.sourceY = mapSpriteSheetY;
                        floor.x = column * SIZE;
                        floor.y = row * SIZE;
                        sprites.push(floor);
                        break;

                    case DESTROY_WALL: //number 3
                        var wall = Object.create(spriteObject);
                        wall.sourceX = mapSpriteSheetX;
                        wall.sourceY = mapSpriteSheetY;
                        wall.x = column * SIZE;
                        wall.y = row * SIZE;
                        sprites.push(wall);
                        break;

                    case ITEM: //number 4
                        var item = Object.create(spriteObject);
                        item.sourceX = mapSpriteSheetX;
                        item.sourceY = mapSpriteSheetY;
                        item.x = column * SIZE;
                        item.y = row * SIZE;
                        sprites.push(item);
                        break;
                    case PLATFORM: //map code number 5
                        var platform = Object.create(spriteObject);
                        platform.sourceX = mapSpriteSheetX;
                        platform.sourceY = mapSpriteSheetY;
                        platform.x = column * SIZE;
                        platform.y = row * SIZE;
                        sprites.push(platform);
                        break;
                    case NOTIFICATION: //map code number 6
                        var notification = Object.create(spriteObject);
                        notification.sourceX = mapSpriteSheetX;
                        notification.sourceY = mapSpriteSheetY;
                        notification.x = column * SIZE;
                        notification.y = row * SIZE;
                        sprites.push(notification);
                        break;
                    case ENTRANCE: //map code number 7
                        var entrance = Object.create(spriteObject);
                        entrance.sourceX = mapSpriteSheetX;
                        entrance.sourceY = mapSpriteSheetY;
                        entrance.x = column * SIZE;
                        entrance.y = row * SIZE;
                        sprites.push(entrance);
                        break;
                    case EXIT: //map code number 8
                        var exit = Object.create(spriteObject);
                        exit.sourceX = mapSpriteSheetX;
                        exit.sourceY = mapSpriteSheetY;
                        exit.x = column * SIZE;
                        exit.y = row * SIZE;
                        sprites.push(exit);
                        break;
                }
            }
        }
    }
}

function render() {
    drawingSurface.clearRect(0, 0, mainStage.width, mainStage.height);


    //Display the sprites
    if (sprites.length !== 0) {
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite.visible) {
                drawingSurface.drawImage
                (
                    image,
                    sprite.sourceX, sprite.sourceY,
                    sprite.sourceWidth, sprite.sourceHeight,
                    Math.floor(sprite.x), Math.floor(sprite.y),
                    sprite.width, sprite.height
                );
            }
        }
    }
    renderRect();
}

function endGame()
{
    console.log("game over");
}