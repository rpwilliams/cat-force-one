"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Vector = require('./vector');
const Camera = require('./camera');
const Player = require('./player');
const BulletPool = require('./bullet_pool');
const FlappyMonster = require('./flappy-monster')


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
var player = new Player(bullets, missiles);
var backgrounds = [
  new Image(),
  new Image(),
  new Image
];
var flappyMonsters = [];
// Public domain: http://opengameart.org/content/ruined-city-background
backgrounds[0].src = 'assets/city-foreground.png';
backgrounds[1].src = 'assets/city-background.png';
backgrounds[2].src = 'assets/city-sky.png';


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

function init()
{
  flappyMonsters.push(new FlappyMonster(0, 0));
  flappyMonsters.push(new FlappyMonster(100, 400));
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

  // Update the flappy monsters
  flappyMonsters.forEach(function(monster){
    monster.update(elapsedTime);
  });

  // Update the flappy monsters
  flappyMonsters.forEach(function(monster){
    if(checkCollision(player, monster))
    {
      console.log("Collision!");
      console.log("Player: " + "(" + player.position.x + "," + player.position.y + ")");
      console.log("Flappy monster: (" + monster.position.x
        + "," + monster.position.y + ")");
    }
  });

  //console.log("Player: " + "(" + player.position.x + "," + player.position.y + ")");

  //console.log("Flappy monster: (" + flappyMonsters[1].position.x
  //   + "," + flappyMonsters[1].position.y + ")");

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
  //ctx.fillStyle = "black";
  //ctx.fillRect(0, 0, 1024, 786);

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

    // Render the flappy monsters
    flappyMonsters.forEach(function(FlappyMonster){
      FlappyMonster.render(elapsedTime, ctx);
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