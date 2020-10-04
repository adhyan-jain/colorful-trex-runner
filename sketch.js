var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, ground1Image;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var time;

var sun, sunimage;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var highscore

localStorage["HighestScore"] = 0;

function preload(){
  
    trex_running = loadAnimation("trex1.png","trex2.png","trex3.png","trex4.png","trex5.png","trex6.png");

  trex_collided = loadAnimation("trex_collided.png");
  
  trex_jump = loadAnimation("trex1.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  dayimage = loadImage("dayimage.png");
  nightimage = loadImage("nightimage.jpg");
  sunimage = loadImage("sun.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameover.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  }

  function setup() {
  createCanvas(windowWidth, windowHeight);
    
  trex = createSprite(70,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.addAnimation("jumping",trex_jump);
  trex.scale = 0.8;
    
  sun = createSprite(width-50,50,40,40);
  sun.addImage(sunimage);
  sun.scale = 0.1;
    
  ground = createSprite(200,height+90,400,20);
  ground.addImage("ground",groundImage);
  ground.scale = 2;
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2-60);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.67;
  restart.scale = 0.7;
  
  invisibleGround = createSprite(200,height-20,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  score = 0;
  highscore = 0;
  time = 0;
  
  trex.setCollider("circle",15,0,50);
 }

 function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 35 === 0) {
  cloud = createSprite(width + 5,100,40,10);
  cloud.y = Math.round(random(height/5, height/2+100));
  cloud.addImage(cloudImage);
  cloud.scale = 0.9;
    
  //assign lifetime to the variable
  cloud.lifetime = 300;
    
  //adjust the depth
  cloud.depth = trex.depth;
  trex.depth = trex.depth + 1;
    
  //adding cloud to the group
  cloudsGroup.add(cloud);
  }
  }
 
 function draw() {
   
   if(score > 1000 && score < 2000 || score > 3000 && score < 4000 || score > 5000 && score < 6000 || score > 7000 && score < 8000){
  background(nightimage);
  
  sun.visible = false;
     
  //displaying score
  fill("white");
  textSize(20);
  text("Highest Score : " + highscore, 50,50);
  text("Score : "+ score,50 ,90);
  }
  
  if(score < 1000 && score > 0 || score < 3000 && score > 2000 || score < 4000 && score > 3000 || score < 5000 && score > 4000 || score < 7000 && score > 6000 || score < 8000 && score > 9000){
  background(dayimage);
  
  sun.visible = true;
     
  //displaying score
  fill("black");
  textSize(25);
  text("Highest Score : " + highscore, 50,50);
  text("Score : "+ score,50 ,90);
  }
  
  if(time < 500 && gameState === PLAY){
  
  fill("black");
  textSize(20);  
  text("Swipe to jump",width/2,height/5 + 50);
  }
   
  if(highscore <= score){
  
  highscore = score;
  }
  
  if(gameState === PLAY){
    
    time = time + 1;
    
    gameOver.visible = false;
    restart.visible = false;
    //scoring
    score = score +  Math.round((Math.round(World.frameRate/60))*0.5);
    
    //move the ground
   ground.velocityX = -(6 + 3*score/250);
   obstaclesGroup.setVelocityXEach(-(6 + 3*score/250));
   cloudsGroup.setVelocityXEach(-(6 + 3*score/250));
      
    trex.depth = ground.depth + 1;
    
    if (score % 100 === 0 && score > 0){
    
    checkPointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    console.log(trex.y);
    
  if(touches.length > 0 && trex.y > height- 67 || keyDown("space")  && trex.y > height- 67 ||  keyDown("UP_ARROW") && trex.y > height-67) {
    
    trex.velocityY = -15;
    jumpSound.play();
    touches = [];
    }
    
    if(trex.y > height - 85){
    
    trex.addAnimation("jumping",trex_jump);
    } else {
    
    trex.addAnimation("running", trex_running);
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.7;
  
 if(score < 1000 && score > 0 || score < 3000 && score > 2000 || score < 4000 && score > 3000 || score < 5000 && score > 4000 || score < 7000 && score > 6000 || score < 8000 && score > 9000){
    spawnClouds();
    }
    
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
     
    gameOver.visible = true;
    restart.visible = true;
     
    ground.velocityX = 0;
    trex.velocityY = 0
     
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
     
    restart.depth = gameOver.depth
    gameOver.depth = gameOver.depth + 1;
     
    ground.depth = ground.depth - 1; 
     
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     if(touches.length > 0 || keyDown("space") || keyDown("UP_ARROW") || mousePressedOver(restart)){
     reset();
     touches = [];
     } 
     }
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles(){
  
 if (frameCount % 80 == 0 && score < 1000 && score > 0){
   var obstacle = createSprite(width+10,height-60,10,40);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.8;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.8;
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 0.8;
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.scale = 0.68;
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.scale = 0.7;
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.scale = 0.65;
              break;
      default: break;
    }
   
    //assign lifetime to the obstacle
    obstacle.lifetime = 300;
  
    obstacle.depth = ground.depth + 1;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);  
 }
  
  if (frameCount % 50 == 0 && score < 2000 && score > 1000){
   var obstacles = createSprite(width+10,height-60,10,40);
   
   //generate random obstacles
    var rands = Math.round(random(1,6));
    switch(rands) {
      case 1: obstacles.addImage(obstacle1);
              obstacles.scale = 0.8;
              break;
      case 2: obstacles.addImage(obstacle2);
              obstacles.scale = 0.8;
              break;
      case 3: obstacles.addImage(obstacle3);
              obstacles.scale = 0.8;
              break;
      case 4: obstacles.addImage(obstacle4);
              obstacles.scale = 0.68;
              break;
      case 5: obstacles.addImage(obstacle5);
              obstacles.scale = 0.7;
              break;
      case 6: obstacles.addImage(obstacle6);
              obstacles.scale = 0.65;
              break;
      default: break;
    } 
   
    //assign lifetime to the obstacle
    obstacles.lifetime = 300;
   
    obstacles.depth = ground.depth + 1;
    
   //add each obstacle to the group
    obstaclesGroup.add(obstacles);  
 }
  
  if (frameCount % 30 == 0 && score > 2000){
   var obstacles1 = createSprite(width+10,height-60,10,40);
   
   //generate random obstacles
    var rands1 = Math.round(random(1,6));
    switch(rands1) {
      case 1: obstacles1.addImage(obstacle1);
              obstacles1.scale = 0.8;
              break;
      case 2: obstacles1.addImage(obstacle2);
              obstacles1.scale = 0.8;
              break;
      case 3: obstacles1.addImage(obstacle3);
              obstacles1.scale = 0.8;
              break;
      case 4: obstacles1.addImage(obstacle4);
              obstacles1.scale = 0.68;
              break;
      case 5: obstacles1.addImage(obstacle5);
              obstacles1.scale = 0.7;
              break;
      case 6: obstacles1.addImage(obstacle6);
              obstacles1.scale = 0.65;
              break;
      default: break;
    } 
   
    //assign lifetime to the obstacle
    obstacles1.lifetime = 300;
   
    obstacles1.depth = ground.depth + 1;
    
   //add each obstacle to the group
    obstaclesGroup.add(obstacles1);  
 }
 }

 function reset(){
 
 gameState = PLAY;
 trex.changeAnimation("running",trex_running);
 restart.visible = false;
 gameOver.visible = false;
 cloudsGroup.destroyEach();
 obstaclesGroup.destroyEach();
 score = 0;
 time = 0;
 }