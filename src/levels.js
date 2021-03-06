function setTileList() //really belongs in objects file but is here for refernece while building levels
{
    tileList.push(tileInfo(0,0,256,32,0)); //skyTop top 0
    tileList.push(tileInfo(0,32,256,32,0)); //skyTop mid 1
    tileList.push(tileInfo(0,64,256,32,0)); //skyTop bot 2
    tileList.push(tileInfo(0,96,256,32,0)); //skyMid top 3
    tileList.push(tileInfo(0,128,256,32,0)); //skyMid mid 4
    tileList.push(tileInfo(0,160,256,32,0)); //skyMid bot 5
    tileList.push(tileInfo(0,198,256,26,0)); //skyBot top 6
    tileList.push(tileInfo(96,656,48,48,0)); //treeTop 7
    tileList.push(tileInfo(192,656,16,24,0)); //treeTrunk 8
    tileList.push(tileInfo(186,656+24,32,24,0)); //treeBase 9
    tileList.push(tileInfo(-100,0,10,5000,1)); //verticalBlocker Wall 10
    tileList.push(tileInfo(0,-100,5000,10,1)); //horisontalBlocker Wall 11
    tileList.push(tileInfo(0,-100,5000,10,2)); //horisontalDeathPlane 12
    tileList.push(tileInfo(0,688,16,16,1)); //grassTop left 13
    tileList.push(tileInfo(16,688,16,16,1)); //grassTop Middle 14
    tileList.push(tileInfo(32,688,16,16,1)); //grassTop right 15
    tileList.push(tileInfo(48,688,16,16,1)); //grassTop single 16
    tileList.push(tileInfo(0,672,16,16,1)); //grassFloat left 17
    tileList.push(tileInfo(16,672,16,16,1)); //grassFloat Middle 18
    tileList.push(tileInfo(32,672,16,16,1)); //grassFloat right 19
    tileList.push(tileInfo(48,672,16,16,1)); //grassFloat single 20
    tileList.push(tileInfo(0,747,16,16,1)); //ground left 21
    tileList.push(tileInfo(16,747,16,16,2)); //ground Middle 22
    tileList.push(tileInfo(32,747,16,16,1)); //ground right 23
    tileList.push(tileInfo(48,747,16,16,1)); //ground single 24
    tileList.push(tileInfo(80,672,16,32,0)); //sunflower 25
    tileList.push(tileInfo(64,672,16,16,0)); //smallBlue flower 26
    tileList.push(tileInfo(64,688,16,16,0)); //smallpink flower27
    tileList.push(tileInfo(81,495,14,32,0)); //vines 28
    tileList.push(tileInfo(128,704,32,16,0)); //rocks 29
    tileList.push(tileInfo(0,592,16,16,1)); //castleMid left 30
    tileList.push(tileInfo(16,592,16,16,1)); //castleMid Middle 31
    tileList.push(tileInfo(32,592,16,16,1)); //castleMid right 32
    tileList.push(tileInfo(48,592,16,16,1)); //castleMid single 33
    tileList.push(tileInfo(64,624,32,32,0)); //castleBack light 34
    tileList.push(tileInfo(174,243,10,10,-1)); //enemy Blocker 35
    tileList.push(tileInfo(112,624,16,16,0)); //torch 36
    tileList.push(tileInfo(96,624,16,32,0)); //castleBack dark 37
    tileList.push(tileInfo(64,592,60,32,0)); //castleBack holes1 38
    tileList.push(tileInfo(124,592,68,32,0)); //castleBack holes2 39
    tileList.push(tileInfo(192,752,16,32,0)); //ladder visual 40
    tileList.push(tileInfo(174,243,1,10,3)); //ladder climbable 41
    tileList.push(tileInfo(193,736,16,16,0)); //rope visual 42
    tileList.push(tileInfo(0,1056,16,16,1)); //caveTop left 43
    tileList.push(tileInfo(16,1056,16,16,1)); //caveTop Middle 44
    tileList.push(tileInfo(32,1056,16,16,1)); //caveTop right 45
    tileList.push(tileInfo(48,1056,16,16,1)); //caveTop single 46
    tileList.push(tileInfo(0,1072,16,16,1)); //caveMid left 47
    tileList.push(tileInfo(16,1072,16,16,2)); //caveMid Middle 48
    tileList.push(tileInfo(32,1072,16,16,1)); //caveMid right 49
    tileList.push(tileInfo(48,1072,16,16,1)); //caveMid single 50
    tileList.push(tileInfo(0,1088,16,16,1)); //caveBot left 51
    tileList.push(tileInfo(16,1088,16,16,1)); //caveBot Middle 52
    tileList.push(tileInfo(32,1088,16,16,1)); //caveBot right 53
    tileList.push(tileInfo(48,1088,16,16,1)); //caveBot single 54
    tileList.push(tileInfo(0,1040,16,16,1)); //caveFloat left 55
    tileList.push(tileInfo(16,1040,16,16,1)); //caveFloat Middle 56
    tileList.push(tileInfo(32,1040,16,16,1)); //caveFloat right 57
    tileList.push(tileInfo(48,1040,16,16,1)); //caveFloat single 58
    tileList.push(tileInfo(64,992,16,32,4)); //Lava 59
}

