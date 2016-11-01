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
  // move the player
  this.velocity.x += PLAYER_SPEED;
  this.position.x += PLAYER_SPEED;
  this.active = this.active;

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
FlappyDragon.prototype.render = function(elapsedTime, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, 0, 0, this.width, this.height);
  ctx.restore();
}


  


