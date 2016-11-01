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
  var self = this;
  setTimeout(function() {
    self.animate(elapsedTime);
  }, 1000
  );
  
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


  


