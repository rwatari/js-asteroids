const Util = require("./utils.js");

function MovingObject(options) {
  this.pos = options["pos"];
  this.vel = options["vel"];
  this.radius = options["radius"];
  this.color = options["color"];
  this.game = options["game"];
}

MovingObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

MovingObject.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
  this.pos = this.game.wrap(this.pos);
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  const dist = Util.distance(this.pos, otherObject.pos);
  const collisionLimit = this.radius + otherObject.radius;
  return dist < collisionLimit;
};

MovingObject.prototype.collideWith = function(otherObject) {
  this.game.remove(otherObject);
  this.game.remove(this);
};


module.exports = MovingObject;
