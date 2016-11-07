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


  


