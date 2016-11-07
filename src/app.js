"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Vector = require('./vector');
const Camera = require('./camera');
const Player = require('./player');
const BulletPool = require('./bullet_pool');
const MissilePool = require('./missile_pool');
const FlappyMonster = require('./flappy-monster');
const Skull = require('./skull');
const FlappyDragon = require('./flappy-dragon');
const FlappyGrumpy = require('./flappy-grumpy');
const FlappyBird = require('./flappy-bird');
const Powerup = require('./powerup');

/* Global variables */
var canvas = document.getElementById('screen');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var camera = new Camera(canvas);
var bullets = new BulletPool(20);
var missiles = new MissilePool(10);
var player;

/* Enemies */
var flappyMonsters = [];
var skulls = [];
var flappyDragons = [];
var flappyGrumpys = [];
var flappyBirds = [];

/* Images to preload */
var playerImg = [];
var flappyBirdImg = [];
var flappyMonsterImg = [];
var skullImg = [];
var flappyDragonImg = [];
var flappyGrumpyImg = [];

/* Projectiles */
var shoot = false;
var missileShoot = false;

/* Other */
var powerUps = [];
var score = 0;
var backgrounds = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image()
];
var level = 1;
var enemiesKilled = 0;
var gameOver = false;

/* 
  This variable is used as a temporary fix enemies mysteriously getting 
  hit by bullets or missiles that dont actually exist
*/
var initiatedBullet = false;
var initiatedMissile = false; 

/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
      event.preventDefault();
      break;
    // case "ArrowLeft":
    // case "a":
    //   input.left = true;
    //   event.preventDefault();
    //   break;
    // case "ArrowRight":
    // case "d":
    //   input.right = true;
    //   event.preventDefault();
    //   break;
    /* Shoot a projectile if space is selected */
    case ' ':
      if(player.weapon == "weapon-1" || player.weapon == "weapon-2")
      {
        if(!shoot)
        {
          shoot = true;
          console.log("Pew pew!");
          var audio = new Audio('assets/sounds/player_shoot.wav'); // Created with http://www.bfxr.net/
          audio.play();
          player.fireBullet({x: 1, y: 0});
          initiatedBullet = true;
          break;
        }
      }
      else if(player.weapon == "weapon-3" || player.weapon == "weapon-4") 
      {
        if(!missileShoot)
        {
          missileShoot = true;
          console.log("BOOM");
          //var audio = new Audio('assets/sounds/player_shoot.wav'); // Created with http://www.bfxr.net/
          //audio.play();
          player.fireMissile({x: 1, y: 0});
          initiatedMissile = true;
          break;
        }
      }        
  }
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
      event.preventDefault();
      break;
    // case "ArrowLeft":
    // case "a":
    //   input.left = false;
    //   event.preventDefault();
    //   break;
    // case "ArrowRight":
    // case "d":
    //   input.right = false;
    //   event.preventDefault();
    //   break;
    case ' ':
      shoot = false;
      missileShoot = false;
      break;
  }
}

/**
 * @function init
 * Initializes the game
 * Loads all animation images BEFORE animation to avoid flickering
 */
