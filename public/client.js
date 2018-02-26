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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function init(canvas)
{
  console.log("Initializing WebGL...");
  var gl = canvas.getContext('webgl');
  if (!gl) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
  console.log("Found WebGL " + gl.VERSION);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  return gl;
}

//TODO: assumes canvas is a global variable...
/* harmony default export */ __webpack_exports__["a"] = (init(canvas));


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mogli_gl_js__ = __webpack_require__(0);


class ViewPort
{
  constructor(canvas)
  {
    this.canvas = canvas;
  }

  update()
  {
    __WEBPACK_IMPORTED_MODULE_0__mogli_gl_js__["a" /* default */].clear(__WEBPACK_IMPORTED_MODULE_0__mogli_gl_js__["a" /* default */].COLOR_BUFFER_BIT | __WEBPACK_IMPORTED_MODULE_0__mogli_gl_js__["a" /* default */].DEPTH_BUFFER_BIT);
    __WEBPACK_IMPORTED_MODULE_0__mogli_gl_js__["a" /* default */].viewport(0, 0, this.width, this.height);
  }

  get width()
  {
    return this.canvas.clientWidth;
  }

  get height()
  {
    return this.canvas.clientHeight;
  }

  static getPointFromScreen(dst, camera, viewport, screenX, screenY)
  {
    let invViewProj = getInvertedViewProjection(mat4.create(), camera);
    let x = screenX;
    let y = viewport.height - screenY;

    //TODO: The depth should be 0 if perspective...
    let near = unproject(vec3.create(), invViewProj, viewport, x, y, -1.0);
    let far = unproject(vec3.create(), invViewProj, viewport, x, y, 1.0);

    let f = (0 - near[2]) / (far[2] - near[2]);
    dst[0] = (near[0] + f * (far[0] - near[0]));
    dst[1] = (near[1] + f * (far[1] - near[1]));
    dst[2] = 0;
    return dst;
  }
}

function getInvertedViewProjection(dst, camera)
{
  mat4.mul(dst, camera.projection, camera.view);
  mat4.invert(dst, dst);
  return dst;
}

function unproject(dst, invertedViewProjection, viewport, screenX, screenY, screenZ)
{
  let normalizedDeviceCoords = vec4.create();
  normalizedDeviceCoords[0] = screenX / viewport.width * 2.0 - 1.0;
  normalizedDeviceCoords[1] = screenY / viewport.height * 2.0 - 1.0;
  normalizedDeviceCoords[2] = screenZ * 2.0 - 1.0;
  normalizedDeviceCoords[3] = 1.0;

  let objectCoords = vec4.transformMat4(normalizedDeviceCoords, normalizedDeviceCoords, invertedViewProjection);
  if (objectCoords[3] != 0) objectCoords[3] = 1.0 / objectCoords[3];
  dst[0] = objectCoords[0] * objectCoords[3];
  dst[1] = objectCoords[1] * objectCoords[3];
  dst[2] = objectCoords[2] * objectCoords[3];
  return dst;
}

/* harmony default export */ __webpack_exports__["a"] = (ViewPort);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gl_js__ = __webpack_require__(0);


/**
 * Shader - A GLSL shader representation
 */
class Shader
{
  /**
   * constructor - Shader definition
   *
   * @param {String} src The shader source
   * @param {Number} type The shader type
   */
  constructor(src, type)
  {
    this.type = type;

    //Create shader
    this.handle = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].createShader(this.type);
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].shaderSource(this.handle, src);
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].compileShader(this.handle);

    //Validate shader
    if (!__WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getShaderParameter(this.handle, __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].COMPILE_STATUS))
    {
      let info = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getShaderInfoLog(this.handle);
      __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].deleteShader(this.handle);
      this.handle = null;
      throw new Error("Unable to compile shaders: " + info);
    }
  }

  /**
   * close - Destroys the shader object
   */
  close()
  {
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].deleteShader(this.handle);
    this.handle = null;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Shader);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__client_ClientGame_js__ = __webpack_require__(4);


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
	app.load(() => {
		app.connect(() => {
			update();
		});
	});
}

/**
 * Called every tick by the game loop
 */