levelPreventSpawn=[]

function level0()
{
    let obj = {};
    obj.static = [];
    obj.active = [];
    obj.maxCamera = [810,1000];
    
    sky(obj);
    levelBorders(obj);

    tree(obj,506,735);
    tree(obj,200,800);
    obj.static.push(returnTile(30,926,26)); //blue flower
    obj.static.push(returnTile(100,926,26)); //blue flower
    obj.static.push(returnTile(50,926,26)); //blue flower
    obj.static.push(returnTile(110,926,26)); //blue flower
    obj.static.push(returnTile(230,926,26)); //blue flower
    obj.static.push(returnTile(190,926,26)); //blue flower
    obj.static.push(returnTile(250,926,26)); //blue flower
    obj.static.push(returnTile(30,925,27)); //pink flower
    obj.static.push(returnTile(170,925,27)); //pink flower
    obj.static.push(returnTile(140,925,27)); //pink flower
    obj.static.push(returnTile(200,895,25)); //sunflower


    ground(obj,-10,958,11);
    platform(obj,0,690,4,17);
    ground(obj,525,894,2);
    platform(obj,630,850,6,17);
    ground(obj,730,958,4);
    platform(obj,220,550,11,17);
    platform(obj,620,480,7,17);

    
    obj.static.push(returnTile(200,530,35)); //enemy blocker
    obj.static.push(returnTile(573,530,35)); // enemy blocker


    obj.static.push(returnTile(15,700,28)); //vine
    obj.static.push(returnTile(70,700,28)); //vine
    obj.static.push(returnTile(230,550,28)); //vine
    obj.static.push(returnTile(380,550,28)); //vine
    obj.static.push(returnTile(430,550,28)); //vine
    obj.static.push(returnTile(500,550,28)); //vine
    obj.static.push(returnTile(650,480,28)); //vine
    obj.static.push(returnTile(780,480,28)); //vine


    if(!levelPreventSpawn[0])
        obj.active.push(shootPowerUp(45,660,0));
    
    obj.active.push(movingPlatform(380,800,2,17,380,950));
    obj.active.push(slime(380, 518));

    if(!levelPreventSpawn[1])
        obj.active.push(healthPickup(710,920,1));

    obj.active.push(door(800,750,10,100,1,10,805)); //door to level 1
    obj.active.push(door(800,875,10,100,1,10,915)); //door to level 1
    obj.active.push(door(800,380,10,100,1,10,430)); //door to level 1

    return obj;
}

