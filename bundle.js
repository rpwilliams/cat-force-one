(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
const Explosion = require('./particle_explosion')

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
var gameOverCheck = false;
var explosions = [];
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

window.onkeypress=function(event) {
  if(gameOverCheck)
  {
    level = 1;
    score = 0;
    init();
    document.getElementById('game-over').innerHTML = "";
    document.getElementById('continue').innerHTML = "";
    gameOverCheck = false;
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
    camera = new Camera(canvas);

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

  // update the explosions
  explosions.forEach(function(explosion){
    explosion.update(elapsedTime);
  })

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
    gameOver(player);
    player.lives = 5;
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
      // player.state = "hit";
      player.frame = "frame-10";
      // player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
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
      explosions.push(new Explosion(monster.position.x + 2.5, monster.position.y));
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
      // player.state = "hit";
      player.frame = "frame-10";
      // player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
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
      explosions.push(new Explosion(skull.position.x, skull.position.y));
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
      // player.state = "hit";
      player.frame = "frame-10";
      // player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
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
      explosions.push(new Explosion(dragon.position.x - 5, dragon.position.y));
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
      // player.state = "hit";
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
      explosions.push(new Explosion(grumpy.position.x - 2, grumpy.position.y));
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
      // player.state = "hit";
      player.frame = "frame-10";
      // player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      bird.state = "hit";
      bird.frame = "frame-5";
      bird.img.src = 'assets/enemies/flappy-bird/hit/frame-2.png';
      player.lives--;
      explosions.push(new Explosion(player.position.x, player.position.y));
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
      explosions.push(new Explosion(bird.position.x, bird.position.y));
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
  player.render(elapsedTime, ctx, camera, gameOverCheck);

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

  // Render the explosions
  explosions.forEach(function(explosion){
    explosion.render(elapsedTime, ctx);
  })

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

function gameOver(player, flag)
{
  console.log("GAME OVER!");
  explosions.push(new Explosion(player.position.x + 3, player.position.y + 3));
  document.getElementById('game-over').innerHTML = "GAME OVER";
  document.getElementById('continue').innerHTML = "Press any key to continue";
  gameOverCheck = true;
  reinitializeEnemies();
}
},{"./bullet_pool":2,"./camera":3,"./flappy-bird":4,"./flappy-dragon":5,"./flappy-grumpy":6,"./flappy-monster":7,"./game":8,"./missile_pool":9,"./particle_explosion":11,"./player":12,"./powerup":13,"./skull":14,"./vector":15}],2:[function(require,module,exports){
"use strict";

/**
 * @module BulletPool
 * A class for managing bullets in-game
 * We use a Float32Array to hold our bullet info,
 * as this creates a single memory buffer we can
 * iterate over, minimizing cache misses.
 * Values stored are: positionX, positionY, velocityX,
 * velocityY in that order.
 */
module.exports = exports = BulletPool;

/**
 * @constructor BulletPool
 * Creates a BulletPool of the specified size
 * @param {uint} size the maximum number of bullets to exits concurrently
 */
function BulletPool(maxSize) {
  this.pool = new Float32Array(4 * maxSize);
  this.end = 0;
  this.max = maxSize;
  this.color = "white";
}

/**
 * @function add
 * Adds a new bullet to the end of the BulletPool.
 * If there is no room left, no bullet is created.
 * @param {Vector} position where the bullet begins
 * @param {Vector} velocity the bullet's velocity
*/
BulletPool.prototype.add = function(position, velocity) {
  if(this.end < this.max) {
    this.pool[4*this.end] = position.x;
    this.pool[4*this.end+1] = position.y;
    this.pool[4*this.end+2] = velocity.x;
    this.pool[4*this.end+3] = velocity.y;
    this.end++;
  }
}

/**
 * @function update
 * Updates the bullet using its stored velocity, and
 * calls the callback function passing the transformed
 * bullet.  If the callback returns true, the bullet is
 * removed from the pool.
 * Removed bullets are replaced with the last bullet's values
 * and the size of the bullet array is reduced, keeping
 * all live bullets at the front of the array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {function} callback called with the bullet's position,
 * if the return value is true, the bullet is removed from the pool
 */
BulletPool.prototype.update = function(elapsedTime, callback) {
  for(var i = 0; i < this.end; i++){
    // Move the bullet
    this.pool[4*i] += this.pool[4*i+2];
    this.pool[4*i+1] += this.pool[4*i+3];
    // If a callback was supplied, call it
    if(callback && callback({
      x: this.pool[4*i],
      y: this.pool[4*i+1]
    })) {
      // Swap the current and last bullet if we
      // need to remove the current bullet
      this.pool[4*i] = this.pool[4*(this.end-1)];
      this.pool[4*i+1] = this.pool[4*(this.end-1)+1];
      this.pool[4*i+2] = this.pool[4*(this.end-1)+2];
      this.pool[4*i+3] = this.pool[4*(this.end-1)+3];
      // Reduce the total number of bullets by 1
      this.end--;
      // Reduce our iterator by 1 so that we update the
      // freshly swapped bullet.
      i--;
    }
  }
  this.color = this.color;
}

/**
 * @function render
 * Renders all bullets in our array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
BulletPool.prototype.render = function(elapsedTime, ctx) {
  // Render the bullets as a single path
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = this.color;
  for(var i = 0; i < this.end; i++) {
    ctx.moveTo(this.pool[4*i], this.pool[4*i+1]);
    ctx.arc(this.pool[4*i], this.pool[4*i+1], 2, 0, 2*Math.PI);
  }
  ctx.fill();
  ctx.restore();
}

},{}],3:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');

/**
 * @module Camera
 * A class representing a simple camera
 */
module.exports = exports = Camera;

/**
 * @constructor Camera
 * Creates a camera
 * @param {Rect} screen the bounds of the screen
 */
function Camera(screen) {
  this.position = {x:0, y:0};
  this.width = screen.width;
  this.height = screen.height;
  this.xMin = 100;
  this.xMax = 500;
  this.xOff = 500;
}

/**
 * @function update
 * Updates the camera based on the supplied target
 * @param {Vector} target what the camera is looking at
 */
Camera.prototype.update = function(target) {
  // TODO: Align camera with player
  var self = this;
  self.xOff += target.velocity.x;
  //console.log(self.xOff, self.xMax, self.xOff > self.xMax);
  if(self.xOff > self.xMax) {
    self.position.x += self.xOff - self.xMax;
    self.xOff = self.xMax;
  }
  if(self.xOff < self.xMin) {
    self.position.x -= self.xMin - self.xOff;
    self.xOff = self.xMin;
  }

  if(self.position.x < 0) self.position.x = 0;
  console.log("Camera: (" + self.position.x + "," + self.position.y + ")");
}

/**
 * @function onscreen
 * Determines if an object is within the camera's gaze
 * @param {Vector} target a point in the world
 * @return true if target is on-screen, false if not
 */
Camera.prototype.onScreen = function(target) {
  return (
     target.x > this.position.x &&
     target.x < this.position.x + this.width &&
     target.y > this.position.y &&
     target.y < this.position.y + this.height
   );
}

/**
 * @function toScreenCoordinates
 * Translates world coordinates into screen coordinates
 * @param {Vector} worldCoordinates
 * @return the tranformed coordinates
 */
Camera.prototype.toScreenCoordinates = function(worldCoordinates) {
  return Vector.subtract(worldCoordinates, this);
}

/**
 * @function toWorldCoordinates
 * Translates screen coordinates into world coordinates
 * @param {Vector} screenCoordinates
 * @return the tranformed coordinates
 */
Camera.prototype.toWorldCoordinates = function(screenCoordinates) {
  return Vector.add(screenCoordinates, this);
}

},{"./vector":15}],4:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const PLAYER_SPEED = -.25;
const MS_PER_FRAME = 1000/8;

/**
 * @module FlappyBird
 * A class representing a player's helicopter
 */
module.exports = exports = FlappyBird;

/**
 * @constructor Flappy Monster
 * Creates a flappy monster
 * @param {xPos} the x position
 * @param {yPos} the y position
 */
function FlappyBird(xPos, yPos, canvas, img) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  //this.img = new Image();
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  //this.img.src = 'assets/enemies/flappy-bird/flying/frame-1.png';
  this.timer = 0;
  this.state = "flying";
  this.height = 128 * 3;
  this.width = 128 * 3;
  this.initialAcceleration = true; 
  this.active = true;
  this.img = img[0];
  this.collidedWithPlayer = false;  // Don't allow duplicate collisions
  this.health = 5;

  var self = this;
  self.animate = function(time)
  {
    self.timer += time;
    if(self.timer > MS_PER_FRAME)
    {
      self.timer = 0;
      if(self.state = "flying")
      {
        switch(self.frame)
        {
          case 'frame-1':
            self.frame = 'frame-2';
            //self.img.src = 'assets/enemies/flappy-bird/flying/frame-2.png';
            self.img = img[1];
            break;
          case 'frame-2':
            self.frame = 'frame-3';
            //self.img.src = 'assets/enemies/flappy-bird/flying/frame-3.png';
            self.img = img[2];
            break;
          case 'frame-3':
            self.frame = 'frame-4';
            //self.img.src = 'assets/enemies/flappy-bird/flying/frame-4.png';
            self.img = img[3];
            break;
          case 'frame-4':
            self.frame = 'frame-1';
            //self.img.src = 'assets/enemies/flappy-bird/flying/frame-1.png';
            self.img = img[0];
            break;
        }
      }
      else
      {
        switch(self.frame)
        {
          case 'frame-5':
            self.frame = 'frame-6';
            //self.img.src = 'assets/enemies/flappy-bird/hit/frame-2.png';
            self.img = img[5];
            break;
          case 'frame-6':
            self.frame = 'frame-5';
            //self.img.src = 'assets/enemies/flappy-bird/hit/frame-1.png';
            self.img = img[4];
            break;
        }
      }
    }  
  }
}