function onApplicationUpdate(app, frame)
{

}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__integrated_Game_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__integrated_Player_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__integrated_packet_PacketHandler_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__camera_ViewPort_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__input_Mouse_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Renderer_js__ = __webpack_require__(9);








class ClientGame extends __WEBPACK_IMPORTED_MODULE_0__integrated_Game_js__["a" /* default */]
{
  constructor(socket, canvas)
  {
    super();

    this.socket = socket;
    this.canvas = canvas;

    this.input = new __WEBPACK_IMPORTED_MODULE_4__input_Mouse_js__["a" /* default */](document);
    this.renderer = new __WEBPACK_IMPORTED_MODULE_5__Renderer_js__["a" /* default */](this.canvas);

    this.thePlayer = new __WEBPACK_IMPORTED_MODULE_1__integrated_Player_js__["a" /* default */]();
    this.gameState = {};
  }

  load(callback)
  {
  	console.log("Loading client...");

    this.renderer.load(callback);
  }

  connect(callback)
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

    //Predict state...
    //Simulating changes in state...
    let v = __WEBPACK_IMPORTED_MODULE_3__camera_ViewPort_js__["a" /* default */].getPointFromScreen(vec3.create(), this.renderer.camera, this.renderer.viewport, input.x, input.y);
    //this.gameState[this.socket.id].x = v[0];
    //this.gameState[this.socket.id].y = v[1];

    //Render state...
    this.renderer.render(this.gameState);

    if (input.dx != 0 || input.dy != 0)
    {
      //Force 200ms lag...
      setTimeout(() => __WEBPACK_IMPORTED_MODULE_2__integrated_packet_PacketHandler_js__["a" /* default */].sendToServer('client-input',
      {
        timestamp: frame.then,
        x: v[0],
        y: v[1]
      },
      this.socket), 200);
    }
  }

  onServerUpdate(socket, data)
  {
    //Update state to authoritative state...
    this.gameState = data;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (ClientGame);


/***/ }),
/* 5 */
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
/* 6 */
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
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__asset_AssetManager_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__camera_ViewPort_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__camera_OrthographicCamera_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mogli_Shader_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mogli_Program_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mogli_Mesh_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__ = __webpack_require__(0);










class Renderer
{
  constructor(canvas)
  {
    this.canvas = canvas;
    this.viewport = new __WEBPACK_IMPORTED_MODULE_1__camera_ViewPort_js__["a" /* default */](this.canvas);

    this.assets = new __WEBPACK_IMPORTED_MODULE_0__asset_AssetManager_js__["a" /* default */]();

    this.camera = new __WEBPACK_IMPORTED_MODULE_2__camera_OrthographicCamera_js__["a" /* default */](this.viewport);
    this.camera.transform.position[2] = 1.0;
  }

  load(callback)
  {
    this.assets.register('shader', 'vdef', './res/def.vsh');
    this.assets.register('shader', 'fdef', './res/def.fsh');

    this.assets.flush(() => {
      this._prepareAssets();
      callback();
    });
  }

  _prepareAssets(callback)
  {
		//Load resources
		const vsrc = this.assets.getAsset('shader', 'vdef');
		const fsrc = this.assets.getAsset('shader', 'fdef');

		//Shader Programs
		var vertexShader = new __WEBPACK_IMPORTED_MODULE_3__mogli_Shader_js__["a" /* default */](vsrc, __WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__["a" /* default */].VERTEX_SHADER);
		var fragmentShader = new __WEBPACK_IMPORTED_MODULE_3__mogli_Shader_js__["a" /* default */](fsrc, __WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__["a" /* default */].FRAGMENT_SHADER);
		this.prgm = new __WEBPACK_IMPORTED_MODULE_4__mogli_Program_js__["a" /* default */]();
		this.prgm.link([vertexShader, fragmentShader]);

		//Mesh
    //TODO: get a proper OBJ loader!
		this.mesh = __WEBPACK_IMPORTED_MODULE_5__mogli_Mesh_js__["a" /* default */].createMesh({
			position: new Float32Array([
				-0.5, 0.5,
				0.5, 0.5,
				0.5, -0.5,
				-0.5, -0.5
			]),
			indices: new Uint16Array([
				0, 1, 2, 3
			])},
			__WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__["a" /* default */].GL_STATIC_DRAW);
  }

