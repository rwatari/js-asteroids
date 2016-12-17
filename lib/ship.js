const MovingObject = require("./moving_object.js");
const Util = require("./utils.js");

function Ship(options) {
  MovingObject.call(this, {
    pos: options["pos"],
    vel: [0, 0],
    radius: Ship.RADIUS,
    color: Ship.COLOR,
    game: options["game"]
  });
}

Util.inherits(Ship, MovingObject);

Ship.prototype.relocate = function() {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

Ship.prototype.power = function(impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

Ship.RADIUS = 10;
Ship.COLOR = "#FF0000";

module.exports = Ship;
