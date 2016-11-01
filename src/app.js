"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Vector = require('./vector');
const Camera = require('./camera');
const Player = require('./player');
const BulletPool = require('./bullet_pool');
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
var bullets = new BulletPool(10);
var missiles = [];
var player;
var backgrounds = [
  new Image(),
  new Image(),
  new Image
];
var flappyMonsters = [];
var skulls = [];
var flappyDragons = [];
var flappyGrumpys = [];
var flappyBirds = [];
var powerUps = [];
var reticule = {
  x: 0,
  y: 0
}
var playerImg = [];
var flappyBirdImg = [];
var flappyMonsterImg = [];
var skullImg = [];
var flappyDragonImg = [];
var flappyGrumpyImg = [];

/**
 * @function onmousemove
 * Handles mouse move events
 */
window.onmousemove = function(event) {
  event.preventDefault();
  reticule.x = event.offsetX;
  reticule.y = event.offsetY;
}

/**
 * @function onmousedown
 * Handles mouse left-click events
 */
window.onmousedown = function(event) {
  event.preventDefault();
  reticule.x = event.offsetX;
  reticule.y = event.offsetY;
  // TODO: Fire bullet in direction of the retciule
  bullets.add(player.position, {x:10, y:0});
  player.fireBullet(reticule);
}

/**
 * @function oncontextmenu
 * Handles mouse right-click events
 */
