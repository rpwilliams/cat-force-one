"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const PLAYER_SPEED = 5;
const BULLET_SPEED = 10;
const MS_PER_FRAME = 1000/8;

var img1 = 'assets/enemies/flappy-cat/flying/frame-1.png';
var img2 = 'assets/enemies/flappy-cat/flying/frame-2.png';
var img3 = 'assets/enemies/flappy-cat/flying/frame-3.png';
var img4 = 'assets/enemies/flappy-cat/flying/frame-4.png';
var img5 = 'assets/enemies/flappy-cat/flying/frame-5.png';
var img6 = 'assets/enemies/flappy-cat/flying/frame-6.png';
var img7 = 'assets/enemies/flappy-cat/flying/frame-7.png';
var img8 = 'assets/enemies/flappy-cat/flying/frame-8.png';

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
function Player(bullets, missiles, weapon) {
  this.missiles = missiles;
  this.missileCount = 4;
  this.bullets = bullets;
  this.angle = 0;
  this.position = {x: 200, y: 200};
  this.velocity = {x: 0, y: 0};
  this.img = new Image()
  this.img.src = 'assets/player/flappy-cat/flying/frame-1.png';
  this.width = 64 + (64 * .5);
  this.height = 64 + (64 * .5);
  this.state = "flying";
  this.timer = 0;
  this.frame = 'frame-1';
  this.weapon = weapon;

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
            self.img.src = img1;
            break;
          case 'frame-2':
            self.frame = 'frame-3';
            self.img.src = img2;
            break;
          case 'frame-3':
            self.frame = 'frame-4';
            self.img.src = img3;
            break;
          case 'frame-4':
            self.frame = 'frame-5';
            self.img.src = img4;
            break;
          case 'frame-5':
            self.frame = 'frame-6';
            self.img.src = img5;
            break;
          case 'frame-6':
            self.frame = 'frame-7';
            self.img.src = img6;
            break;
          case 'frame-7':
            self.frame = 'frame-8';
            self.img.src = img7;
            break;
          case 'frame-8':
            self.frame = 'frame-1';
            self.img.src = img8;
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
  var self = this;
  setTimeout(function() {
    self.animate(elapsedTime);
  }, 1000
  );
  
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

  if(this.weapon === "weapon-1")
  {
    var img = new Image();
    img.src = 'assets/weapons/Turret01.png';
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
    ctx.drawImage(img, 0 + 15, 0 + 30, 28 * 2 - 10, 28 * 2);
    ctx.restore();
  }
  else if(this.weapon === "weapon-2")
  {
    var img = new Image();
    img.src = 'assets/weapons/Turret04.png';
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
    ctx.drawImage(img, 0 + 15, 0 + 30, 28 * 2 - 10, 28 * 2);
    ctx.restore();
  }
  else if(this.weapon === "weapon-3")
  {
    var img = new Image();
    img.src = 'assets/weapons/Turret06.png';
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
    ctx.drawImage(img, 0 + 15, 0 + 30, 28 * 1.5, 28 * 1.5);
    ctx.restore();
  }
  else if(this.weapon === "weapon-4")
  {
    var img = new Image();
    img.src = 'assets/weapons/Turret02.png';
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
    ctx.drawImage(img, 0 + 15, 0 + 30, 28 * 2 - 10, 28 * 2);
    ctx.restore();
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
