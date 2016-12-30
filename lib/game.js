const Asteroid = require("./asteroid.js");
const Ship = require("./ship.js");
const Bullet = require("./bullet.js");

function Game() {
  this.asteroids = [];
  this.addAsteroids();
  this.bullets = [];
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
  for (let i = 0; i < this.asteroids.length; i++) {
    const asteroid = this.asteroids[i];
    if (asteroid.isCollidedWith(this.ship)) {
      this.ship.relocate();
    }

    for (let j = 0; j < this.bullets.length; j++) {
      const bullet = this.bullets[j];
      if (bullet.isCollidedWith(asteroid)) {
        this.remove(asteroid);
        this.remove(bullet);
      }
    }
  }
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.remove = function(obj) {
  let list;
  if (obj instanceof Asteroid) {
    list = this.asteroids;
  } else if (obj instanceof Bullet) {
    list = this.bullets;
  }

  const idx = list.indexOf(obj);
  list.splice(idx, 1);
};

Game.prototype.allObjects = function() {
  return this.asteroids.concat([this.ship], this.bullets);
};

Game.prototype.add = function (obj) {
  if (obj instanceof Asteroid) {
    this.asteroids.push(obj);
  } else if (obj instanceof Bullet) {
    this.bullets.push(obj);
  }
};

module.exports = Game;
