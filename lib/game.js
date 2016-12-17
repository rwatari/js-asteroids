const Asteroid = require("./asteroid.js");
const Ship = require("./ship.js");

function Game() {
  this.asteroids = [];
  this.addAsteroids();
  this.ship = new Ship({pos: this.randomPosition(), game: this});
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
  for (let i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].draw(ctx);
  }
};

Game.prototype.moveObjects = function() {
  for (let i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].move();
  }
};

Game.prototype.wrap = function (pos) {
  const newX = ((pos[0] % Game.DIM_X) + Game.DIM_X) % Game.DIM_X;
  const newY = ((pos[1] % Game.DIM_Y) + Game.DIM_Y) % Game.DIM_Y;
  return [newX, newY];
};

Game.prototype.checkCollisions = function() {
  for (let i = 0; i < this.allObjects().length - 1; i++) {
    for (let j = i + 1; j < this.allObjects().length; j++) {
      const obj1 = this.allObjects()[i];
      const obj2 = this.allObjects()[j];
      // ship will always be last in allObjects
      // we will never call ship.collideWith
      if (obj1.isCollidedWith(obj2)) {
        alert("COLLISION");
        obj1.collideWith(obj2);
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

Game.prototype.allObjects = function() {
  return this.asteroids.concat([this.ship]);
};

module.exports = Game;
