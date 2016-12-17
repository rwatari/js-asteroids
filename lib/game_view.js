const Game = require("./game.js");

function GameView(ctx) {
  this.game = new Game();
  this.ctx = ctx;
}

GameView.prototype.start = function() {
  const that = this;
  setInterval(function() {
    that.game.step();
    that.game.draw(that.ctx);
  }, 20);
  this.bindKeyHandlers();
};

GameView.prototype.bindKeyHandlers = function () {
  const game = this.game;
  key('up', function() {game.ship.power([0,-1]);});
  key('left', function() {game.ship.power([-1,0]);});
  key('right', function() {game.ship.power([1,0]);});
  key('down', function() {game.ship.power([0,1]);});
};

module.exports = GameView;
