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
var player = new Player(bullets, missiles, "weapon-1");
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
 */
function init()
{
  // http://opengameart.org/content/ruined-city-background (public domain)
  backgrounds[0].src = 'assets/city-foreground.png';
  backgrounds[1].src = 'assets/city-background.png';
  backgrounds[2].src = 'assets/city-sky.png';

  powerUps.push(new Powerup(50,50));
  powerUps.push(new Powerup(1000,50));
  powerUps.push(new Powerup(2000,50));
  powerUps.push(new Powerup(3000,50));
  powerUps.push(new Powerup(4000,50));


  flappyMonsters.push(new FlappyMonster(0, 0));
  flappyMonsters.push(new FlappyMonster(500, 20));
  flappyMonsters.push(new FlappyMonster(1000, 80));
  flappyMonsters.push(new FlappyMonster(1500, 400));
  flappyMonsters.push(new FlappyMonster(2000, 225));
  flappyMonsters.push(new FlappyMonster(3000, 225));

  skulls.push(new Skull(50, 70, canvas));
  skulls.push(new Skull(1000, 200, canvas));
  skulls.push(new Skull(2000, 10, canvas));
  skulls.push(new Skull(500, 70, canvas));
  skulls.push(new Skull(4000, 10, canvas));
  skulls.push(new Skull(5000, 10, canvas));

  flappyDragons.push(new FlappyDragon(5000, 50));
  flappyDragons.push(new FlappyDragon(4500, 100));
  flappyDragons.push(new FlappyDragon(4000, 60));
  flappyDragons.push(new FlappyDragon(3500, 500));
  flappyDragons.push(new FlappyDragon(5000, 700));
  flappyDragons.push(new FlappyDragon(4000, 10));
  flappyDragons.push(new FlappyDragon(5000, 200));
  flappyDragons.push(new FlappyDragon(10000, 50));
  flappyDragons.push(new FlappyDragon(9000, 100));
  flappyDragons.push(new FlappyDragon(8000, 60));
  flappyDragons.push(new FlappyDragon(7000, 500));
  flappyDragons.push(new FlappyDragon(6000, 700));
  flappyDragons.push(new FlappyDragon(10000, 10));
  flappyDragons.push(new FlappyDragon(10000, 200));
  flappyDragons.push(new FlappyDragon(11000, 10));
  flappyDragons.push(new FlappyDragon(11000, 200));
  flappyDragons.push(new FlappyDragon(12000, 10));
  flappyDragons.push(new FlappyDragon(12000, 200));

  flappyGrumpys.push(new FlappyGrumpy(5000, 300));
  flappyGrumpys.push(new FlappyGrumpy(6000, 200));
  flappyGrumpys.push(new FlappyGrumpy(1000, 0));
  flappyGrumpys.push(new FlappyGrumpy(2000, 150));
  flappyGrumpys.push(new FlappyGrumpy(7000, 80));
  flappyGrumpys.push(new FlappyGrumpy(4000, 190));

  flappyBirds.push(new FlappyBird(5250, 400, canvas));
  flappyBirds.push(new FlappyBird(5250, 0, canvas));

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
    if(!camera.onScreen(bullet)) return true;
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
      player.frame = "frame-1";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
    }
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
      player.frame = "frame-1";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
    }
  });

  // Update the flappy dragons
  flappyDragons.forEach(function(dragon){
    dragon.update(elapsedTime);
    if(checkCollision(player, dragon))
    {
      player.state = "hit";
      player.frame = "frame-1";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      console.log("Dragon collision! ROAR");
    }
  });

  // Update the flappy grumpys
  flappyGrumpys.forEach(function(grumpy){
    grumpy.update(elapsedTime);
    if(checkCollision(player, grumpy))
    {
      player.state = "hit";
      player.frame = "frame-1";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      console.log("Grumpy collision! That should make you grumpy.");
    }
  });

  // Update the flappy grumpys
  flappyBirds.forEach(function(bird){
    bird.update(elapsedTime);
    if(checkCollision(player, bird))
    {
      player.state = "hit";
      player.frame = "frame-1";
      player.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
      bird.state = "hit";
      bird.frame = "frame-1";
      bird.img.src = 'assets/enemies/flappy-bird/hit/frame-1.png';
      console.log("Bird collision! That bird flew the coop!");
    }
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