function init()
{
  if(level == 1)
  {
    /*
    All images are public domain and from opengameart.org
    */

    // Load the background images
    backgrounds[0].src = 'assets/backgrounds/city-foreground-extended.png';
    backgrounds[1].src = 'assets/backgrounds/city-background-extended.png';
    backgrounds[2].src = 'assets/backgrounds/city-sky.png';

    // Level 2 background
    // Used with permission from Ilcho Bogdanovski
    // http://www.makesimpledesigns.com/free-parallax-background-game-graphics-vol1/
    backgrounds[3].src = 'assets/backgrounds/level2-sky-extended.png';
    backgrounds[4].src = 'assets/backgrounds/level2-background-extended.png';
    backgrounds[5].src = 'assets/backgrounds/Front-Layer-1.png';

    // Level 3 Background
    backgrounds[6].src = 'assets/backgrounds/graveyard-background-extended.png';
    backgrounds[7].src = 'assets/backgrounds/layer-2.png';


    // Load the player (cat) images
    playerImg[0] = new Image();
    playerImg[1] = new Image();
    playerImg[2] = new Image();
    playerImg[3] = new Image();
    playerImg[4] = new Image();
    playerImg[5] = new Image();
    playerImg[6] = new Image();
    playerImg[7] = new Image();
    playerImg[8] = new Image();
    playerImg[9] = new Image();
    playerImg[0].src = 'assets/enemies/flappy-cat/flying/frame-1.png';
    playerImg[1].src = 'assets/enemies/flappy-cat/flying/frame-2.png';
    playerImg[2].src = 'assets/enemies/flappy-cat/flying/frame-3.png';
    playerImg[3].src = 'assets/enemies/flappy-cat/flying/frame-4.png';
    playerImg[4].src = 'assets/enemies/flappy-cat/flying/frame-5.png';
    playerImg[5].src = 'assets/enemies/flappy-cat/flying/frame-6.png';
    playerImg[6].src = 'assets/enemies/flappy-cat/flying/frame-7.png';
    playerImg[7].src = 'assets/enemies/flappy-cat/flying/frame-8.png';
    playerImg[8].src = 'assets/enemies/flappy-cat/hit/frame-2.png';
    playerImg[9].src = 'assets/enemies/flappy-cat/hit/frame-1.png';

    // Load the flappy monster images
    flappyMonsterImg[0] = new Image();
    flappyMonsterImg[1] = new Image();
    flappyMonsterImg[2] = new Image();
    flappyMonsterImg[3] = new Image();
    flappyMonsterImg[4] = new Image();
    flappyMonsterImg[5] = new Image();
    flappyMonsterImg[6] = new Image();
    flappyMonsterImg[7] = new Image();
    flappyMonsterImg[0].src = 'assets/enemies/flappy-monster/frame-1.png';
    flappyMonsterImg[1].src = 'assets/enemies/flappy-monster/frame-2.png';
    flappyMonsterImg[2].src = 'assets/enemies/flappy-monster/frame-3.png';
    flappyMonsterImg[3].src = 'assets/enemies/flappy-monster/frame-4.png';
    flappyMonsterImg[4].src = 'assets/enemies/flappy-monster/frame-5.png';
    flappyMonsterImg[5].src = 'assets/enemies/flappy-monster/frame-6.png';
    flappyMonsterImg[6].src = 'assets/enemies/flappy-monster/frame-7.png';
    flappyMonsterImg[7].src = 'assets/enemies/flappy-monster/frame-8.png';

    // Load the flappy bird images
    flappyBirdImg[0] = new Image();
    flappyBirdImg[1] = new Image();
    flappyBirdImg[2] = new Image();
    flappyBirdImg[3] = new Image();
    flappyBirdImg[4] = new Image();
    flappyBirdImg[5] = new Image();
    flappyBirdImg[0].src = 'assets/enemies/flappy-bird/flying/frame-1.png';
    flappyBirdImg[1].src = 'assets/enemies/flappy-bird/flying/frame-2.png';
    flappyBirdImg[2].src = 'assets/enemies/flappy-bird/flying/frame-3.png';
    flappyBirdImg[3].src = 'assets/enemies/flappy-bird/flying/frame-4.png';
    flappyBirdImg[4].src = 'assets/enemies/flappy-bird/hit/frame-1.png';
    flappyBirdImg[5].src = 'assets/enemies/flappy-bird/hit/frame-2.png';

    // Load the skull images
    skullImg[0] = new Image();
    skullImg[1] = new Image();
    skullImg[2] = new Image();
    skullImg[0].src = 'assets/enemies/skull/idle/frame-1.png';
    skullImg[1].src = 'assets/enemies/skull/idle/frame-2.png';
    skullImg[2].src = 'assets/enemies/skull/hit/frame.png';

    // Load the flappy dragon images
    flappyDragonImg[0] = new Image();
    flappyDragonImg[1] = new Image();
    flappyDragonImg[2] = new Image();
    flappyDragonImg[3] = new Image();
    flappyDragonImg[0].src = 'assets/enemies/flappy-dragon/frame-1.png';
    flappyDragonImg[1].src = 'assets/enemies/flappy-dragon/frame-2.png';
    flappyDragonImg[2].src = 'assets/enemies/flappy-dragon/frame-3.png';
    flappyDragonImg[3].src = 'assets/enemies/flappy-dragon/frame-4.png';

    // Load the flappy grumpy images
    flappyGrumpyImg[0] = new Image();
    flappyGrumpyImg[1] = new Image();
    flappyGrumpyImg[2] = new Image();
    flappyGrumpyImg[3] = new Image();
    flappyGrumpyImg[4] = new Image();
    flappyGrumpyImg[5] = new Image();
    flappyGrumpyImg[6] = new Image();
    flappyGrumpyImg[7] = new Image();
    flappyGrumpyImg[0].src = 'assets/enemies/flappy-grumpy/frame-1.png';
    flappyGrumpyImg[1].src = 'assets/enemies/flappy-grumpy/frame-2.png';
    flappyGrumpyImg[2].src = 'assets/enemies/flappy-grumpy/frame-3.png';
    flappyGrumpyImg[3].src = 'assets/enemies/flappy-grumpy/frame-4.png';
    flappyGrumpyImg[4].src = 'assets/enemies/flappy-grumpy/frame-5.png';
    flappyGrumpyImg[5].src = 'assets/enemies/flappy-grumpy/frame-6.png';
    flappyGrumpyImg[6].src = 'assets/enemies/flappy-grumpy/frame-7.png';
    flappyGrumpyImg[7].src = 'assets/enemies/flappy-grumpy/frame-8.png';

    player = new Player(bullets, missiles, "weapon-1", playerImg);

    for(var i = 0; i < 20; i++)
    {
      var randomSkullX = Math.floor(Math.random() * 5000) + 0;
      var randomSkullY = Math.floor(Math.random() * 1000) + 1;
      skulls.push(new Skull(randomSkullX, randomSkullY, canvas, skullImg));
    }

    for(var i = 0; i < 15; i++)
    {
      var randomGrumpyX = Math.floor(Math.random() * 10000) + 0;
      var randomGrumpyY = Math.floor(Math.random() * 700) + 1;
      flappyGrumpys.push(new FlappyGrumpy(randomGrumpyX, randomGrumpyY, flappyGrumpyImg));
    }

  }
  else if(level == 2)
  {
    player = new Player(bullets, missiles, "weapon-1", playerImg);
    camera = new Camera(canvas);
    reinitializeEnemies();
    player.lives = 5;

    for(var i = 0; i < 30; i++)
    {
      var randomMonsterX = Math.floor(Math.random() * 5000) + 0;
      var randomMonsterY = Math.floor(Math.random() * 700) + 1;
      flappyMonsters.push(new FlappyMonster(randomMonsterX, randomMonsterY, flappyMonsterImg));
    }

    for(var i = 0; i < 50; i++)
    {
      var randomDragonX = Math.floor(Math.random() * 27000) + 1000;
      var randomDragonY = Math.floor(Math.random() * 700) + 1;
      flappyDragons.push(new FlappyDragon(randomDragonX, randomDragonY, flappyDragonImg));
    }
  }
  else if(level == 3)
  {
    player = new Player(bullets, missiles, "weapon-1", playerImg);
    camera = new Camera(canvas);
    reinitializeEnemies();
    player.lives = 5;
    bullets.color = "black";

    for(var i = 0; i < 15; i++)
    {
      var randomMonsterX = Math.floor(Math.random() * 5000) + 100;
      var randomMonsterY = Math.floor(Math.random() * 700) + 1;
      flappyMonsters.push(new FlappyMonster(randomMonsterX, randomMonsterY, flappyMonsterImg));
    }

    for(var i = 0; i < 30; i++)
    {
      var randomDragonX = Math.floor(Math.random() * 27000) + 5000;
      var randomDragonY = Math.floor(Math.random() * 700) + 1;
      flappyDragons.push(new FlappyDragon(randomDragonX, randomDragonY, flappyDragonImg));
    }

    for(var i = 0; i < 10; i++)
    {
      var randomSkullX = Math.floor(Math.random() * 10000) + 200;
      var randomSkullY = Math.floor(Math.random() * 1000) + 1;
      skulls.push(new Skull(randomSkullX, randomSkullY, canvas, skullImg));
    }

    for(var i = 0; i < 10; i++)
    {
      var randomGrumpyX = Math.floor(Math.random() * 20000) + 200;
      var randomGrumpyY = Math.floor(Math.random() * 700) + 1;
      flappyGrumpys.push(new FlappyGrumpy(randomGrumpyX, randomGrumpyY, flappyGrumpyImg));
    }

    flappyBirds.push(new FlappyBird(8000, 0, canvas, flappyBirdImg));
    flappyBirds.push(new FlappyBird(8000, 400, canvas, flappyBirdImg));
    flappyBirds.push(new FlappyBird(9000, 400, canvas, flappyBirdImg));
  }

  powerUps.push(new Powerup(50,50));
  powerUps.push(new Powerup(1000,50));
  powerUps.push(new Powerup(2000,50));
  powerUps.push(new Powerup(3000,50));
  powerUps.push(new Powerup(4000,50));

  
}
init();
level = 2;
init();
level = 3;
init();

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  // update the player
  player.update(elapsedTime, input);

  // update the camera
  camera.update(player);

  // Check if reached level 2
  if(player.position.x > 5000 && level == 1)
  {
    console.log("Level 2 reached");
    level = 2;
    init();
  }
  // Check if reached level 3
  else if(camera.position.x > 10000 && level == 2)
  {
    console.log("Level 2 reached");
    level = 3;
    init();
  }
  // Check if game win
  else if(camera.position.x > 10000 && level == 3)
  {
    console.log("YOU WIN!");
  }

  // Check for game over
  if(player.lives < 1)
  {
    console.log("GAME OVER!");
    gameOver = true;
  }



  // Display the current level between 0 to 1000 in the x position
  if(camera.position.x > 0  && camera.position.x < 500 && (level == 1 || level == 2))
  {
    document.getElementById('level').innerHTML = "LEVEL: " + level;
    document.getElementById('score-under-level').innerHTML = "ENEMIES KILLED: " + enemiesKilled;
  }
  else if(camera.position.x > 0  && camera.position.x < 500 && (level == 3))
  {
    document.getElementById('level-black').innerHTML = "LEVEL: " + level;
    document.getElementById('score-under-level-black').innerHTML = "ENEMIES KILLED: " + enemiesKilled;
  }
  else
  {
    document.getElementById('level').innerHTML = "";
    document.getElementById('score-under-level').innerHTML = "";
     document.getElementById('level-black').innerHTML = "";
    document.getElementById('score-under-level-black').innerHTML = "";
  }
  document.getElementById('score').innerHTML = "SCORE: " + enemiesKilled;
  document.getElementById('lives').innerHTML = "HEALTH: " + player.lives;


  // Update bullets
  bullets.update(elapsedTime, function(bullet){
    if(!camera.onScreen(bullet)) return true;
    return false;
  });

  // Update missiles
  missiles.update(elapsedTime, function(missile){
    if(!camera.onScreen(missile)) return true;
    return false;
  });

  // Update the power up
  powerUps.forEach(function(power){
    power.update(elapsedTime);
    if(checkCollision(player, power))
    {
      const MAX = 4;  // There are 4 possible weapons 
      const MIN = 1;
      var randomNumber = Math.floor(Math.random() * MAX) + MIN
      power.active = false;
      // Generate a random weapon
      switch(randomNumber)
      {
        case 1:
          player.weapon = "weapon-1";
          break;
        case 2:
          player.weapon = "weapon-2";
          break;
        case 3:
          player.weapon = "weapon-3";
          break;
        case 4:
          player.weapon = "weapon-4";
          break;
      }
    }
  });


  /********************************************/
  /*********** FLAPPY MONSTERS ****************/
  /********************************************/


  flappyMonsters.forEach(function(monster){
    monster.update(elapsedTime);
    // Check for player collisions
    if(checkCollision(player, monster) && !monster.collidedWithPlayer)
    {
      monster.collidedWithPlayer = true;
      player.lives--;
      player.state = "hit";
      player.frame = "frame-10";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
    }
    // Check for bullet collisions
    for(var i = 0; i < bullets.pool.length; i+=4) {
      if(enemyAndBulletCollision(monster, bullets, i, 2))
      {
        monster.collidedWithPlayer = true;
        monster.health--;
        // Remove the bullets 
        bullets.update(elapsedTime, function(bullet){
          return true;
        });
      }
    }
    // Check for missile collisions
    for(var j = 0; j < missiles.pool.length; j+=4) {
      if(enemyAndMissileCollision(monster, missiles, j, 64, 64) && initiatedMissile)
      {
        monster.health -= 2;
        initiatedMissile = false;
        // Remove the bullets 
        missiles.update(elapsedTime, function(missile){
          return true;
        });
      }
    }
    if(monster.health < 1)
    {
      enemiesKilled++;
      monster.active = false;
    }
  });


  /********************************************/
  /*********** FLAPPY SKULLS ******************/
  /********************************************/


  // Update the flappy skulls
  skulls.forEach(function(skull){
    skull.update(elapsedTime);
    // Check for player collisions
    if(checkCollision(player, skull) && !skull.collidedWithPlayer)
    {
      skull.collidedWithPlayer = true;
      skull.state = "hit";
      skull.img.src = 'assets/enemies/skull/hit/frame.png';
      player.state = "hit";
      player.frame = "frame-10";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      player.lives--;
    }
    // Check for bullet collisions
    for(var i = 0; i < bullets.pool.length; i+=4) {
      if(enemyAndBulletCollision(skull, bullets, i, 2))
      {
        skull.health--; 
        // Remove the bullets 
        bullets.update(elapsedTime, function(bullet){
          return true;
        });
      }
    }
    // Check for missile collisions
    for(var j = 0; j < missiles.pool.length; j+=4) {
      if(enemyAndMissileCollision(skull, missiles, j, 64, 64) && initiatedMissile)
      {
        skull.health -= 2;
        console.log("Missile collision!");
        initiatedMissile = false;
        // Remove the bullets 
        missiles.update(elapsedTime, function(missile){
          return true;
        });
      }
    }
    if(skull.health < 1)
    {
      enemiesKilled++;
      skull.active = false;
    }
  });

  /********************************************/
  /*********** FLAPPY DRAGONS *****************/
  /********************************************/


  // Update the flappy dragons
  flappyDragons.forEach(function(dragon){
    dragon.update(elapsedTime);
    if(checkCollision(player, dragon) && !dragon.collidedWithPlayer)
    {
      dragon.collidedWithPlayer = true;
      player.state = "hit";
      player.frame = "frame-10";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      player.lives--;
    }
    // Check for bullet collisons 
    for(var i = 0; i < bullets.pool.length; i+=4) {
      if(enemyAndBulletCollision(dragon, bullets, i, 2))
      {
        dragon.health--;

        bullets.update(elapsedTime, function(bullet){
        return true;
        });
      }
    }
    // Check for missile collisions
    for(var j = 0; j < missiles.pool.length; j+=4) {
      if(enemyAndMissileCollision(dragon, missiles, j, 64, 64)  && initiatedMissile)
      {
        dragon.health -= 2;
        initiatedMissile = false;
        console.log("Missile collision!");
        // Remove the bullets (TO DO: fix this so it only removes one)
        missiles.update(elapsedTime, function(missile){
          return true;
        });
      }
    }
    if(dragon.health < 1)
    {
      enemiesKilled++;
      dragon.active = false;
    }
  });

  /********************************************/
  /*********** FLAPPY GRUMPYS *****************/
  /********************************************/

  // Update the flappy grumpys
  flappyGrumpys.forEach(function(grumpy){
    grumpy.update(elapsedTime);
    if(checkCollision(player, grumpy) && !grumpy.collidedWithPlayer)
    {
      grumpy.collidedWithPlayer = true;
      player.state = "hit";
      player.frame = "frame-10";
      player.lives--;
    }
    for(var i = 0; i < bullets.pool.length; i+=4) {
      if(enemyAndBulletCollision(grumpy, bullets, i, 2) && initiatedBullet)
      {
        grumpy.health--;
        initiatedBullet = false;
        bullets.update(elapsedTime, function(bullet){
          return true;
        });
      }
    }
    // Check for missile collisions
    for(var j = 0; j < missiles.pool.length; j+=4) {
      if(enemyAndMissileCollision(grumpy, missiles, j, 64, 64) && initiatedMissile)
      {
        grumpy.health -= 2; 
        initiatedMissile = false;
        console.log("Missile collision!");

        // Remove the bullets (TO DO: fix this so it only removes one)
        missiles.update(elapsedTime, function(missile){
          return true;
        });
      }
    }
    if(grumpy.health < 1)
    {
      enemiesKilled++;
      grumpy.active = false;
    }
  });


  /********************************************/
  /*********** FLAPPY BIRDS   *****************/
  /********************************************/


  // Update the flappy birds
  flappyBirds.forEach(function(bird){
    bird.update(elapsedTime);
    if(checkCollision(player, bird) && !bird.collidedWithPlayer)
    {
      bird.collidedWithPlayer = true;
      player.state = "hit";
      player.frame = "frame-10";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      bird.state = "hit";
      bird.frame = "frame-5";
      bird.img.src = 'assets/enemies/flappy-bird/hit/frame-2.png';
      player.lives--;
    }
    // Check for bullet collisions
    for(var i = 0; i < bullets.pool.length; i+=4) {
      if(enemyAndBulletCollision(bird, bullets, i, 2))
      {
        bird.health--;
        bullets.update(elapsedTime, function(bullet){
          return true;
        });
      }
    }
    // Check for missile collisions
    for(var j = 0; j < missiles.pool.length; j+=4) {
      if(enemyAndMissileCollision(bird, missiles, j, 64, 64) && initiatedMissile)
      {
        bird.health -= 2;
        console.log("Missile collision!");
        initiatedMissile = false;
        // Remove the bullets (TO DO: fix this so it only removes one)
        missiles.update(elapsedTime, function(missile){
          return true;
        });
      }
    }
    if(bird.health < 1)
    {
      enemiesKilled++;
      bird.active = false;
    }
  });

  /* Remove unwanted enemies and powerups */
  flappyMonsters = flappyMonsters.filter(function(monster){ return monster.active; });
  skulls = skulls.filter(function(skull){ return skull.active; });
  flappyDragons = flappyDragons.filter(function(dragon){ return dragon.active; });
  flappyGrumpys = flappyGrumpys.filter(function(grumpy){ return grumpy.active; });
  flappyBirds = flappyBirds.filter(function(bird){ return bird.active; });
  powerUps = powerUps.filter(function(powerup){ return powerup.active; });
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {

  // TODO: Render background
  if(level == 1)
  {
    ctx.save();
    ctx.translate(-camera.position.x, 0);
    ctx.drawImage(backgrounds[2], 0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 1000, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 2000, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 3000, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 4000, 0, canvas.width, canvas.height);
    ctx.drawImage(backgrounds[2], 5000, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .2, 0);
    ctx.drawImage(backgrounds[1], 0, 0);
    ctx.drawImage(backgrounds[1], 1120 *.2, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .6, 0);
    ctx.drawImage(backgrounds[0], 0, 0);
    ctx.drawImage(backgrounds[0], 1120 * .6, 0);
    ctx.restore();
  }
  else if(level == 2)
  {
    ctx.save();
    ctx.translate(-camera.position.x * .1, 0);
    ctx.drawImage(backgrounds[3], 0, 0, backgrounds[3].width, canvas.height);
    ctx.drawImage(backgrounds[3], 1120 * .1, 0, backgrounds[4].width, canvas.height);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .3, 0);
    ctx.drawImage(backgrounds[4], 0, 0, backgrounds[4].width, canvas.height);
    ctx.drawImage(backgrounds[4], 1120 * .3, 0, backgrounds[4].width, canvas.height);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .8, 0);
    ctx.drawImage(backgrounds[5], 0, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 1120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 2120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 3120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 4120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 5120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 6120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 7120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 8120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 9120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.drawImage(backgrounds[5], 10120 * .8, 0, backgrounds[5].width, canvas.height);
    ctx.restore();
  }
  else if(level == 3)
  {
    ctx.save();
    ctx.translate(-camera.position.x * .4, 0);
    ctx.drawImage(backgrounds[6], 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(-camera.position.x * .8, 0);
    ctx.drawImage(backgrounds[7], 0, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 1120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 2120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 3120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 4120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 5120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 6120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 7120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 8120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 9120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.drawImage(backgrounds[7], 10120 * .8, 0, backgrounds[7].width, canvas.height);
    ctx.restore();
  }

  // Transform the coordinate system using
  // the camera position BEFORE rendering
  // objects in the world - that way they
  // can be rendered in WORLD cooridnates
  // but appear in SCREEN coordinates
  ctx.save();
  ctx.translate(-camera.position.x, -camera.position.y);
  renderWorld(elapsedTime, ctx, camera);
  ctx.restore();

  // Render the GUI without transforming the
  // coordinate system
  renderGUI(elapsedTime, ctx);
}

/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderWorld(elapsedTime, ctx, camera) {

    // Render the bullets
    bullets.render(elapsedTime, ctx);

    // Render the missiles
    missiles.render(elapsedTime, ctx);
   
    // Render the player
    player.render(elapsedTime, ctx, camera);

    // Render the power up
    powerUps.forEach(function(powerup){
      powerup.render(elapsedTime, ctx);
    });

    // Render the flappy monsters
    flappyMonsters.forEach(function(FlappyMonster){
      FlappyMonster.render(elapsedTime, ctx);
    });

    // Render the flappy cats
    skulls.forEach(function(Skull){
      Skull.render(elapsedTime, ctx);
    });

    // Render the flappy dragons
    flappyDragons.forEach(function(FlappyDragon){
      FlappyDragon.render(elapsedTime, ctx);
    });

    // Render the flappy grumpys
    flappyGrumpys.forEach(function(FlappyGrumpy){
      FlappyGrumpy.render(elapsedTime, ctx);
    });

    // Render the flappy grumpys
    flappyBirds.forEach(function(FlappyBird){
      FlappyBird.render(elapsedTime, ctx);
    });
}

/**
  * @function renderGUI
  * Renders the game's GUI IN SCREEN COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx
  */
function renderGUI(elapsedTime, ctx) {
  // TODO: Render the GUI
  
}

/**
  * @function checkCollisions
  * Checks for a collision by drawing a box around the shape
  * @param {a} the first object
  * @param {b} the second object
  * @return false if no collision, true if collision
  */
function checkCollision(a, b)
{
  return a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.position.y + a.height > b.position.y;
}

/**
  * @function enemyAndBulletCollisions
  * Checks for a collision by drawing a box around the enemy
  * and a circle around the bullet
  * @param {rect} the enemy
  * @param {bullets} the bullet pool 
  * @param {index} the index in the bullet pool array
  * @param {bulletRadius} the radius of the bullet
  * @return false if no collision, true if collision
  */
function enemyAndBulletCollision(rect, bullets, index, bulletRadius)
{
  var distX = Math.abs(bullets.pool[index] - rect.position.x - rect.width / 2);
  var distY = Math.abs(bullets.pool[index+1] - rect.position.y - rect.height / 2);

  if(distX > (rect.width/2 + bulletRadius)) { return false; }
  if(distY > (rect.height/2 + bulletRadius)) { return false; }

  if(distX <= (rect.width/2)) { return true; }
  if(distY <= (rect.height/2)) { return true; }

  var dx = distX - rect.width/2;
  var dy = distY - rect.height/2;
  return (dx*dx+dy*dy<=(bulletRadius*bulletRadius));
}

/**
  * @function enemyAndMissileCollision
  * Checks for a collision by drawing a box around the enemy
  * and a box around the missile
  * @param {rect} the enemy
  * @param {bullets} the missile pool 
  * @param {index} the index in the missile pool array
  * @param {missileWidth} the width of the missle
  * @param {missileWidth} the height of the missle
  * @return false if no collision, true if collision
  */
function enemyAndMissileCollision(rect, missile, index, missileWidth, missileHeight)
{
  return rect.position.x < missile.pool[index] + missileWidth &&
    rect.position.x + rect.width > missile.pool[index] &&
    rect.position.y < missile.pool[index+1] + missileHeight &&
    rect.position.y + rect.height > missile.pool[index+1];
}

function reinitializeEnemies()
{
  flappyMonsters = [];
  skulls = [];
  flappyDragons = [];
  flappyGrumpys = [];
  flappyBirds = [];
}