/**
 * @function update
 * Updates the flappy monster based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 */
FlappyBird.prototype.update = function(elapsedTime) {
  // move the player
  this.velocity.x += PLAYER_SPEED;
  this.position.x += PLAYER_SPEED;
  this.active = this.active;

  // don't let the player move off-screen
  //if(this.position.x < 0) this.position.x = 0;
  //if(this.position.x > 1024) this.position.x = 1024;
  //if(this.position.y > 786) this.position.y = 786;

  this.animate(elapsedTime);
 
}

/**
 * @function render
 * Renders the flappy monster in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
FlappyBird.prototype.render = function(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  //ctx.rotate(-this.angle);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}


  



},{"./vector":15}],5:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const PLAYER_SPEED = -5;
const MS_PER_FRAME = 1000/8;

/**
 * @module FlappyDragon
 * A class representing a player's helicopter
 */
module.exports = exports = FlappyDragon;

/**
 * @constructor Flappy Monster
 * Creates a flappy monster
 * @param {xPos} the x position
 * @param {yPos} the y position
 */
function FlappyDragon(xPos, yPos, img) {
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.img = img[0];
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  this.timer = 0;
  this.height = 64;
  this.width = 64;
  this.active = true;
  this.collidedWithPlayer = false; // Don't allow duplicate collisions
  this.health = 1;

  var self = this;
  self.animate = function(time)
  {
    self.timer += time;
    if(self.timer > MS_PER_FRAME)
    {
      self.timer = 0;
      switch(self.frame)
      {
        case 'frame-1':
          self.frame = 'frame-2';
          self.img = img[1];
          break;
        case 'frame-2':
          self.frame = 'frame-3';
          self.img = img[2];
          break;
        case 'frame-3':
          self.frame = 'frame-4';
          self.img = img[3];
          break;
        case 'frame-4':
          self.frame = 'frame-1';
          self.img = img[0];
          break;
      }
    }
  }
}

