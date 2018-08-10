// ************** BELOW THIS POINT ARE SETUP METHODS FOR GENERATING LEVELS ******************
function ground(obj,x,y,length)  //object reference , x,ytop left corner  ,    length of ground
{
    let height = Math.ceil((obj.maxCamera[1]-y)/32);
    platform(obj,x,y,length,13);
    for(let i =1;i<height;i++)
        platform(obj,x,y+(32*i),length,21);
}

function cave(obj,x,y,length,height)  //object reference , x,ytop left corner  ,    length of ground ,height of ground
{
    if(height>1)
    {
        platform(obj,x,y,length,43);
        for(let i =1;i<height-1;i++)
            platform(obj,x,y+(32*i),length,47);
        platform(obj,x,y+(32*(height-1)),length,51);
    }
    else
    {
        platform(obj,x,y,length,55);
    }
}

function enemyBlockers(obj, x, y, left, right) 
{
    obj.static.push(returnTile(x-left,y,35));
    obj.static.push(returnTile(x+right,y,35));
};

function fill(obj,x,y,length,height, id) //object reference , x,ytop left corner,  length castle ,height of castle
{
    for(let i =0;i<height;i++)
        platform(obj,x,y+(32*i),length,id);
}

function lava(obj,x,y,length) //object reference , x,ytop left corner,  length castle ,height of castle
{
    for(let i =0;i<length;i++)
            obj.static.push(returnTile(x+(i*32),y,59));
}

function castle(obj,x,y,length,height) //object reference , x,ytop left corner,  length castle ,height of castle
{
    for(let i =0;i<height;i++)
        platform(obj,x,y+(32*i),length,30);
}

function sky(obj)
{
    let num = Math.ceil(obj.maxCamera[0]/512);
    let num2 = Math.ceil(obj.maxCamera[1]/64);

    for(let i = 0;i<num;i++)
        skySurface.drawImage(tilesImage,tileList[0].x,tileList[0].y,tileList[0].w,tileList[0].h,512*i,0,tileList[0].w*2,tileList[0].h*2);
    for(let i = 0;i<Math.ceil(((num2-3)*num)/3);i++)
        skySurface.drawImage(tilesImage,tileList[1].x,tileList[1].y,tileList[1].w,tileList[1].h,(i%num)*512,64+(Math.floor(i/num)*64),tileList[1].w*2,tileList[1].h*2);
    for(let i = 0;i<num;i++)
        skySurface.drawImage(tilesImage,tileList[2].x,tileList[2].y,tileList[2].w,tileList[2].h,
            512*i,64+(Math.floor(Math.ceil(((num2-3)*num)/3)/num)*64),tileList[2].w*2,tileList[2].h*2);
    for(let i = 0;i<num;i++)
        skySurface.drawImage(tilesImage,tileList[3].x,tileList[3].y,tileList[3].w,tileList[3].h,
            512*i,128+(Math.floor(Math.ceil(((num2-3)*num)/3)/num)*64),tileList[3].w*2,tileList[3].h*2);
    for(let i = 0;i<num;i++)
        skySurface.drawImage(tilesImage,tileList[4].x,tileList[4].y,tileList[4].w,tileList[4].h,
            512*i,192+(Math.floor(Math.ceil(((num2-3)*num)/3)/num)*64),tileList[4].w*2,tileList[4].h*2);
    for(let i = 0;i<num;i++)
        skySurface.drawImage(tilesImage,tileList[5].x,tileList[5].y,tileList[5].w,tileList[5].h,
            512*i,256+(Math.floor(Math.ceil(((num2-3)*num)/3)/num)*64),tileList[5].w*2,tileList[5].h*2);
    for(let i = 0;i<Math.ceil(((num2-3)*num)/(3/2));i++)
        skySurface.drawImage(tilesImage,tileList[6].x,tileList[6].y,tileList[6].w,tileList[6].h,
            (i%num)*512,320+(Math.floor(Math.ceil(((num2-3)*num)/3)/num)*64)+(Math.floor(i/num)*52),tileList[6].w*2,tileList[6].h*2);
}

