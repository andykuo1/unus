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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__integrated_Player_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__integrated_packet_PacketHandler_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__input_Mouse_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Renderer_js__ = __webpack_require__(6);







class ClientGame extends __WEBPACK_IMPORTED_MODULE_0__integrated_Game_js__["a" /* default */]
{
  constructor(socket, canvas)
  {
    super();

    this.socket = socket;
    this.canvas = canvas;

    this.input = new __WEBPACK_IMPORTED_MODULE_3__input_Mouse_js__["a" /* default */](document);
    this.renderer = new __WEBPACK_IMPORTED_MODULE_4__Renderer_js__["a" /* default */](canvas);

    this.thePlayer = new __WEBPACK_IMPORTED_MODULE_1__integrated_Player_js__["a" /* default */]();
    this.gameState = {};
  }

  load(callback)
  {
    console.log("Connecting client...");
    this.socket.emit('client-handshake');
  	this.socket.on('server-handshake', () => {
  		console.log("Connected to server...");
      //Add this EntityPlayer...
      this.gameState[this.socket.id] = this.thePlayer;
      //Start game...
      callback();
  	});

    this.socket.on('server-update', (data) => {
      this.onServerUpdate(this.socket, data);
    });
    this.socket.on('server-extclient', (data) => {
      for(var i in data)
      {
        //Create EntityPlayer...
        this.gameState[data[i]] = new __WEBPACK_IMPORTED_MODULE_1__integrated_Player_js__["a" /* default */]();
      }
    });
    this.socket.on('server-addclient', (data) => {
      //Create EntityPlayer...
      this.gameState[data] = new __WEBPACK_IMPORTED_MODULE_1__integrated_Player_js__["a" /* default */]();
    })
    this.socket.on('server-delclient', (data) => {
      //Delete EntityPlayer...
      delete this.gameState[data];
    });
    this.socket.on('disconnect', () => {
      window.close();
    });
  }

  update(frame)
  {
    let input = this.input.poll();
    input.timestamp = Date.now();

    //Predict state...
    this.gameState[this.socket.id].x += input.dx;
    this.gameState[this.socket.id].y += input.dy;

    //Render state...
    this.renderer.render(this.gameState);

    if (input.dx != 0 || input.dy != 0)
    {
      //Force 200ms lag...
      setTimeout(() => __WEBPACK_IMPORTED_MODULE_2__integrated_packet_PacketHandler_js__["a" /* default */].sendToServer('client-input', input, this.socket), 200);
    }
  }

  onServerUpdate(socket, data)
  {
    this.gameState = data;
  }
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
class Player
{
  constructor()
  {
    this.x = 0.0;
    this.y = 0.0;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Player);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PacketHandler
{
  constructor()
  {
  }

  static sendToServer(id, data, server)
  {
    server.emit(id, data);
  }

  static sendToClient(id, data, client)
  {
    client.emit(id, data);
  }

  static sendToAll(id, data, clients)
  {
    clients.forEach((value, key) => {
      PacketHandler.sendToClient(id, data, value);
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = (PacketHandler);


/***/ }),
/* 5 */
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
    this._prevX = 0.0;
    this._prevY = 0.0;
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

  poll()
  {
    return {
      x: this.x,
      y: this.y,
      dx: this.dx,
      dy: this.dy,
      scrollX: this.scrollX,
      scrollY: this.scrollY,
      down: this.down,
      click : this.click
    };
  }

  get dx()
  {
    var result = this.x - this._prevX;
    this._prevX = this.x;
    return result;
  }

  get dy()
  {
    var result = this.y - this._prevY;
    this._prevY = this.y;
    return result;
  }

  get click()
  {
    var result = this._click;
    this._click = false;
    return result;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Mouse);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Renderer
{
  constructor(canvas)
  {
    this.canvas = canvas;
    this.loader = document.getElementById('loader');
  }

  render(gameState)
  {
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'white';
    for(var i in gameState)
    {
      let entity = gameState[i];
      if (entity)
      {
        ctx.fillRect(entity.x - 16, entity.y - 16, 32, 32);
        //str += "<p>" + i + " : " + JSON.stringify(entity) + "</p>";
      }
    }
    //this.loader.innerHTML = str;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Renderer);


/***/ })
/******/ ]);