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



	const GameView = __webpack_require__(1);

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

	const Game = __webpack_require__(2);

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
	  const ship = this.game.ship;
	  key('up', function() {ship.power([0,-1]);});
	  key('left', function() {ship.power([-1,0]);});
	  key('right', function() {ship.power([1,0]);});
	  key('down', function() {ship.power([0,1]);});
	  key('space', function() {ship.fireBullet();});
	};

	GameView.prototype.animate = function(currentTime) {
	  const delta = currentTime - this.lastTime;

	  this.game.step(delta);
	  this.game.draw(this.ctx);
	  this.lastTime = currentTime;

	  requestAnimationFrame(this.animate.bind(this));
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Ship = __webpack_require__(6);
	const Bullet = __webpack_require__(7);

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
	  const posX = Math.random()*Game.DIM_X;
	  const posY = Math.random()*Game.DIM_Y;
	  return [posX, posY];
	};

	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  for (let i = 0; i < this.allObjects().length; i++) {
	    this.allObjects()[i].draw(ctx);
	  }
	};

	Game.prototype.moveObjects = function(delta) {
	  const objects = this.allObjects();
	  for (let i = 0; i < objects.length; i++) {
	    objects[i].move(delta);
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

	Game.prototype.step = function(delta) {
	  this.moveObjects(delta);
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
	  return this.asteroids.concat(this.ship, this.bullets);
	};

	Game.prototype.add = function (obj) {
	  if (obj instanceof Asteroid) {
	    this.asteroids.push(obj);
	  } else if (obj instanceof Bullet) {
	    this.bullets.push(obj);
	  }
	};

	Game.prototype.isOutOfBounds = function(pos) {
	  const x = pos[0];
	  const y = pos[1];
	  return (x < 0 || x > Game.DIM_X || y < 0 || y > Game.DIM_Y);
	};

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const MovingObject = __webpack_require__(5);

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

	Asteroid.COLOR = "#0000FF";
	Asteroid.RADIUS = 20;

	module.exports = Asteroid;


/***/ },
/* 4 */
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

	  unit (vec, m = 1) {
	    const mag = m / Util.magnitude(vec);
	    return Util.scale(vec, mag);
	  },

	  magnitude (vec) {
	    return Math.hypot(vec[0], vec[1]);
	  },

	  distance (pos1, pos2) {
	    const diffX = pos1[0] - pos2[0];
	    const diffY = pos1[1] - pos2[1];
	    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
	  }
	};

	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);

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

	MovingObject.prototype.move = function(delta) {
	  this.pos[0] += this.vel[0] * delta / 20;
	  this.pos[1] += this.vel[1] * delta / 20;
	  if (this.game.isOutOfBounds(this.pos)) {
	    if (this.isWrappable) {
	      this.pos = this.game.wrap(this.pos);
	    } else {
	      this.game.remove(this);
	    }
	  }
	};

	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  const dist = Util.distance(this.pos, otherObject.pos);
	  const collisionLimit = this.radius + otherObject.radius;
	  return dist < collisionLimit;
	};

	MovingObject.prototype.isWrappable = true;

	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Util = __webpack_require__(4);
	const Bullet = __webpack_require__(7);

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

	Ship.prototype.fireBullet = function() {
	  let bulletVel;
	  if (Util.magnitude(this.vel) === 0) {
	    bulletVel = [0, 5];
	  } else {
	    bulletVel = Util.unit(this.vel, 5);
	  }

	  const bullet = new Bullet({
	    pos: this.pos.slice(),
	    vel: bulletVel,
	    game: this.game,
	  });
	  this.game.add(bullet);
	};

	Ship.RADIUS = 10;
	Ship.COLOR = "#FF0000";

	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Util = __webpack_require__(4);

	function Bullet(options) {
	  MovingObject.call(this, {
	    pos: options["pos"],
	    vel: options["vel"],
	    radius: Bullet.RADIUS,
	    color: Bullet.COLOR,
	    game: options["game"]
	  });
	}

	Util.inherits(Bullet, MovingObject);

	Bullet.RADIUS = 3;
	Bullet.COLOR = "#000000";

	Bullet.prototype.isWrappable = false;

	module.exports = Bullet;


/***/ }
/******/ ]);