function caveBack(obj)
{
    let num = Math.ceil(obj.maxCamera[0]/1536);
    let num2 = Math.ceil(obj.maxCamera[1]/864);
    for(let i = 0;i<num2;i++)
        for(let i2 = 0;i2<num;i2++)
            skySurface.drawImage(caveImage,0,0,512,288,1536*i2,864*i,1536,864);
}

function castleBackLight(obj,x,y,w,h) //object reference , x,ytop left corner,  length castle background ,height of castle background
{ 
    y=(y+((h-1)*50)-(h*64))
    for(let i = 0;i<w;i++)
        for(let q = 0;q<h;q++)
            obj.static.push(returnTile(x+(i*64),y+(h*64)-(q*50),34));
}

function castleBackDark(obj,x,y,w,h) //object reference , x,ytop left corner,  length castle background ,height of castle background
{ 
    y=(y+((h-1)*50)-(h*64))
    for(let i = 0;i<w;i++)
        for(let q = 0;q<h;q++)
            obj.static.push(returnTile(x+(i*32),y+(h*64)-(q*50),37));
}

function castleBackHoles(obj,x,y,w,h) //object reference , x,ytop left corner,  length castle background ,height of castle background
{ 
    for(let i = 0;i<w;i++)
        for(let q = 0;q<h;q++)
        {
            if(q%2 == 0)
            {
                obj.static.push(returnTile(x+(i*256),y+(q*64),38));
                obj.static.push(returnTile(x+120+(i*256),y+(q*64),39));
            }
            else
            {
                obj.static.push(returnTile(x+(i*256),y+(q*64),39));
                obj.static.push(returnTile(x+136+(i*256),y+(q*64),38));
            }
        }
}

function levelBorders(obj) //applys blockers to left right and top of level and a death plane to the bottom
{
    for(let i = 0;i<Math.ceil(obj.maxCamera[1]/5000);i++)
        obj.static.push(returnTile(-20,0+(i*5000),10)); // left blocker
    for(let i = 0;i<Math.ceil(obj.maxCamera[1]/5000);i++)
        obj.static.push(returnTile(obj.maxCamera[0],0+(i*5000),10)); // right blocker
    for(let i = 0;i<Math.ceil(obj.maxCamera[0]/5000);i++)
        obj.static.push(returnTile(0+(i*5000),-20,11)); // top blocker
    for(let i = 0;i<Math.ceil(obj.maxCamera[0]/5000);i++)
        obj.static.push(returnTile(0+(i*5000),obj.maxCamera[1]+50,12)); // bottom death plane
}

function returnTile(x,y,tileNum)
{
    let obj = {};
    obj.x = x;
    obj.y = y;
    obj.tileNum = tileNum;
    return obj;
}

function tileInfo(x,y,w,h,passable)
{
    let obj = {};
    obj.x = x;
    obj.y = y;
    obj.w = w;
    obj.h = h;
    obj.passable = passable;
    return obj;
}

function tree(obj,x,y)
{
    obj.static.push(returnTile(x,y,7));
    obj.static.push(returnTile(x+32,y+96,8));
    obj.static.push(returnTile(x+20,y+126,9));
}

function platform(obj,x,y,length,type) //object reference , x,ytop left corner  ,   length of platform  , type of platform
{
    if (length > 1)
    {
        obj.static.push(returnTile(x,y,type));
        for(let i = 1;i<length-1;i++)
            obj.static.push(returnTile(x+(i*32),y,type+1));
        obj.static.push(returnTile(x+((length-1)*32),y,type+2));
    }
    else
        obj.static.push(returnTile(x,y,type+3));    
}

function ladder(obj,x,y,height,type)
{
    if(type == 1)
        for(let i = 0;i<height;i++)
        {
            obj.static.push(returnTile(x,y+(i*64),40)); //ladder visual
            obj.static.push(returnTile(x+16,y+16+(i*64),41)); //ladder climbable
        }
    if(type == 2)
        for(let i = 0;i<height;i++)
        {
            obj.static.push(returnTile(x,y+(i*32),42)); //ladder visual
            if(i%2 == 0)
                obj.static.push(returnTile(x+16,y+16+(i*32),41)); //ladder climbable
        }
}