  render(gameState)
  {
		__WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__["a" /* default */].clear(__WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__["a" /* default */].COLOR_BUFFER_BIT | __WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__["a" /* default */].DEPTH_BUFFER_BIT);
    this.viewport.update();

    //Setting up the Projection Matrix
    const projection = this.camera.projection;

    //Setting up the View Matrix
    const view = this.camera.view;
		const modelview = mat4.create();

		this.prgm.bind();
		{
			__WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__["a" /* default */].uniformMatrix4fv(this.prgm.uniforms.uProjection, false, projection);

			this.mesh.bind();
			{
        for(var i in gameState)
        {
          let entity = gameState[i];
          if (entity)
          {
            //Setting up the Model Matrix
            mat4.fromTranslation(modelview, [entity.x, entity.y, 0]);
            mat4.mul(modelview, modelview, view);
      			__WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__["a" /* default */].uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);

            //Draw it!
            __WEBPACK_IMPORTED_MODULE_5__mogli_Mesh_js__["a" /* default */].draw(this.mesh);
          }
        }
			}
			this.mesh.unbind();
		}
		this.prgm.unbind();
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Renderer);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ResourceLocation
{
  constructor(filename)
  {
    this._filename = filename;
  }

  get url()
  {
    return this._filename;
  }
}

class AssetManager
{
  constructor()
  {
    this.registry = {};
  }

  destroy()
  {
    this.registry.clear();
  }

  register(type, id, url = null)
  {
    if (!this.registry[type])
    {
      this.registry[type] = {}
    }
    this.registry[type][id] = new ResourceLocation(url);
  }

  unregister(type, id)
  {
    this.registry[type].delete(id);
  }

  flush(callback)
  {
    var flag = false;
    var count = 0;
    for(let type in this.registry)
    {
      let assets = this.registry[type];
      for(let id in assets)
      {
        let asset = assets[id];
        if (asset instanceof ResourceLocation)
        {
          ++count;
          console.log("LOADING (" + count + ") " + type + ":" + id + "...");
          AssetManager.fetchFileFromURL(asset.url, function(response, args) {
            let assetManager = args[0];
            let type = args[1];
            let id = args[2];
            let assets = assetManager.registry[type];
            assets[id] = response;
            console.log("...RECEIVED (" + count + ") " + type + ":" + id + "...");
            --count;
            if (flag && count == 0)
            {
              callback();
            }
          },
          [ this, type, id ]);
        }
      }
    }
    flag = true;
    if (count == 0)
    {
      callback();
    }
  }

  getAsset(type, id)
  {
    let asset = this.registry[type][id];
    if (!asset)
    {
      asset = AssetManager.fetchFileFromURL(assets[id].url);
      this.registry[type][id] = asset;
    }
    return asset;
  }

