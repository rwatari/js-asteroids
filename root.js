// document.write(require("./lib/moving_object.js"));



const Asteroid = require('./lib/asteroid.js');

const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.height = window.innerHeight;
canvasEl.width = window.innerWidth;
const ctx = canvasEl.getContext("2d");

let asteroid = new Asteroid({pos: [30, 30]});
asteroid.draw(ctx);
document.onclick = () => {
  asteroid.move();
  asteroid.draw(ctx);
};