function level1()
{
    let obj = {};
    obj.static = [];
    obj.active = [];
    obj.maxCamera = [2000,1000];
    
    sky(obj);
    levelBorders(obj);
    castleBackLight(obj,1650,429,7,2);
    castleBackHoles(obj,1650,173,2,4);
    castleBackDark(obj,1644,536,14,10);

    
    tree(obj,320,800);
    tree(obj,870,620);

    obj.static.push(returnTile(30,825,27)); //pink flower
    obj.static.push(returnTile(70,825,27)); //pink flower
    obj.static.push(returnTile(140,825,27)); //pink flower
    obj.static.push(returnTile(120,925,26)); //blue flower
    obj.static.push(returnTile(450,925,27)); //pink flower
    obj.static.push(returnTile(460,925,26)); //blue flower
    obj.static.push(returnTile(420,925,26)); //pink flower
    obj.static.push(returnTile(1000,753,29)); //rock
    obj.static.push(returnTile(1335,703,29)); //rock




    ground(obj,240,885,1);
    platform(obj,-10,850,6,17);
    ground(obj,-10,958,18);
    platform(obj,-10,480,4,17);
    ground(obj,800,785,10);
    ground(obj,1318,735,10);
    platform(obj,1000,405,5,17);
    platform(obj,590,415,11,17);
    castle(obj,1637,735,12,9);
    castle(obj,1637,170,2,15);
    castle(obj,1637,505,12,1);
    castle(obj,1860,330,5,1);
    castle(obj,1637,108,12,2);
    castle(obj,1637,44,2,2);
    castle(obj,1733,44,2,2);
    castle(obj,1829,44,2,2);
    castle(obj,1925,44,2,2);




    obj.static.push(returnTile(1050,405,28)); //vine
    obj.static.push(returnTile(1130,405,28)); //vine
    obj.static.push(returnTile(680,415,28)); //vine
    obj.static.push(returnTile(750,415,28)); //vine
    obj.static.push(returnTile(830,415,28)); //vine
    obj.static.push(returnTile(30,480,28)); //vine
    obj.static.push(returnTile(1765,600,36)); //torch
    obj.static.push(returnTile(1890,600,36)); //torch


    obj.active.push(movingPlatform(600,950,2,17,690,785));
    obj.active.push(movingPlatform(1468,700,2,17,1468,470));
    obj.active.push(movingPlatform(1701,330,3,30,1701,470));

    obj.active.push(fallingPlatform(1150,775,110,1));
    obj.active.push(fallingPlatform(1250,745,110,1));
    obj.active.push(fallingPlatform(1400,475,110,1));
    obj.active.push(fallingPlatform(1310,455,110,1));
    obj.active.push(fallingPlatform(1220,435,110,1));
    obj.active.push(fallingPlatform(180,465,110,1));
    obj.active.push(fallingPlatform(270,455,110,1));
    obj.active.push(fallingPlatform(360,445,110,1));
    obj.active.push(fallingPlatform(450,435,110,1));
    obj.active.push(fallingPlatform(540,425,110,1));

    
    obj.static.push(returnTile(570,225,35)); //enemy blocker
    obj.static.push(returnTile(945,225,35)); // enemy blocker

    obj.static.push(returnTile(780,765,35)); //enemy blocker
    obj.static.push(returnTile(1113,765,35)); // enemy blocker

    
    obj.active.push(bird(600,225));
    obj.active.push(slime(900,753));
    obj.active.push(rotatingFire(1828,330,8,55,10));

    if(!levelPreventSpawn[2])
        obj.active.push(breakable(70,862,2));
    if(!levelPreventSpawn[3])
        obj.active.push(breakable(1700,640,3));

    
    obj.active.push(door(0,750,10,100,0,770,805)); //door to level 0
    obj.active.push(door(0,875,10,100,0,770,915)); //door to level 0
    obj.active.push(door(0,380,10,100,0,770,430)); //door to level 0
    obj.active.push(door(1990,630,10,100,2,15,689)); //door to level 2
    obj.active.push(door(1990,405,10,100,2,15,458)); //door to level 2
    obj.active.push(door(1990,230,10,100,2,15,282)); //door to level 2
    return obj;
}

