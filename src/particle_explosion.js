"use strict";

module.exports = exports = Explosion;

const Particle = require('./particle');

/* Array of particles (global variable)
*/
var particles = [];

/*
 * Basic Explosion, all particles move and shrink at the same speed.
 * 
 * Parameter : explosion center
 */
function Explosion(x, y)
{
	// creating 4 particles that scatter at 0, 90, 180 and 270 degrees
	for (var angle=0; angle<360; angle+=90)
	{
		var particle = new Particle();

		// particle will start at explosion center
		particle.x = x;
		particle.y = y;

		particle.color = "#FF0000";

		var speed = 50.0;

		// velocity is rotated by "angle"
		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

		// adding the newly created particle to the "particles" array
		particles.push(particle);
	}
}

Explosion.prototype.update = function(elapsedTime)
{
	// draw a white background to clear canvas
	//ctx.fillStyle = "#FFF";
	//ctx.fillRect(0, 0, canvas.width, canvas.height);

	// update and draw particles
	for (var i=0; i<particles.length; i++)
	{
		var particle = particles[i];

		particle.update(elapsedTime);
	}
}

Explosion.prototype.render = function(elapsedTime, ctx)
{
	// draw a white background to clear canvas
	//ctx.fillStyle = "#FFF";
	//ctx.fillRect(0, 0, canvas.width, canvas.height);

	// update and draw particles
	for (var i=0; i<particles.length; i++)
	{
		var particle = particles[i];

		particle.render(ctx);
	}
}