window.oncontextmenu = function(event) {
  event.preventDefault();
  reticule.x = event.offsetX;
  reticule.y = event.offsetY;
  // TODO: Fire missile
}

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
    case "ArrowLeft":
    case "a":
      input.left = true;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
      event.preventDefault();
      break;
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
    case "ArrowLeft":
    case "a":
      input.left = false;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
      event.preventDefault();
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
  /*
    All images are public domain and from opengameart.org
   */

  // Load the background images
  backgrounds[0].src = 'assets/city-foreground.png';
  backgrounds[1].src = 'assets/city-background.png';
  backgrounds[2].src = 'assets/city-sky.png';

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

  powerUps.push(new Powerup(50,50));
  powerUps.push(new Powerup(1000,50));
  powerUps.push(new Powerup(2000,50));
  powerUps.push(new Powerup(3000,50));
  powerUps.push(new Powerup(4000,50));

  flappyMonsters.push(new FlappyMonster(0, 0, flappyMonsterImg));
  flappyMonsters.push(new FlappyMonster(500, 20, flappyMonsterImg));
  flappyMonsters.push(new FlappyMonster(1000, 80, flappyMonsterImg));
  flappyMonsters.push(new FlappyMonster(1500, 400, flappyMonsterImg));
  flappyMonsters.push(new FlappyMonster(2000, 225, flappyMonsterImg));
  flappyMonsters.push(new FlappyMonster(3000, 225, flappyMonsterImg));

  skulls.push(new Skull(50, 70, canvas, skullImg));
  skulls.push(new Skull(1000, 200, canvas, skullImg));
  skulls.push(new Skull(2000, 10, canvas, skullImg));
  skulls.push(new Skull(500, 70, canvas, skullImg));
  skulls.push(new Skull(4000, 10, canvas, skullImg));
  skulls.push(new Skull(5000, 10, canvas, skullImg));

  flappyDragons.push(new FlappyDragon(5000, 50, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(4500, 100, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(4000, 60, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(3500, 500, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(5000, 700, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(4000, 10, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(5000, 200, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(10000, 50, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(9000, 100, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(8000, 60, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(7000, 500, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(6000, 700, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(10000, 10, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(10000, 200, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(11000, 10, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(11000, 200, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(12000, 10, flappyDragonImg));
  flappyDragons.push(new FlappyDragon(12000, 200, flappyDragonImg));

  flappyGrumpys.push(new FlappyGrumpy(5000, 300, flappyGrumpyImg));
  flappyGrumpys.push(new FlappyGrumpy(6000, 200, flappyGrumpyImg));
  flappyGrumpys.push(new FlappyGrumpy(1000, 0, flappyGrumpyImg));
  flappyGrumpys.push(new FlappyGrumpy(2000, 150, flappyGrumpyImg));
  flappyGrumpys.push(new FlappyGrumpy(7000, 80, flappyGrumpyImg));
  flappyGrumpys.push(new FlappyGrumpy(4000, 190, flappyGrumpyImg));

  flappyBirds.push(new FlappyBird(5250, 400, canvas, flappyBirdImg));
  flappyBirds.push(new FlappyBird(5250, 0, canvas, flappyBirdImg));

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

  // Update bullets
  bullets.update(elapsedTime, function(bullet){
    //if(!camera.onScreen(bullet)) return true;
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
      console.log("Power up: " + randomNumber);
      power.active = false;

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

  // Update the flappy monsters
  flappyMonsters.forEach(function(monster){
    monster.update(elapsedTime);
    if(checkCollision(player, monster))
    {
      console.log("Collision!");
      console.log("Player: " + "(" + player.position.x + "," + player.position.y + ")");
      console.log("Flappy monster: (" + monster.position.x
        + "," + monster.position.y + ")");
      player.state = "hit";
      player.frame = "frame-10";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
    }
    // if(checkCollision(bullets, monster))
    // {
    //   console.log("Bullet collision!");
    // }
  });

  // Update the flappy cats
  skulls.forEach(function(skull){
    skull.update(elapsedTime);
    if(checkCollision(player, skull))
    {
      skull.state = "hit";
      //skull.frame = "frame-3";
      skull.img.src = 'assets/enemies/skull/hit/frame.png';
      console.log("Skull collision!");
      player.state = "hit";
      player.frame = "frame-10";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      //player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
    }
    // if(checkCollision(bullets, dragon))
    // {
    //   skull.state = "hit";
    //   skull.img.src = 'assets/enemies/skull/hit/frame.png';
    //   console.log("Bullet collision!");
    // }
  });

  // Update the flappy dragons
  flappyDragons.forEach(function(dragon){
    dragon.update(elapsedTime);
    if(checkCollision(player, dragon))
    {
      player.state = "hit";
      player.frame = "frame-10";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      console.log("Dragon collision! ROAR");
    }
    // if(checkCollision(bullets, dragon))
    // {
    //   console.log("Bullet collision!");
    // }
  });

  // Update the flappy grumpys
  flappyGrumpys.forEach(function(grumpy){
    grumpy.update(elapsedTime);
    if(checkCollision(player, grumpy))
    {
      player.state = "hit";
      player.frame = "frame-10";
      //player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      console.log("Grumpy collision! That should make you grumpy.");
    }
    // if(checkCollision(bullets, grumpy))
    // {
    //   console.log("Bullet collision!");
    // }
  });

  // Update the flappy grumpys
  flappyBirds.forEach(function(bird){
    bird.update(elapsedTime);
    if(checkCollision(player, bird))
    {
      player.state = "hit";
      player.frame = "frame-10";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      bird.state = "hit";
      bird.frame = "frame-5";
      bird.img.src = 'assets/enemies/flappy-bird/hit/frame-2.png';
      console.log("Bird collision! That bird flew the coop!");
    }
    // if(checkCollision(bullets, bird))
    // {
    //   console.log("Bullet collision!");
    // }
  });

  /* Remove unwanted enemies and powerups */
  flappyMonsters = flappyMonsters.filter(function(monster){ return monster.active; });
  skulls = skulls.filter(function(skull){ return skull.active; });
  flappyDragons = flappyDragons.filter(function(dragon){ return dragon.active; });
  flappyGrumpys = flappyGrumpys.filter(function(grumpy){ return grumpy.active; });
  flappyBirds = flappyBirds.filter(function(bird){ return bird.active; });
  powerUps = powerUps.filter(function(powerup){ return powerup.active; });

  // Update missiles
  // var markedForRemoval = [];
  // missiles.forEach(function(missile, i){
  //   missile.update(elapsedTime);
  //   if(Math.abs(missile.position.x - camera.x) > camera.width * 2)
  //     markedForRemoval.unshift(i);
  // });
  // // Remove missiles that have gone off-screen
  // markedForRemoval.forEach(function(index){
  //   missiles.splice(index, 1);
  // });
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
  // Includes background repeats every 1000 pixels so the level lasts longer
  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[2], 0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[1], 0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[0], 0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[2], 1000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[1], 1000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[0], 1000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[2], 2000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[1], 2000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[0], 2000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[2], 3000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[1], 3000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[0], 3000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[2], 4000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[1], 4000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[0], 4000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[2], 5000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[1], 5000, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.position.x, 0);
  ctx.drawImage(backgrounds[0], 5000, 0, canvas.width, canvas.height);
  ctx.restore();


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
    //missiles.forEach(function(missile) {
    //  missile.render(elapsedTime, ctx);
    //});

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
  ctx.save();
  ctx.translate(reticule.x, reticule.y);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2*Math.PI);
  ctx.moveTo(0, 15);
  ctx.lineTo(0, -15);
  ctx.moveTo(15, 0);
  ctx.lineTo(-15, 0);
  ctx.strokeStyle = '#00ff00';
  ctx.stroke();
  ctx.restore();
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