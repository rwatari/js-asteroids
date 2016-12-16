// document.write(require("./lib/moving_object.js"));



const Game = require('./lib/game.js');

const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.height = window.innerHeight;
canvasEl.width = window.innerWidth;
const ctx = canvasEl.getContext("2d");

let game = new Game();
game.draw(ctx);
document.onclick = () => {
  game.moveObjects();
  game.draw(ctx);
};