  static fetchFileFromURL(url, callback = null, args = null)
  {
    var request = new XMLHttpRequest();
    request.open('GET', url, callback != null);
    if (callback != null)
    {
      request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE)
        {
          if (request.status == 200)
          {
            let result = request.response;
            callback(result, args);
          }
    			else
    			{
    				throw new Error("Failed request: " + request.status);
    			}
        }
      }
      request.send(null);
    }
    else
    {
      request.send(null);
      if (request.status == 200)
      {
        let result = request.response;
        return result;
      }
      else
      {
        throw new Error("Failed request: " + request.status);
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (AssetManager);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Camera_js__ = __webpack_require__(12);


class OrthographicCamera extends __WEBPACK_IMPORTED_MODULE_0__Camera_js__["a" /* default */]
{
  constructor(viewport, left = -10, right = 10, top = -10, bottom = 10, near = -10, far = 10)
  {
    super(viewport);
    //near plane must be > 0
    //far plane must be > near
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
  }

  get projection()
  {
    //TODO: maybe cache this?
    let width = this.right - this.left;
    let height = this.bottom - this.top;
    let a = width / height;
    let v = this.viewport.width / this.viewport.height;
    if (v >= a)
    {
      return mat4.ortho(this._projection,
        -(v / a) * width / 2.0, (v / a) * width / 2.0,
        -height / 2.0, height / 2.0,
        this.near, this.far);
    }
    else
    {
      return mat4.ortho(this._projection,
        -width / 2.0, width / 2.0,
        -(a / v) * height / 2.0, (a / v) * height / 2.0,
        this.near, this.far);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (OrthographicCamera);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__integrated_transform_Transform_js__ = __webpack_require__(13);


class Camera
{
  constructor(viewport)
  {
    this.transform = new __WEBPACK_IMPORTED_MODULE_0__integrated_transform_Transform_js__["a" /* default */]();

    this.viewport = viewport;
    this._view = mat4.create();
    this._orientation = mat4.create();
    this._projection = mat4.create();
  }

  get view()
  {
    return mat4.fromRotationTranslationScale(this._view,
      this.transform.rotation,
      [-this.transform.position[0], -this.transform.position[1], -this.transform.position[2]],
      this.transform.scale);
  }

  get orientation()
  {
    return mat4.fromQuat(this._orientation, this.transform.rotation);
  }

  get projection()
  {
    throw new Error("undefined camera type - must be perspective or orthographic");
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Camera);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Transform
{
  constructor(x = 0, y = 0, z = 0)
  {
    this.position = vec3.create();
    vec3.set(this.position, x, y, z);

    this.rotation = quat.create();
    this.scale = vec3.create();
    vec3.set(this.scale, 1, 1, 1);
  }

  getTransformation(dst)
  {
    mat4.fromRotationTranslationScale(dst, this.rotation, this.position, this.scale);
    return dst;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Transform);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gl_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Shader_js__ = __webpack_require__(2);



/**
 * Program - Manages and links related shaders. In order to set uniform values,
 * use gl.setUniform(program.uniforms.name, value).
 */
class Program
{
  constructor()
  {
    //Create Program
    this.handle = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].createProgram();

    this.shaders = [];

    this.attribs = {};
    this.uniforms = {};
  }

  /**
   * close - Destroys the program object
   */
  close()
  {
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].deleteProgram(this.handle);
    this.handle = null;
  }

  /**
   * link - Attach passed-in shaders to this program and resolve all uniform and
   * attribute locations.
   *
   * @param {Array} shaders Array of shaders to be linked
   */
  link(shaders)
  {
    //Attach shaders
    var len = shaders.length;
    for(let i = 0; i < len; ++i)
    {
      let shader = shaders[i];
      this.shaders.push(shader);
      __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].attachShader(this.handle, shader.handle);
    }
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].linkProgram(this.handle);

    //Validate program links
    if (!__WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getProgramParameter(this.handle, __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].LINK_STATUS))
    {
      let info = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getProgramInfoLog(this.handle);
      __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].deleteProgram(this.handle);
      this.handle = null;
      throw new Error("Unable to initialize shader program: " + info);
    }

    //Resolve uniforms
    const uniformCount = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getProgramParameter(this.handle, __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].ACTIVE_UNIFORMS);
    for(let i = 0; i < uniformCount; ++i)
    {
      const info = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getActiveUniform(this.handle, i);
      console.log("...found uniform: \'" + info.name + "\'...");
      this.uniforms[info.name] = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getUniformLocation(this.handle, info.name);
    }

    //Resolve attributes
    const attribCount = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getProgramParameter(this.handle, __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].ACTIVE_ATTRIBUTES);
    for(let i = 0; i < attribCount; ++i)
    {
      const info = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getActiveAttrib(this.handle, i);
      console.log("...found attrib: \'" + info.name + "\'...");
      this.attribs[info.name] = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getAttribLocation(this.handle, info.name);
    }
  }

  /**
   * validate - Strictly validate the program state
   */
  validate()
  {
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].validateProgram(this.handle);

    if (!__WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getProgramParameter(this.handle, __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].VALIDATE_STATUS))
    {
      let info = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getProgramInfoLog(this.handle);
      __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].deleteProgram(this.handle);
      this.handle = null;
      throw new Error("Invalid program: " + info);
    }
  }

  bind()
  {
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].useProgram(this.handle);
  }

  unbind()
  {
    console.assert(this.isInUse(), "must call bind first!");
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].useProgram(null);
  }

  /**
   * isInUse - Whether the program is bound to the current context.
   *
   * @return {Boolean} Whether the program is bound to the current context.
   */
  isInUse()
  {
    return __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getParameter(__WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].CURRENT_PROGRAM) == this.handle;
  }

  /**
   * @deprecated locations already automatically resolved while linking shaders
   */
  findUniformLocation(name)
  {
    var loc = this.uniforms[name];
    if (!loc)
    {
      loc = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getUniformLocation(this.handle, name);
      if (loc == null)
      {
        throw new Error("Cannot find uniform with name: " + name);
      }

      this.uniforms[name] = loc;
    }
    return loc;
  }

  /**
   * @deprecated locations already automatically resolved while linking shaders
   */
  findAttribLocation(name)
  {
    var loc = this.attribs[name];
    if (!loc)
    {
      loc = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getAttribLocation(this.handle, name);
      if (loc == null)
      {
        throw new Error("Cannot find attribute with name: " + name);
      }

      this.attribs[name] = loc;
    }
    return loc;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Program);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gl_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__VBO_js__ = __webpack_require__(16);