/**
 * @function update
 * Updates the flappy monster based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 */
FlappyDragon.prototype.update = function(elapsedTime) {
  this.velocity.x += PLAYER_SPEED;
  this.position.x += PLAYER_SPEED;
  this.active = this.active;

  // animate the monster
  this.animate(elapsedTime);
}

/**
 * @function render
 * Renders the flappy monster in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
FlappyDragon.prototype.render = function(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}


  



},{"./vector":15}],6:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const PLAYER_SPEED = -2;
const MS_PER_FRAME = 1000/8;

/**
 * @module FlappyGrumpy
 * A class representing a player's helicopter
 */
module.exports = exports = FlappyGrumpy;

/**
 * @constructor Flappy Monster
 * Creates a flappy monster
 * @param {xPos} the x position
 * @param {yPos} the y position
 */
function FlappyGrumpy(xPos, yPos, img) {
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.img =  img[0];
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  this.timer = 0;
  this.height = 64;
  this.width = 64;
  this.active = true;
  this.collidedWithPlayer = false; // Don't allow duplicate collisions
  this.health = 1;

  var self = this;
  self.animate = function(time)
  {
    self.timer += time;
    if(self.timer > MS_PER_FRAME)
    {
      self.timer = 0;
      switch(self.frame)
      {
        case 'frame-1':
          self.frame = 'frame-2';
          self.img = img[1];
          break;
        case 'frame-2':
          self.frame = 'frame-3';
          self.img = img[2];
          break;
        case 'frame-3':
          self.frame = 'frame-4';
          self.img = img[3];
          break;
        case 'frame-4':
          self.frame = 'frame-5';
          self.img = img[4];
          break;
        case 'frame-5':
          self.frame = 'frame-6';
          self.img = img[5];
          break;
        case 'frame-6':
          self.frame = 'frame-7';
          self.img = img[6];
          break;
        case 'frame-7':
          self.frame = 'frame-8';
          self.img = img[7];
          break;
        case 'frame-8':
          self.frame = 'frame-1';
          self.img = img[0];
          break;
      }
    }
  }
}