function level2() 
{
    let obj = {};
    obj.static = [];
    obj.active = [];
    obj.maxCamera = [1000, 1000];

    sky(obj);
    levelBorders(obj);
    castleBackLight(obj,0,429,17,2);
    castleBackHoles(obj,0,173,4,4);
    castleBackDark(obj,0,536,34,10);
    
    castle(obj,-10,735,5,9);
    castle(obj,-10,505,27,1);
    castle(obj,148,975,27,1);
    castle(obj,-10,330,5,1);
    castle(obj,300,537,1,8);
    castle(obj,300,794,10,1);
    castle(obj,786,700,1,10);
    castle(obj,400,700,16,1);
    castle(obj,978,330,1,18);
    castle(obj, 690, 330, 10, 1);
    castle(obj,-10,108,3,2);
    castle(obj, 85, 140, 8, 1);
    castle(obj, 10, 173, 32, 1);

    ladder(obj,148,778,3,1); //wood ladder
    ladder(obj,910,361,18,2); //climable rope
    ladder(obj,347,535,6,2); //climable rope
    obj.static.push(returnTile(194,600,36)); //torch
    obj.static.push(returnTile(80,600,36)); //torch
    obj.static.push(returnTile(230,850,36)); //torch
    obj.static.push(returnTile(350,850,36)); //torch
    obj.static.push(returnTile(470,850,36)); //torch
    obj.static.push(returnTile(745,750,36)); //torch
    obj.static.push(returnTile(450,600,36)); //torch
    obj.static.push(returnTile(590,600,36)); //torch
    obj.static.push(returnTile(730,600,36)); //torch
    obj.static.push(returnTile(850,850,36)); //torch



    obj.static.push(returnTile(130,950,35)); //enemy blocker
    obj.static.push(returnTile(786,950,35)); // enemy blocker
    obj.static.push(returnTile(312,768,35)); //enemy blocker
    obj.static.push(returnTile(618,768,35)); // enemy blocker

    obj.active.push(slime(160,943));
    obj.active.push(slime(640,943));
    obj.active.push(slime(400,763));
    
    obj.static.push(returnTile(840,360,35)); //enemy blocker
    obj.static.push(returnTile(240,360,35)); // enemy blocker

    obj.active.push(bird(600,378));

    obj.active.push(movingPlatform(650,915,3,30,650,794));
    obj.active.push(rotatingFire(300,604,10,220,-8));
    obj.active.push(rotatingFire(786-256,508,6,134,7));
    obj.active.push(rotatingFire(418,173,8,145,-9));
    obj.active.push(rotatingFire(786,754,8,65,12));

    for(let i = 0;i<14;i++)
        obj.active.push(fallingPlatform(170+(i*32),330,30,2));

    if(!levelPreventSpawn[4])
        obj.active.push(breakable(973,880,4));
    if(!levelPreventSpawn[5])
        obj.active.push(healthPickup(120,300,5));


    obj.active.push(door(0,630,10,100,1,1954,689)); //door to level 1
    obj.active.push(door(0,405,10,100,1,1954,455)); //door to level 1
    obj.active.push(door(0, 230, 10, 100, 1, 1954, 282)); //door to level 1
    obj.active.push(door(990, 230, 10, 100, 3, 100, 912)); //door to level 3
    obj.active.push(door(990, 890, 10, 100, 5, 20, 154)); //door to level 5
    return obj;
}

