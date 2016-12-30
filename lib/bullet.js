const MovingObject = require("./moving_object.js");
const Util = require("./utils.js");

function Bullet(options) {
  MovingObject.call(this, {
    pos: options["pos"],
    vel: options["vel"],
    radius: Bullet.RADIUS,
    color: Bullet.COLOR,
    game: options["game"]
  });
}

Util.inherits(Bullet, MovingObject);

Bullet.RADIUS = 3;
Bullet.COLOR = "##0000";

module.exports = Bullet;
