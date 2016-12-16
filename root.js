// document.write(require("./lib/moving_object.js"));



const MovingObject = require('./lib/moving_object.js');

const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.height = window.innerHeight;
canvasEl.width = window.innerWidth;
const ctx = canvasEl.getContext("2d");
let circle = new MovingObject({ pos: [30, 30], vel: [10, 10], radius: 5, color: "#00FF00"});
circle.draw(ctx);
document.onclick = () => {
  circle.move();
  circle.draw(ctx);
};
// new MovingObject(
//   canvasEl.width,
//   canvasEl.height
// ).start(canvasEl);