/**
 * @function update
 * Updates the flappy monster based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 */
FlappyGrumpy.prototype.update = function(elapsedTime) {
  // move the player
  this.velocity.x += PLAYER_SPEED;
  this.position.x += PLAYER_SPEED;
  this.active = this.active;
  
  // don't let the player move off-screen
  //if(this.position.x < 0) this.position.x = 0;
  //if(this.position.x > 1024) this.position.x = 1024;
  //if(this.position.y > 786) this.position.y = 786;

  // animate the monster
  this.animate(elapsedTime);
  
}

/**
 * @function render
 * Renders the flappy monster in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
FlappyGrumpy.prototype.render = function(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}


  



},{"./vector":15}],7:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const PLAYER_SPEED = 2.5;
const MS_PER_FRAME = 1000/8;

/**
 * @module FlappyMonster
 * A class representing a player's helicopter
 */
module.exports = exports = FlappyMonster;

/**
 * @constructor Flappy Monster
 * Creates a flappy monster
 * @param {xPos} the x position
 * @param {yPos} the y position
 */
function FlappyMonster(xPos, yPos, img) {
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  this.img = img[0];
  this.timer = 0;
  this.height = 64;
  this.width = 64;
  this.active = true;
  this.collidedWithPlayer = false; // Don't allow duplicate collisions
  this.health = 2;

  var self = this;
  self.animate = function(time)
  {
    self.timer += time;
    if(self.timer > MS_PER_FRAME)
    {
      self.timer = 0;
      switch(self.frame)
      {
        case 'frame-1':
          self.frame = 'frame-2';
          self.img = img[1];
          break;
        case 'frame-2':
          self.frame = 'frame-3';
          self.img = img[2];
          break;
        case 'frame-3':
          self.frame = 'frame-4';
          self.img = img[3];
          break;
        case 'frame-4':
          self.frame = 'frame-5';
          self.img = img[4];
          break;
        case 'frame-5':
          self.frame = 'frame-6';
          self.img = img[5];
          break;
        case 'frame-6':
          self.frame = 'frame-7';
          self.img = img[6];
          break;
        case 'frame-7':
          self.frame = 'frame-8';
          self.img = img[7];
          break;
        case 'frame-8':
          self.frame = 'frame-1';
          self.img = img[0];
          break;
      }
    }
  }
}

