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
  this.x = 0;
  this.y = 0;
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
  console.log(self.xOff, self.xMax, self.xOff > self.xMax);
  if(self.xOff > self.xMax) {
    self.x += self.xOff - self.xMax;
    self.xOff = self.xMax;
  }
  if(self.xOff < self.xMin) {
    self.x -= self.xMin - self.xOff;
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