function level3() {
    let obj = {};
    obj.static = [];
    obj.active = [];
    obj.maxCamera = [1000, 1700];

    sky(obj);
    levelBorders(obj);

    castleBackLight(obj, -30, 670, 4, 10);
    castleBackHoles(obj, -30, 40, 1, 10);
    castleBackDark(obj, 220, 500, 10, 10)
    castleBackHoles(obj, 200, 390, 2, 2);

    tree(obj, 940, 620);
    tree(obj, 600, 180);

    castleBackDark(obj, -3, 1450, 18, 3);
    platform(obj, 0, 958, 18, 13);
    fill(obj, -3, 990, 18, 15, 21);
    cave(obj, -3, 1450, 18, 1);
    cave(obj, -3, 1568, 18, 1);
    fill(obj, -3, 1600, 18, 4, 21);
    
    ground(obj, 900, 785, 10);

    castle(obj, 20, 958, 7, 5);
    castle(obj, 20, 40, 7, 2);
    castle(obj, 64, 200, 4, 2);
    castle(obj, 64, 400, 4, 2);
    castle(obj, 64, 600, 4, 2);
    castle(obj, 64, 800, 4, 2);

    ladder(obj,272,500,2,1);
    ladder(obj,496,820,2,1);
    ladder(obj,272,700,2,1);
    ladder(obj,496,600,2,1);
    castle(obj, 310, 500, 9, 1);
    castle(obj, 256, 832, 7, 1);
    castle(obj, 310, 732, 7, 1);
    castle(obj, 256, 628, 7, 1);
    
    castle(obj, 0, 0, 2, 32);
    castle(obj, 192, 0, 2, 27);
    castle(obj, 532, 500, 4, 17);
    castle(obj, 660, 500, 2, 1);
    castle(obj, 692, 372, 1, 4);
    castle(obj, 468, 372, 1, 2);
    castle(obj, 500, 372, 6, 1);
    castle(obj, 532, 1040, 3, 1);
    castle(obj, 532, 1072, 2, 1);

    obj.active.push(rotatingFire(380,732,6,270,8));

    obj.active.push(rotatingFire(350,500,5,120,12));
    obj.active.push(rotatingFire(350,500,5,240,12));
    obj.active.push(rotatingFire(350,500,5,360,12));

    castle(obj, 0, 960, 17, 5);

    platform(obj, 468, 350, 8, 17);
    if(!levelPreventSpawn[7])
        obj.active.push(doubleJumpPowerUp(564,470,7));

     if(!levelPreventSpawn[6])
        obj.active.push(healthPickup(380,596,6));

     obj.static.push(returnTile(320,580,36));
     obj.static.push(returnTile(320,780,36));
     obj.static.push(returnTile(450,680,36));
     obj.static.push(returnTile(450,880,36));
    obj.static.push(returnTile(520, 375, 28)); //vine
    obj.static.push(returnTile(600, 365, 28)); //vine
    obj.static.push(returnTile(650, 370, 28)); //vine
    obj.static.push(returnTile(472, 420, 28)); //vine
    obj.static.push(returnTile(30, 800, 28)); //vine
    obj.static.push(returnTile(10, 600, 28)); //vine
    obj.static.push(returnTile(20, 200, 28));
    obj.static.push(returnTile(200, 400, 28));
    obj.static.push(returnTile(140, 870, 36));

    enemyBlockers(obj, 800, 520, 140, 180);
    obj.active.push(bird(800,520));
    enemyBlockers(obj, 750, 1200, 150, 150);
    obj.active.push(bird(750,1200));
    enemyBlockers(obj, 750, 1500, 150, 150);
    obj.active.push(bird(750,1500));

    obj.active.push(movingPlatform(660, 600, 2, 17, 900, 600));

    obj.active.push(movingPlatform(720, 500, 2, 17, 950, 500));
    obj.active.push(movingPlatform(800, 700, 2, 17, 660, 700));

    obj.active.push(movingPlatform(720, 1185, 1, 17, 800, 785));
    obj.active.push(movingPlatform(800, 785, 1, 17, 660, 1185));
    obj.active.push(movingPlatform(660, 785, 1, 17, 800, 1185));
    obj.active.push(movingPlatform(800, 1185, 1, 17, 660, 785));

    obj.active.push(movingPlatform(660, 1240, 2, 17, 800, 1240));
    obj.active.push(movingPlatform(800, 1340, 2, 17, 660, 1340));
    obj.active.push(movingPlatform(680, 1440, 2, 17, 780, 1440));
    obj.active.push(movingPlatform(740, 1540, 2, 17, 700, 1540));
    obj.active.push(movingPlatform(680, 1640, 2, 17, 720, 1640));

    if (!levelPreventSpawn[8])
        obj.active.push(breakable(200, 862, 8));
    if (!levelPreventSpawn[9])
        obj.active.push(breakable(541, 1475, 9));
    if (!levelPreventSpawn[13])
        obj.active.push(fullHealthPickup(250,1530, 13));


     obj.active.push(door(60, 870, 10, 100, 2, 930, 280));//to level 2
    obj.active.push(door(0, 1480, 10, 100, 4, 960, 154)); //door to level 4
    return obj;
}