/**
 * @function update
 * Updates the flappy monster based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 */
FlappyMonster.prototype.update = function(elapsedTime) {
  // move the player
  this.velocity.x += PLAYER_SPEED;
  this.position.x += PLAYER_SPEED;
  this.active = this.active;

  // animate the monster
  this.animate(elapsedTime);
  
}

/**
 * @function render
 * Renders the flappy monster in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
FlappyMonster.prototype.render = function(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}


  



},{"./vector":15}],8:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],9:[function(require,module,exports){
"use strict";

/**
 * @module MissilePool
 * A class for managing bullets in-game
 * We use a Float32Array to hold our bullet info,
 * as this creates a single memory buffer we can
 * iterate over, minimizing cache misses.
 * Values stored are: positionX, positionY, velocityX,
 * velocityY in that order.
 */
module.exports = exports = MissilePool;

/**
 * @constructor MissilePool
 * Creates a MissilePool of the specified size
 * @param {uint} size the maximum number of bullets to exits concurrently
 */
function MissilePool(maxSize) {
  this.pool = new Float32Array(4 * maxSize);
  this.end = 0;
  this.max = maxSize;
}

/**
 * @function add
 * Adds a new bullet to the end of the MissilePool.
 * If there is no room left, no bullet is created.
 * @param {Vector} position where the bullet begins
 * @param {Vector} velocity the bullet's velocity
*/
MissilePool.prototype.add = function(position, velocity) {
  if(this.end < this.max) {
    this.pool[4*this.end] = position.x;
    this.pool[4*this.end+1] = position.y;
    this.pool[4*this.end+2] = velocity.x;
    this.pool[4*this.end+3] = velocity.y;
    this.end++;
  }
}

/**
 * @function update
 * Updates the bullet using its stored velocity, and
 * calls the callback function passing the transformed
 * bullet.  If the callback returns true, the bullet is
 * removed from the pool.
 * Removed bullets are replaced with the last bullet's values
 * and the size of the bullet array is reduced, keeping
 * all live bullets at the front of the array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {function} callback called with the bullet's position,
 * if the return value is true, the bullet is removed from the pool
 */
MissilePool.prototype.update = function(elapsedTime, callback) {
  for(var i = 0; i < this.end; i++){
    // Move the bullet
    this.pool[4*i] += this.pool[4*i+2];
    this.pool[4*i+1] += this.pool[4*i+3];
    // If a callback was supplied, call it
    if(callback && callback({
      x: this.pool[4*i],
      y: this.pool[4*i+1]
    })) {
      // Swap the current and last bullet if we
      // need to remove the current bullet
      this.pool[4*i] = this.pool[4*(this.end-1)];
      this.pool[4*i+1] = this.pool[4*(this.end-1)+1];
      this.pool[4*i+2] = this.pool[4*(this.end-1)+2];
      this.pool[4*i+3] = this.pool[4*(this.end-1)+3];
      // Reduce the total number of bullets by 1
      this.end--;
      // Reduce our iterator by 1 so that we update the
      // freshly swapped bullet.
      i--;
    }
  }
}

/**
 * @function render
 * Renders all bullets in our array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
MissilePool.prototype.render = function(elapsedTime, ctx) {
  // Render the bullets as a single path
  // ctx.save();
  // ctx.beginPath();
  // for(var i = 0; i < this.end; i++) {
  //   ctx.moveTo(this.pool[4*i], this.pool[4*i+1]);
  //   var img = new Image();
  //   img.src = 'assets/weapons/torpedo.png';
  //   ctx.drawImage(img, 0, 0, 64, 64);
  // }
  // ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "white";
  for(var i = 0; i < this.end; i++) {
    ctx.moveTo(this.pool[4*i], this.pool[4*i+1]);
    // (x,y,r,sAngle,eAngle,counterclockwise)
    var img = new Image();
    img.src = 'assets/weapons/torpedo.png';
    ctx.drawImage(img, this.pool[4*i], this.pool[4*i+1], 64, 64);
  }
  ctx.fill();
  ctx.restore();
}

},{}],10:[function(require,module,exports){
"use strict";

/*
 * @module Particle
 * A single explosion particle
 * Code from http://www.gameplaypassion.com/blog/explosion-effect-html5-canvas/
 */
 module.exports = exports = Particle;