/**
 * Mesh - Vertex array object representation
 */
class Mesh
{
  constructor()
  {
    this.vbos = {};
    this.vertexCount = 0;

    this.ibo = null;
  }

  /**
   * close - Destroys the mesh object and the associated buffer objects
   */
  close()
  {
    for(let loc in this.vbos)
    {
      let vbo = this.vbos[loc];
      vbo.close();
      delete this.vbos[loc];
    }

    if (this.ibo != null)
    {
      this.ibo.close();
      this.ibo = null;
    }
  }

  /**
   * setElementArrayBuffer - Set the element array buffer to the passed-in
   * buffer object
   *
   * @param {VBO} vbo the buffer object
   *
   * @return {Mesh} for method chaining
   */
  setElementArrayBuffer(vbo)
  {
    console.assert(vbo.target == __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].ELEMENT_ARRAY_BUFFER, "invalid element array buffer object");

    if (this.ibo)
    {
      this.ibo.close();
    }
    this.ibo = vbo;
    this.vertexCount = this.ibo.length;
    return this; //For method chaining
  }

  /**
   * setVertexArrayBuffer - Set the passed-in buffer object to the passed-in
   * location for this mesh
   *
   * @param {WebGL} location  the location of the attribute
   * @param {VBO} vbo         the buffer object to set at location
   *
   * @return {Mesh} For method chaining
   */
  setVertexArrayBuffer(location, vbo)
  {
    var vbo2 = this.vbos[location];
    if (vbo2)
    {
      vbo2.close();
    }
    this.vbos[location] = vbo;
    return this; //For method chaining
  }

  /**
   * bind - Bind the mesh and the associated buffer objects to the current
   * context
   */
  bind()
  {
    if (this.ibo)
    {
      this.ibo.bind();
    }

    for(let loc in this.vbos)
    {
      let vbo = this.vbos[loc];
      vbo.bind();
      __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].enableVertexAttribArray(loc);
      __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].vertexAttribPointer(loc, vbo.vertexSize, vbo.type, vbo.normalized, vbo.stride, 0);
    }
  }

  /**
   * unbind - Bind an empty mesh and unbinds all associaed buffer objects in the
   * current context
   */
  unbind()
  {
    if (this.ibo)
    {
      this.ibo.unbind();
    }

    for(let loc in this.vbos)
    {
      let vbo = this.vbos[loc];
      __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].disableVertexAttribArray(loc);
      vbo.unbind();
    }
  }

  static putIndexBuffer(mesh, data, usage)
  {
		var ibo = new __WEBPACK_IMPORTED_MODULE_1__VBO_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].ELEMENT_ARRAY_BUFFER);
		ibo.bind();
		{
			ibo.putData(data, __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].UNSIGNED_INT, 1, false, usage || __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].STATIC_DRAW);
			mesh.setElementArrayBuffer(ibo);
		}
		ibo.unbind();
    return mesh; //For method chaining
  }

  static putVertexBuffer(mesh, data, usage, location, size, stride)
  {
    var vbo = new __WEBPACK_IMPORTED_MODULE_1__VBO_js__["a" /* default */]();
    vbo.bind();
    {
      vbo.putData(data, __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].FLOAT, size, false, usage || __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].STATIC_DRAW, stride);
      mesh.setVertexArrayBuffer(location, vbo);
    }
    vbo.unbind();
    return mesh; //For method chaining
  }

  /**
   * @static createMesh - Creates a mesh object with specified passed-in
   * meshData. (As of right now, it only creates 2D meshes.)
   *
   * @param {Object} meshData the vertex data that make up the mesh
   * @param {GLEnum} usage    how the mesh will be used
   *                          (i.e. gl.STATIC_DRAW, gl.DYNAMIC_DRAW)
   */
  static createMesh(meshData, usage)
  {
    //TODO: Allow variable vertex size for 3D objects
    var mesh = new Mesh();
    if (meshData.position)
    {
      this.putVertexBuffer(mesh, meshData.position, usage, 0, 2, 0);
    }

    if (meshData.texcoord)
    {
      this.putVertexBuffer(mesh, meshData.texcoord, usage, 0, 2, 0);
    }

    if (meshData.indices)
    {
      this.putIndexBuffer(mesh, meshData.indices, usage)
    }
    return mesh;
  }

  /**
   * @static draw - Draws the passed-in mesh by the passed-in mode
   *
   * @param {Mesh} mesh       the mesh to draw
   * @param {GlEnum} drawMode the mode to which to draw
   *                          (i.e. gl.POINTS, gl.LINE_LOOP, gl.TRIANGLES)
   */
  static draw(mesh, drawMode)
  {
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].drawElements(drawMode || __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].LINE_LOOP, mesh.vertexCount, __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].UNSIGNED_SHORT, 0);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Mesh);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gl_js__ = __webpack_require__(0);