function level4() {
    let obj = {};
    obj.static = [];
    obj.active = [];
    obj.maxCamera = [1000, 1000];

    caveBack(obj);
    levelBorders(obj);

    cave(obj,-10,0,32,1);
    cave(obj,900,200,5,1);
    cave(obj,200,800,20,6);
    cave(obj,902,400,1,1);
    ladder(obj,902,432,14,2);
    cave(obj,77,400,1,1);
    ladder(obj,77,432,14,2);
    lava(obj,-10,980,32);
    for(let i =0 ;i<6;i++)
            obj.active.push(fallingPlatform(150+(i*140),510,60,3));
    obj.static.push(returnTile(835,770,35)); //enemy blocker
    obj.static.push(returnTile(177,770,35)); // enemy blocker

    obj.active.push(boss(125,448));
    messageSystem("        FINAL FIGHT             NO GOING BACK");//BOSS FIGHT
    obj.active.push(door(995, 60, 10, 100, 3, 15, 1522)); //door to level 4
    return obj;
}

function level5() {
    let obj = {};
    obj.static = [];
    obj.active = [];
    obj.maxCamera = [800, 800];

    caveBack(obj);
    levelBorders(obj);
    
    cave(obj, 556,-12,10,3);
    cave(obj, -10,200,5,2);
    castle(obj,-10,-12,18,3);
    cave(obj, -10,200,1,30);
    cave(obj, 380,200,4,1);
    cave(obj, 16,530,7,2);
    lava(obj,21,770,25);
    cave(obj, 16,530,7,2);
    cave(obj,690,650,5,7);
    ladder(obj,151,205,5,1);
    ladder(obj,769,400,4,1);
    ladder(obj,520,80,7,2);

    obj.active.push(movingPlatform(700,400,2,55,450,400));
    obj.active.push(rotatingFire(550,368,4,45,6));

    if (!levelPreventSpawn[10])
        obj.active.push(healthPickup(77, 700, 10));
    if (!levelPreventSpawn[11])
        obj.active.push(healthPickup(140, 495, 11));
    if (!levelPreventSpawn[12])
        obj.active.push(dashPowerUp(430, 160, 12));

    cave(obj, 190,710,4,1);

    obj.active.push(fallingPlatform(77,730,60,3));
    obj.active.push(fallingPlatform(330,690,60,3));
    obj.active.push(rotatingFire(420,690,4,120,-12));
    obj.active.push(fallingPlatform(510,710,60,3));
    obj.active.push(rotatingFire(600,690,4,240,12));
    obj.active.push(jumpingFire(400,770,5,10));
    obj.active.push(jumpingFire(127,770,3,6));
    obj.active.push(jumpingFire(644,770,8,12));

    obj.active.push(door(0, 90, 10, 100, 2, 958, 929)); //door to level 2
    return obj;
}