function Particle()
{
	this.scale = 1.0;
	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.color = "#000";
	this.velocityX = 0;
	this.velocityY = 0;
	this.scaleSpeed = 0.5;

	this.update = function(ms)
	{
		// shrinking
		this.scale -= this.scaleSpeed * ms / 1000.0;

		if (this.scale <= 0)
		{
			this.scale = 0;
		}
		// moving away from explosion center
		this.x += this.velocityX * ms/1000.0;
		this.y += this.velocityY * ms/1000.0;
	};
}

Particle.prototype.update = function(elapsedTime)
{
	// shrinking
	this.scale -= this.scaleSpeed * elapsedTime / 1000.0;

	if (this.scale <= 0)
	{
		this.scale = 0;
	}
	// moving away from explosion center
	this.x += this.velocityX * elapsedTime/1000.0;
	this.y += this.velocityY * elapsedTime/1000.0;
}

Particle.prototype.render = function(ctx)
{
	// translating the 2D context to the particle coordinates
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.scale(this.scale, this.scale);

	// drawing a filled circle in the particle's local space
	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
	ctx.closePath();

	ctx.fillStyle = this.color;
	ctx.fill();

	ctx.restore();
}
},{}],11:[function(require,module,exports){
"use strict";

module.exports = exports = Explosion;

const Particle = require('./particle');

/* Array of particles (global variable)
*/
var particles = [];

/*
 * Basic Explosion, all particles move and shrink at the same speed.
 * 
 * Parameter : explosion center
 */
function Explosion(x, y)
{
	// creating 4 particles that scatter at 0, 90, 180 and 270 degrees
	for (var angle=0; angle<360; angle+=90)
	{
		var particle = new Particle();

		// particle will start at explosion center
		particle.x = x;
		particle.y = y;

		particle.color = "#FF0000";

		var speed = 50.0;

		// velocity is rotated by "angle"
		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

		// adding the newly created particle to the "particles" array
		particles.push(particle);
	}
}

Explosion.prototype.update = function(elapsedTime)
{
	// draw a white background to clear canvas
	//ctx.fillStyle = "#FFF";
	//ctx.fillRect(0, 0, canvas.width, canvas.height);

	// update and draw particles
	for (var i=0; i<particles.length; i++)
	{
		var particle = particles[i];

		particle.update(elapsedTime);
	}
}

Explosion.prototype.render = function(elapsedTime, ctx)
{
	// draw a white background to clear canvas
	//ctx.fillStyle = "#FFF";
	//ctx.fillRect(0, 0, canvas.width, canvas.height);

	// update and draw particles
	for (var i=0; i<particles.length; i++)
	{
		var particle = particles[i];

		particle.render(ctx);
	}
}
},{"./particle":10}],12:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');

