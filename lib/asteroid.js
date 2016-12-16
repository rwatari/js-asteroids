const Util = require("./utils.js");
const MovingObject = require("./moving_object.js");

function Asteroid(options) {
  MovingObject.call(this, {
    pos: options["pos"],
    vel: Util.randomVec(1),
    radius: Asteroid.RADIUS,
    color: Asteroid.COLOR,
    game: options["game"]
  });
}

Asteroid.COLOR = "#0000FF";
Asteroid.RADIUS = 20;

Util.inherits(Asteroid, MovingObject);

module.exports = Asteroid;
