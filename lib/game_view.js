const Game = require("./game.js");

function GameView(ctx) {
  this.game = new Game();
  this.ctx = ctx;
  this.lastTime = 0;
}

GameView.prototype.start = function() {
  this.bindKeyHandlers();
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.bindKeyHandlers = function () {
  const game = this.game;
  key('up', function() {game.ship.power([0,-1]);});
  key('left', function() {game.ship.power([-1,0]);});
  key('right', function() {game.ship.power([1,0]);});
  key('down', function() {game.ship.power([0,1]);});
  key('space', function() {game.ship.fireBullet();});
};

GameView.prototype.animate = function(currentTime) {
  const delta = currentTime - this.lastTime;

  this.game.step(delta);
  this.game.draw(this.ctx);
  this.lastTime = currentTime;

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