/* Constants */
const PLAYER_SPEED = 3;
const BULLET_SPEED = 10;
const MISSILE_SPEED = 10;
const MS_PER_FRAME = 1000/8;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Player(bullets, missiles, weapon, img) {
  this.missiles = missiles;
  this.missileCount = 4;
  this.bullets = bullets;
  this.angle = 0;
  this.position = {x: 200, y: 200};
  this.velocity = {x: 0, y: 0};
  this.width = 64 + (64 * .5);
  this.height = 64 + (64 * .5);
  this.state = "flying";
  this.timer = 0;
  this.frame = 'frame-1';
  this.weapon = weapon;
  this.img = img[0];
  this.lives = 5;

  var self = this;
  self.animate = function(time)
  {
    self.timer += time;
    if(self.timer > MS_PER_FRAME)
    {
      self.timer = 0;
      if(self.state = "flying")
      {
        switch(self.frame)
        {
          case 'frame-1':
            self.frame = 'frame-2';
            self.img = img[0];
            break;
          case 'frame-2':
            self.frame = 'frame-3';
            self.img = img[1];
            break;
          case 'frame-3':
            self.frame = 'frame-4';
            self.img = img[2];
            break;
          case 'frame-4':
            self.frame = 'frame-5';
            self.img = img[3];
            break;
          case 'frame-5':
            self.frame = 'frame-6';
            self.img = img[4];
            break;
          case 'frame-6':
            self.frame = 'frame-7';
            self.img = img[5];
            break;
          case 'frame-7':
            self.frame = 'frame-8';
            self.img = img[6];
            break;
          case 'frame-8':
            self.frame = 'frame-1';
            self.img = img[7];
            break;
          case 'frame-10':
            self.frame = 'frame-1';
            self.img = img[9];
            break;
        }
      }
      // else
      // {
      //   switch(self.frame)
      //   {
      //     case 'frame-9':
      //       self.frame = 'frame-10';
      //       self.img = img[8];
      //       break;
      //     case 'frame-10':
      //       self.frame = 'frame-9';
      //       self.img = img[9];
      //       break;
      //   }
      // }
    }
  }  
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {
  this.animate(elapsedTime);
  
  // set the velocity
  this.velocity.x = 0;
  // if(input.left) this.velocity.x -= PLAYER_SPEED;
  // if(input.right) this.velocity.x += PLAYER_SPEED;
  this.velocity.x += PLAYER_SPEED;
  this.velocity.y = 0;
  if(input.up) this.velocity.y -= PLAYER_SPEED * 2;
  if(input.down) this.velocity.y += PLAYER_SPEED * 2;

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  
  // don't let the player move off-screen
  if(this.position.x < 0) this.position.x = 200;
  //if(this.position.x > 1024) this.position.x = 1024;
  //if(this.position.y > 786) this.position.y = 786;  
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx, camera, gameOver) {
  //var offset = this.angle * 23;
  if(!gameOver)
  {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
    ctx.drawImage(this.img, 0, 0, this.width, this.height);
    ctx.restore();

    var img = new Image();
    if(this.weapon === "weapon-1")
    {
      img.src = 'assets/weapons/Turret01.png';
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
      ctx.drawImage(img, 0 + 15, 0 + 30, 28 * 2 - 10, 28 * 2);
      ctx.restore();
    }
    else if(this.weapon === "weapon-2")
    {
      img.src = 'assets/weapons/Turret04.png';
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
      ctx.drawImage(img, 0 + 15, 0 + 30, 28 * 2 - 10, 28 * 2);
      ctx.restore();
    }
    else if(this.weapon === "weapon-3")
    {
      img.src = 'assets/weapons/Turret06.png';
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
      ctx.drawImage(img, 0 + 15, 0 + 30, 28 * 1.5, 28 * 1.5);
      ctx.restore();
    }
    else if(this.weapon === "weapon-4")
    {
      img.src = 'assets/weapons/Turret02.png';
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
      ctx.drawImage(img, 0 + 15, 0 + 30, 28 * 2 - 10, 28 * 2);
      ctx.restore();
    }
  }
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Player.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:30, y:30});
  var velocity = Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
  console.log("Bullet fired at (" + position.x + ", " + position.y + ")");
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */
// Player.prototype.fireMissile = function() {
//   if(this.missileCount > 0){
//     var position = Vector.add(this.position, {x:30, y:30})
//     //var missile = new MissilePool(position);
//     var missile = new MissilePool(10);
//     this.missiles.push(missile);
//     this.missileCount--;
//   }
Player.prototype.fireMissile= function(direction) {
  var position = Vector.add(this.position, {x:30, y:30});
  var velocity = Vector.scale(Vector.normalize(direction), MISSILE_SPEED);
  this.missiles.add(position, velocity);
  console.log("Missile fired at (" + position.x + ", " + position.y + ")");
}



},{"./vector":15}],13:[function(require,module,exports){
"use strict";

/**
 * @module Powerup
 * A class representing a Powerup's helicopter
 */
module.exports = exports = Powerup;

/**
 * @constructor Powerup
 * Creates a Powerup
 * @param {BulletPool} bullets the bullet pool
 */
function Powerup(xPos, yPos) {
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.img = new Image()
  this.img.src = 'assets/weapons/powerup.png';
  this.width = 28;
  this.height = 28;
  this.active = true;
}

/**
 * @function update
 * Updates the Powerup based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Powerup.prototype.update = function(elapsedTime, input) {
  this.active = this.active;
}

/**
 * @function render
 * Renders the Powerup helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Powerup.prototype.render = function(elapasedTime, ctx, camera) {
  //var offset = this.angle * 23;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}



},{}],14:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const PLAYER_SPEED = 1;
const MS_PER_FRAME = 1000/2;

/**
 * @module Skull
 * A class representing a player's helicopter
 */
module.exports = exports = Skull;

/**
 * @constructor Flappy Monster
 * Creates a flappy monster
 * @param {xPos} the x position
 * @param {yPos} the y position
 */
function Skull(xPos, yPos, canvas, img) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.img = img[0];
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  this.timer = 0;
  this.state = "idle";
  this.height = 64;
  this.width = 64;
  this.initialAcceleration = true; 
  this.active = true;
  this.collidedWithPlayer = false; // Don't allow duplicate collisions
  this.health = 1;

  var self = this;
  self.animate = function(time)
  {
    self.timer += time;
    if(self.timer > MS_PER_FRAME)
    {
      self.timer = 0;
      if(self.state = "idle")
      {
        switch(self.frame)
        {
          case 'frame-1':
            self.frame = 'frame-2';
            self.img = img[1];
            break;
          case 'frame-2':
            self.frame = 'frame-1';
            self.img = img[0];
            break;
        }
      }
      else
      {
        self.frame = 'frame-3';
        self.img = img[2];
      }
    }  
  }
}


/**
 * @function update
 * Updates the flappy monster based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 */
Skull.prototype.update = function(elapsedTime) {
  // move the player
  //this.velocity.x += PLAYER_SPEED;
  this.position.x += PLAYER_SPEED;
  this.active = this.active;
  
  // don't let the player move off-screen
  //if(this.position.x < 0) this.position.x = 0;
  //if(this.position.x > 1024) this.position.x = 1024;
  //if(this.position.y > 786) this.position.y = 786;

  // animate the monster
  this.animate(elapsedTime);

  // Apply angular velocity
  this.angle += elapsedTime * 0.005;

  // Apply acceleration
  if(this.initialAcceleration) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x;
    this.velocity.y -= acceleration.y;
    this.initialAcceleration = false;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  //if(this.position.x < 0) this.position.x += this.worldWidth;
  //if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function render
 * Renders the flappy monster in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Skull.prototype.render = function(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  //ctx.rotate(-this.angle);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}


  



},{"./vector":15}],15:[function(require,module,exports){
"use strict";

/**
 * @module Vector
 * A library of vector functions.
 */
module.exports = exports = {
  add: add,
  subtract: subtract,
  scale: scale,
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize
}


/**
 * @function rotate
 * Scales a vector
 * @param {Vector} a - the vector to scale
 * @param {float} scale - the scalar to multiply the vector by
 * @returns a new vector representing the scaled original
 */
function scale(a, scale) {
 return {x: a.x * scale, y: a.y * scale};
}

/**
 * @function add
 * Computes the sum of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed sum
*/
function add(a, b) {
 return {x: a.x + b.x, y: a.y + b.y};
}

/**
 * @function subtract
 * Computes the difference of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed difference
 */
function subtract(a, b) {
  return {x: a.x - b.x, y: a.y - b.y};
}

/**
 * @function rotate
 * Rotates a vector about the Z-axis
 * @param {Vector} a - the vector to rotate
 * @param {float} angle - the angle to roatate by (in radians)
 * @returns a new vector representing the rotated original
 */
function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

/**
 * @function dotProduct
 * Computes the dot product of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed dot product
 */
function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

/**
 * @function magnitude
 * Computes the magnitude of a vector
 * @param {Vector} a the vector
 * @returns the calculated magnitude
 */
function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

/**
 * @function normalize
 * Normalizes the vector
 * @param {Vector} a the vector to normalize
 * @returns a new vector that is the normalized original
 */
function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}

},{}]},{},[1]);
