(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var skulls = [];
var flappyDragons = [];
var flappyGrumpys = [];
var flappyBirds = [];

// http://opengameart.org/content/ruined-city-background (public domain)
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
},{"./bullet_pool":2,"./camera":3,"./flappy-bird":4,"./flappy-dragon":5,"./flappy-grumpy":6,"./flappy-monster":7,"./game":8,"./player":9,"./skull":10,"./vector":11}],2:[function(require,module,exports){
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
  ctx.fillStyle = "black";
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
  this.xMax = 1000;
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

  if(self.x < 0) self.x = 0;
}

/**
 * @function onscreen
 * Determines if an object is within the camera's gaze
 * @param {Vector} target a point in the world
 * @return true if target is on-screen, false if not
 */
Camera.prototype.onScreen = function(target) {
  return (
     target.x > this.x &&
     target.x < this.x + this.width &&
     target.y > this.y &&
     target.y < this.y + this.height
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

},{"./vector":11}],4:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const PLAYER_SPEED = -.5;
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
function FlappyBird(xPos, yPos, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.img = new Image();
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  this.img.src = 'assets/enemies/flappy-bird/flying/frame-1.png';
  this.timer = 0;
  this.state = "flying";
  this.height = 128 * 3;
  this.width = 128 * 3;
  this.initialAcceleration = true; 

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
            self.img.src = 'assets/enemies/flappy-bird/flying/frame-2.png';
            break;
          case 'frame-2':
            self.frame = 'frame-3';
            self.img.src = 'assets/enemies/flappy-bird/flying/frame-3.png';
            break;
          case 'frame-3':
            self.frame = 'frame-4';
            self.img.src = 'assets/enemies/flappy-bird/flying/frame-4.png';
            break;
          case 'frame-4':
            self.frame = 'frame-1';
            self.img.src = 'assets/enemies/flappy-bird/flying/frame-1.png';
            break;
        }
      }
      else
      {
        switch(self.frame)
        {
          case 'frame-1':
            self.frame = 'frame-2';
            self.img.src = 'assets/enemies/flappy-bird/got hit/frame-2.png';
            break;
          case 'frame-2':
            self.frame = 'frame-1';
            self.img.src = 'assets/enemies/flappy-bird/got hit/frame-1.png';
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
FlappyBird.prototype.render = function(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  //ctx.rotate(-this.angle);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}


  



},{"./vector":11}],5:[function(require,module,exports){
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
function FlappyDragon(xPos, yPos) {
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.img = new Image();
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  this.img.src = 'assets/enemies/flappy-dragon/frame-1.png';
  this.timer = 0;
  this.height = 64;
  this.width = 64;

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
          self.img.src = 'assets/enemies/flappy-dragon/frame-2.png';
          break;
        case 'frame-2':
          self.frame = 'frame-3';
          self.img.src = 'assets/enemies/flappy-dragon/frame-3.png';
          break;
        case 'frame-3':
          self.frame = 'frame-4';
          self.img.src = 'assets/enemies/flappy-dragon/frame-4.png';
          break;
        case 'frame-4':
          self.frame = 'frame-1';
          self.img.src = 'assets/enemies/flappy-dragon/frame-1.png';
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
  // move the player
  this.velocity.x += PLAYER_SPEED;
  this.position.x += PLAYER_SPEED;

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
FlappyDragon.prototype.render = function(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}


  



},{"./vector":11}],6:[function(require,module,exports){
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
function FlappyGrumpy(xPos, yPos) {
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.img = new Image();
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  this.img.src = 'assets/enemies/flappy-grumpy/frame-1.png';
  this.timer = 0;
  this.height = 64;
  this.width = 64;

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
          self.img.src = 'assets/enemies/flappy-grumpy/frame-2.png';
          break;
        case 'frame-2':
          self.frame = 'frame-3';
          self.img.src = 'assets/enemies/flappy-grumpy/frame-3.png';
          break;
        case 'frame-3':
          self.frame = 'frame-4';
          self.img.src = 'assets/enemies/flappy-grumpy/frame-4.png';
          break;
        case 'frame-4':
          self.frame = 'frame-5';
          self.img.src = 'assets/enemies/flappy-grumpy/frame-5.png';
          break;
        case 'frame-5':
          self.frame = 'frame-6';
          self.img.src = 'assets/enemies/flappy-grumpy/frame-6.png';
          break;
        case 'frame-6':
          self.frame = 'frame-7';
          self.img.src = 'assets/enemies/flappy-grumpy/frame-7.png';
          break;
        case 'frame-7':
          self.frame = 'frame-8';
          self.img.src = 'assets/enemies/flappy-grumpy/frame-8.png';
          break;
        case 'frame-8':
          self.frame = 'frame-1';
          self.img.src = 'assets/enemies/flappy-grumpy/frame-1.png';
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


  



},{"./vector":11}],7:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const PLAYER_SPEED = 1;
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
function FlappyMonster(xPos, yPos) {
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.img = new Image();
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  this.img.src = 'assets/enemies/flappy-monster/frame-1.png';
  this.timer = 0;
  this.height = 64;
  this.width = 64;

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
          self.img.src = 'assets/enemies/flappy-monster/frame-2.png';
          break;
        case 'frame-2':
          self.frame = 'frame-3';
          self.img.src = 'assets/enemies/flappy-monster/frame-3.png';
          break;
        case 'frame-3':
          self.frame = 'frame-4';
          self.img.src = 'assets/enemies/flappy-monster/frame-4.png';
          break;
        case 'frame-4':
          self.frame = 'frame-5';
          self.img.src = 'assets/enemies/flappy-monster/frame-5.png';
          break;
        case 'frame-5':
          self.frame = 'frame-6';
          self.img.src = 'assets/enemies/flappy-monster/frame-6.png';
          break;
        case 'frame-6':
          self.frame = 'frame-7';
          self.img.src = 'assets/enemies/flappy-monster/frame-7.png';
          break;
        case 'frame-7':
          self.frame = 'frame-8';
          self.img.src = 'assets/enemies/flappy-monster/frame-8.png';
          break;
        case 'frame-8':
          self.frame = 'frame-1';
          self.img.src = 'assets/enemies/flappy-monster/frame-1.png';
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
FlappyMonster.prototype.render = function(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}


  



},{"./vector":11}],8:[function(require,module,exports){
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

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const PLAYER_SPEED = 5;
const BULLET_SPEED = 10;
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
function Player(bullets, missiles) {
  this.missiles = missiles;
  this.missileCount = 4;
  this.bullets = bullets;
  this.angle = 0;
  this.position = {x: 200, y: 200};
  this.velocity = {x: 0, y: 0};
  this.img = new Image()
  //this.img.src = 'assets/player/flappy-cat/flying/frame-1.png';
  this.width = 64;
  this.height = 64;
  this.state = "flying";
  this.timer = 0;
  this.frame = 'frame-1';

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
            self.img.src = 'assets/enemies/flappy-cat/flying/frame-1.png';
            break;
          case 'frame-2':
            self.frame = 'frame-3';
            self.img.src = 'assets/enemies/flappy-cat/flying/frame-2.png';
            break;
          case 'frame-3':
            self.frame = 'frame-4';
            self.img.src = 'assets/enemies/flappy-cat/flying/frame-3.png';
            break;
          case 'frame-4':
            self.frame = 'frame-5';
            self.img.src = 'assets/enemies/flappy-cat/flying/frame-4.png';
            break;
          case 'frame-5':
            self.frame = 'frame-6';
            self.img.src = 'assets/enemies/flappy-cat/flying/frame-5.png';
            break;
          case 'frame-6':
            self.frame = 'frame-7';
            self.img.src = 'assets/enemies/flappy-cat/flying/frame-6.png';
            break;
          case 'frame-7':
            self.frame = 'frame-8';
            self.img.src = 'assets/enemies/flappy-cat/flying/frame-7.png';
            break;
          case 'frame-8':
            self.frame = 'frame-1';
            self.img.src = 'assets/enemies/flappy-cat/flying/frame-8.png';
            break;
        }
      }
      else
      {
        switch(self.frame)
        {
          case 'frame-1':
            self.frame = 'frame-2';
            self.img.src = 'assets/enemies/flappy-cat/hit/frame-2.png';
            break;
          case 'frame-2':
            self.frame = 'frame-1';
            self.img.src = 'assets/enemies/flappy-cat/hit/frame-1.png';
            break;
        }
      }
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
  if(input.left) this.velocity.x -= PLAYER_SPEED;
  if(input.right) this.velocity.x += PLAYER_SPEED;
  this.velocity.y = 0;
  if(input.up) this.velocity.y -= PLAYER_SPEED / 2;
  if(input.down) this.velocity.y += PLAYER_SPEED / 2;

  // determine player angle
  this.angle = 0;
  if(this.velocity.x < 0) this.angle = -1;
  if(this.velocity.x > 0) this.angle = 1;

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
Player.prototype.render = function(elapasedTime, ctx, camera) {
  //var offset = this.angle * 23;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);

  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
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
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */
Player.prototype.fireMissile = function() {
  if(this.missileCount > 0){
    var position = Vector.add(this.position, {x:0, y:30})
    var missile = new Missile(position);
    this.missiles.push(missile);
    this.missileCount--;
  }
}

},{"./vector":11}],10:[function(require,module,exports){
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
function Skull(xPos, yPos, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.angle = 0;
  this.position = {x: xPos, y: yPos};
  this.velocity = {x: 0, y: 0};
  this.img = new Image();
  this.frame = "frame-1";
  // http://opengameart.org/content/flappy-monster-sprite-sheets (public domain)
  this.img.src = 'assets/enemies/skull/idle/frame-1.png';
  this.timer = 0;
  this.state = "idle";
  this.height = 64;
  this.width = 64;
  this.initialAcceleration = true; 

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
            self.img.src = 'assets/enemies/skull/idle/frame-2.png';
            break;
          case 'frame-2':
            self.frame = 'frame-1';
            self.img.src = 'assets/enemies/skull/idle/frame-1.png';
            break;
        }
      }
      else
      {
        self.frame = 'frame-3';
        self.img.src = 'assets/enemies/skull/hit/frame.png';
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


  



},{"./vector":11}],11:[function(require,module,exports){
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
