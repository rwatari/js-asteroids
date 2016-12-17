/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// document.write(require("./lib/moving_object.js"));



	const GameView = __webpack_require__(5);

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);

	function MovingObject(options) {
	  this.pos = options["pos"];
	  this.vel = options["vel"];
	  this.radius = options["radius"];
	  this.color = options["color"];
	  this.game = options["game"];
	}

	MovingObject.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();

	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI
	  );
	  ctx.fill();
	};

	MovingObject.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  this.pos = this.game.wrap(this.pos);
	};

	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  const dist = Util.distance(this.pos, otherObject.pos);
	  const collisionLimit = this.radius + otherObject.radius;
	  return dist < collisionLimit;
	};

	MovingObject.prototype.collideWith = function(otherObject) {
	  
	};


	module.exports = MovingObject;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(1);
	const Ship = __webpack_require__(6);

	function Asteroid(options) {
	  MovingObject.call(this, {
	    pos: options["pos"],
	    vel: Util.randomVec(5),
	    radius: Asteroid.RADIUS,
	    color: Asteroid.COLOR,
	    game: options["game"]
	  });
	}

	Util.inherits(Asteroid, MovingObject);

	Asteroid.prototype.collideWith = function(otherObject) {
	  if (otherObject instanceof Ship) {
	    otherObject.relocate();
	  }
	};

	Asteroid.COLOR = "#0000FF";
	Asteroid.RADIUS = 20;

	module.exports = Asteroid;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = {
	  inherits (childClass, parentClass) {
	    function Surrogate () {}
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate();
	    childClass.prototype.constructor = childClass;
	  },

	  // Return a randomly oriented vector with the given length.
	  randomVec (length) {
	    const deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },

	  distance (pos1, pos2) {
	    const diffX = pos1[0] - pos2[0];
	    const diffY = pos1[1] - pos2[1];
	    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
	  }
	};

	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(2);
	const Ship = __webpack_require__(6);

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
	        // alert("COLLISION");
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(4);

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(1);
	const Util = __webpack_require__(3);

	function Ship(options) {
	  MovingObject.call(this, {
	    pos: options["pos"],
	    vel: [0, 0],
	    radius: Ship.RADIUS,
	    color: Ship.COLOR,
	    game: options["game"]
	  });
	}

	Util.inherits(Ship, MovingObject);

	Ship.prototype.relocate = function() {
	  this.pos = this.game.randomPosition();
	  this.vel = [0, 0];
	};

	Ship.prototype.power = function(impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};

	Ship.RADIUS = 10;
	Ship.COLOR = "#FF0000";

	module.exports = Ship;


/***/ }
/******/ ]);