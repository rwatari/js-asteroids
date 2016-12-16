const Asteroid = require("./asteroid.js");

function Game() {
  this.asteroids = [];
  this.addAsteroids();
}

Game.DIM_X = 800;
Game.DIM_Y = 600;
Game.NUM_ASTEROIDS = 10;

Game.prototype.addAsteroids = function() {
  for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
    let asteroid = new Asteroid({pos: this.randomPosition(), game: this});
    this.asteroids.push(asteroid);
  }
};

Game.prototype.randomPosition = function() {
  const posX = Math.floor(Math.random()*Game.DIM_X);
  const posY = Math.floor(Math.random()*Game.DIM_Y);
  return [posX, posY];
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  for (let i = 0; i < this.asteroids.length; i++) {
    this.asteroids[i].draw(ctx);
  }
};

Game.prototype.moveObjects = function() {
  for (let i = 0; i < this.asteroids.length; i++) {
    this.asteroids[i].move();
  }
};

Game.prototype.wrap = function (pos) {
  const newX = ((pos[0] % Game.DIM_X) + Game.DIM_X) % Game.DIM_X;
  const newY = ((pos[1] % Game.DIM_Y) + Game.DIM_Y) % Game.DIM_Y;
  return [newX, newY];
};

Game.prototype.checkCollisions = function() {
  for (let i = 0; i < this.asteroids.length - 1; i++) {
    for (let j = i + 1; j < this.asteroids.length; j++) {
      const ast1 = this.asteroids[i];
      const ast2 = this.asteroids[j];
      if (ast1.isCollidedWith(ast2)) {
        alert("COLLISION");
        ast1.collideWith(ast2);
      }
    }
  }
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.remove = function(asteroid) {
  const asteroidIndex = this.asteroids.indexOf(asteroid);
  this.asteroids.splice(asteroidIndex, 1);
};



module.exports = Game;
