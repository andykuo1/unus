/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__client_ClientGame_js__ = __webpack_require__(1);


//Window Setup
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}, true);
window.onload = start;

//Application setup
var socket = io();
var game;
function start()
{
  game = new __WEBPACK_IMPORTED_MODULE_0__client_ClientGame_js__["a" /* default */](socket, canvas);
	onApplicationLoad(game);
}

//Update the application
const frame = {delta: 0, then: 0, count: 0};
function update(now = 0)
{
	now *= 0.001;
	frame.delta = now - frame.then;
	frame.then = now;
	++frame.count;
  game.update(frame);
	onApplicationUpdate(game, frame);

  //Call again...
	requestAnimationFrame(update);
}

//Display frames per second
setInterval(function(){
	console.log("FPS: " + frame.count);
	frame.count = 0;
}, 1000);

/******************************************************************************/

/**
 * Called when game is loaded, but before the game loop
 */
function onApplicationLoad(app)
{
	console.log("Loading client...");
	app.load(() => {
		update();
	});
}

/**
 * Called every tick by the game loop
 */
function onApplicationUpdate(app, frame)
{

}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__integrated_Game_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__integrated_GameState_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Mouse_js__ = __webpack_require__(4);





class ClientGame extends __WEBPACK_IMPORTED_MODULE_0__integrated_Game_js__["a" /* default */]
{
  constructor(socket, canvas)
  {
    super();

    this.socket = socket;
    this.canvas = canvas;

    this.input = new __WEBPACK_IMPORTED_MODULE_2__Mouse_js__["a" /* default */](document);

    this.gameState = new __WEBPACK_IMPORTED_MODULE_1__integrated_GameState_js__["a" /* default */]();
    this.nextState = new __WEBPACK_IMPORTED_MODULE_1__integrated_GameState_js__["a" /* default */]();
  }

  load(callback)
  {
    console.log("Connecting client...");
    this.socket.emit('client-handshake');
  	this.socket.on('server-handshake', () => {
  		console.log("Connected to server...");
      callback();
  	});
    this.socket.on('server-update', (data) => {
      this.onServerUpdate(this.socket, data);
    });
    this.socket.on('disconnect', () => {
      window.close();
    });
  }

  update(frame)
  {
    //Poll nextState from Server
    //---

    //Update from nextState
    //---

    //Poll gameState from Input
    //---

    //Do Predictive GameLoop (based on current gameState)
    //---

    //RENDER!

    //Send GameState to Server
    sendToServer('client-update', this.input, this.socket);
  }

  onServerUpdate(socket, data)
  {
    console.log("SERVER: " + data);
  }
}

function sendToServer(id, data, socket)
{
  socket.emit(id, data);
}

/* harmony default export */ __webpack_exports__["a"] = (ClientGame);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Game
{
  constructor()
  {
    this.entities = [];
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Represents any synchronized world state data across the network.
 * Updated and sent at the end of every game loop.
 */
class GameState
{
  constructor()
  {
    this.data = {};
    this.dirty = {};
  }

  /**
   * Set the data with id to the value passed-in.
   * If client-side, will be marked to be sent to the server.
   * If server-side, will be marked to be sent to all clients.
   */
  setData(id, value)
  {
    this.data[id] = value;
    this.dirty[id] = true;
  }

  removeData(id)
  {
    this.data.remove(id);
    this.dirty.remove(id);
  }

  getData(id)
  {
    return this.data[id];
  }

  /**
   * Mark the data to be sent to the opposite side.
   * Should already be marked if called setData().
   */
  markDirty(id)
  {
    this.dirty[id] = true;
  }

  /**
   * Whether or not the side has already resolved this data if changed.
   */
  isDirty(id)
  {
    return this.dirty[id];
  }

  /**
   * Gets all data that has changed since and put them in 'state'.
   * All changes before this call is considered as resolved.
   */
  poll(state)
  {}

  /**
   * Puts all data that is different from the nextState into this state.
   * Changes will be marked as unresolved. Call poll(state) to resolve them.
   */
  update(nextState)
  {}

  /**
   * Empty the state of any data, changed or not.
   */
  clear()
  {}
}

/* harmony default export */ __webpack_exports__["a"] = (GameState);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Mouse
{
  /**
   * constructor - Creates and registers this with the element to listen for
   * mouse events
   *
   * @param {type} canvas  The canvas to calculate appropriate mouse position
   * @param {type} element The element to listen for mouse events
   */
  constructor(element)
  {
    this.x = 0.0;
    this.y = 0.0;
    this.scrollX = 0.0;
    this.scrollY = 0.0;
    this.down = false;

    this._click = false;
    this._element = element;

    var self = this;
    this.onMouseUp = function(event)
    {
      let screen = canvas.getBoundingClientRect();
      self.x = event.clientX - screen.left;
      self.y = event.clientY - screen.top;
      self.down = false;
    }
    this.onMouseDown = function(event)
    {
      let screen = canvas.getBoundingClientRect();
      self.x = event.clientX - screen.left;
      self.y = event.clientY - screen.top;
      self.down = true;
    }
    this.onMouseClick = function(event)
    {
      let screen = canvas.getBoundingClientRect();
      self.x = event.clientX - screen.left;
      self.y = event.clientY - screen.top;
      self._click = true;
    }
    this.onMouseWheel = function(event)
    {
      self.scrollX = event.deltaX;
      self.scrollY = event.deltaY;
    }
    this.onMouseMove = function(event)
    {
      let screen = canvas.getBoundingClientRect();
      self.x = event.clientX - screen.left;
      self.y = event.clientY - screen.top;
    }
    this.onTouchStart = function(event)
    {
      var target = event.touches[0].target;
      target.addEventListener('touchmove', self.onTouchMove);
      target.addEventListener('touchend', self.onTouchStop);
      target.addEventListener('touchcancel', self.onTouchStop);
    }
    this.onTouchStop = function(event)
    {
      var target = event.touches[0].target;
      target.removeEventListener('touchmove', self.onTouchMove);
      target.removeEventListener('touchend', self.onTouchStop);
      target.removeEventListener('touchcancel', self.onTouchStop);
    }
    this.onTouchMove = function(event)
    {
      let screen = canvas.getBoundingClientRect();
      self.x = event.touches[0].clientX - screen.left;
      self.y = event.touches[0].clientY - screen.right;
    }

    this._element.addEventListener('mouseup', this.onMouseUp);
    this._element.addEventListener('mousedown', this.onMouseDown);
    this._element.addEventListener('click', this.onMouseClick);
    this._element.addEventListener('wheel', this.onMouseWheel);
    this._element.addEventListener('mousemove', this.onMouseMove);
    this._element.addEventListener('touchstart', this.onTouchStart);
  }

  destroy()
  {
    this._element.removeEventListener('mouseup', this.onMouseUp);
    this._element.removeEventListener('mousedown', this.onMouseDown);
    this._element.removeEventListener('click', this.onMouseClick);
    this._element.removeEventListener('wheel', this.onMouseWheel);
    this._element.removeEventListener('mousemove', this.onMouseMove);
    this._element.removeEventListener('touchstart', this.onTouchStart);
  }

  get click()
  {
    var result = this._click;
    this._click = false;
    return result;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Mouse);


/***/ })
/******/ ]);