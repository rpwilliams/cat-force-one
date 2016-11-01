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


