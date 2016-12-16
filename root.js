// document.write(require("./lib/moving_object.js"));



const GameView = require('./lib/game_view.js');

document.addEventListener("DOMContentLoaded", function(event) {
  const canvasEl = document.getElementById("game-canvas");
  // canvasEl.height = window.innerHeight;
  // canvasEl.width = window.innerWidth;
  const ctx = canvasEl.getContext("2d");
  const gameView = new GameView(ctx);
  gameView.start();
  // document.onclick = () => {
  //   game.moveObjects();
  //   game.draw(ctx);
  // };
});