/**
 * VBO - Data buffer representation
 */
class VBO
{
  constructor(target)
  {
    this.target = target || __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].ARRAY_BUFFER;
    this.handle = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].createBuffer();
    this.normalized = false;
    this.length = 0;
    this.vertexSize = 0;
    this.stride = 0;
  }

  /**
   * close - Destroys the buffer object
   */
  close()
  {
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].deleteBuffer(this.handle);
    this.handle = null;
  }

  /**
   * putData - Put the passed-in data in this buffer object with specific
   * instructions to how to use it.
   *
   * @param {Array} data          the array data
   *                              (i.e. Float32Array, Uint16Array)
   * @param {GLEnum} dataType     the type of data
   *                              (i.e. gl.FLOAT, gl.UNSIGNED_INT)
   * @param {Number} vertexSize   the size of the vertices this buffer holds
   * @param {Boolean} normalized  whether this buffer is normalized
   * @param {GLEnum} usage        how this buffer is stored and used
   *                              (i.e. gl.STATIC_DRAW)
   * @param {Number} stride       the 'step' indices to each vertex (default 0)
   */
  putData(data, dataType, vertexSize, normalized, usage, stride)
  {
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].bindBuffer(this.target, this.handle);
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].bufferData(this.target, data, usage);
    this.type = dataType;
    this.vertexSize = vertexSize;
    this.normalized = normalized;
    this.length = data.length;
    this.stride = stride || 0;
  }

  /**
   * updateData - Update the buffer data to the passed-in data
   *
   * @param {Array} data    the array data (i.e. Float32Array)
   * @param {Number} offset the index from which to update
   */
  updateData(data, offset)
  {
    if (offset + data.length > this.length)
    {
      var usage = __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].getBufferParameter(this.target, __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].BUFFER_USAGE);
      this.putData(data, this.normalized, usage);
    }

    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].bindBuffer(this.target, this.handle);
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].bufferSubData(this.target, offset, data);
  }

  /**
   * bind - Binds the buffer object to the current target context
   * (specified by putData())
   */
  bind()
  {
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].bindBuffer(this.target, this.handle);
  }

  /**
   * unbind - Binds an empty buffer object to the current target context
   * (specified by putData())
   */
  unbind()
  {
    __WEBPACK_IMPORTED_MODULE_0__gl_js__["a" /* default */].bindBuffer(this.target, null);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (VBO);


/***/ })
/******/ ]);