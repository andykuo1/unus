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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Entity_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_ObjectPool_js__ = __webpack_require__(18);




class EntityManager
{
  constructor()
  {
    this.entities = [];
    this.entityPool = new __WEBPACK_IMPORTED_MODULE_1__util_ObjectPool_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__Entity_js__["a" /* default */]);

    this.components = new Map();
    this.nextEntityID = 1;

    this.callbacks = [];
  }

  addCallback(callback)
  {
    this.callbacks.push(callback);
  }

  removeCallback(callback)
  {
    this.callbacks.splice(this.callbacks.indexOf(entity), 1);
  }

  createEntity(id)
  {
    var entity = this.entityPool.obtain();
    entity._manager = this;
    entity._id = id || this.getNextAvailableEntityID();
    this.entities.push(entity);

    for(const callback of this.callbacks)
    {
      callback(entity, 'create');
    }
    return entity;
  }

  destroyEntity(entity)
  {
    for(const callback of this.callbacks)
    {
      callback(entity, 'destroy');
    }

    this.clearComponentsFromEntity(entity);
    this.entities.splice(this.entities.indexOf(entity), 1);
    this.entityPool.release(entity);
  }

  getEntityByID(id)
  {
    for(let entity of this.entities)
    {
      if (entity._id == id)
      {
        return entity;
      }
    }
    return null;
  }

  addComponentToEntity(entity, component)
  {
    if (this.hasComponent(entity, component))
    {
      throw new Error("entity already includes component \'" + EntityManager.getComponentName(component) + "\'");
    }

    entity[EntityManager.getComponentName(component)] = new component();

    var list = this.components.get(component) || [];
    list.push(entity);
    this.components.set(component, list);
  }

  removeComponentFromEntity(entity, component)
  {
    if (!this.hasComponent(entity, component))
    {
      throw new Error("entity does not include component \'" + EntityManager.getComponentName(component) + "\'");
    }

    delete entity[EntityManager.getComponentName(component)];

    var list = this.components.get(component);
    if (list)
    {
      list.splice(list.indexOf(entity), 1);
    }
  }

  clearComponentsFromEntity(entity)
  {
    for(const [key, list] of this.components)
    {
      if (list.includes(entity))
      {
        delete entity[EntityManager.getComponentName(key)];

        list.splice(list.indexOf(entity), 1);
      }
    }
  }

  hasComponent(entity, component)
  {
    let list = this.components.get(component);
    return list && list.includes(entity);
  }

  getComponentsByEntity(entity)
  {
    let result = [];
    for(const [key, list] of this.components)
    {
      if (list.includes(entity))
      {
        result.push(key);
      }
    }
    return result;
  }

  getEntitiesByComponent(component)
  {
    return this.components.get(component) || [];
  }

  getEntities()
  {
    return this.entities;
  }

  getNextAvailableEntityID()
  {
    return this.nextEntityID++;
  }

  static getComponentName(component)
  {
    var name = component.name;
    return name.charAt(0).toLowerCase() + name.slice(1);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EntityManager);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Player()
{
  this.socketID = -1;
  this.nextX = 0;
  this.nextY = 0;
}

/* harmony default export */ __webpack_exports__["a"] = (Player);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__client_ClientGame_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__integrated_World_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__integrated_NetworkHandler_js__ = __webpack_require__(21);




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
  game = new __WEBPACK_IMPORTED_MODULE_0__client_ClientGame_js__["a" /* default */](
		new __WEBPACK_IMPORTED_MODULE_1__integrated_World_js__["a" /* default */]({delta: 0, then: Date.now(), count: 0}, true),
		new __WEBPACK_IMPORTED_MODULE_2__integrated_NetworkHandler_js__["a" /* default */](socket, true)
	);
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__input_Mouse_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Renderer_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__camera_ViewPort_js__ = __webpack_require__(1);





/*

CLIENT gets CURRENT_GAME_STATE.
CLIENT sets CLIENT_GAME_STATE to CURRENT_GAME_STATE.
CLIENT removes all INPUT_STATE older than CURRENT_GAME_STATE.
CLIENT updates CLIENT_GAME_STATE with all remaining INPUT_STATE.
. . .
CLIENT stores CURRENT_INPUT_STATE.
CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
CLIENT sends CURRENT_INPUT_STATE.

*/

class ClientGame// extends Game
{
  constructor(world, networkHandler)
  {
    this.world = world;
    this.networkHandler = networkHandler;

    this.input = new __WEBPACK_IMPORTED_MODULE_0__input_Mouse_js__["a" /* default */](document);
    this.inputStates = [];

    console.log(canvas);
    this.renderer = new __WEBPACK_IMPORTED_MODULE_1__Renderer_js__["a" /* default */](canvas);
  }

  load(callback)
  {
    console.log("Loading client...");

    this.renderer.load(callback);
  }

  connect(callback)
  {
    console.log("Connecting client...");
    this.networkHandler.initClient(callback);
    this.networkHandler.onServerConnect = (server) => {
      server.on('server.gamestate', (data) => {
        this.onServerUpdate(server, data);
      });
    };
  }

  update(frame)
  {
    this.onUpdate(frame);
  }

  onUpdate(frame)
  {
    //CLIENT stores CURRENT_INPUT_STATE.
    var currentInputState = this.getCurrentInputState(frame);
    this.inputStates.push(currentInputState);

    //CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
    this.world.step(currentInputState, frame, this.networkHandler.socketID);
    this.renderer.render(this.world);

    //CLIENT sends CURRENT_INPUT_STATE.
    this.sendClientInput(currentInputState);
  }

  onServerUpdate(server, gameState)
  {
    //CLIENT sets CLIENT_GAME_STATE to CURRENT_GAME_STATE.
    this.world.resetState(gameState);
    //CLIENT removes all INPUT_STATE older than CURRENT_GAME_STATE.
    while(this.inputStates.length > 0 && this.world.isNewerThan(this.inputStates[this.inputStates.length - 1].frame))
    {
      this.inputStates.shift();
    }
    //CLIENT updates CLIENT_GAME_STATE with all remaining INPUT_STATE.
    for(const inputState of this.inputStates)
    {
      this.world.step(inputState, inputState.frame, this.networkHandler.socketID);
    }
  }

  getCurrentInputState(frame)
  {
    const inputState = this.input.poll();
    const vec = __WEBPACK_IMPORTED_MODULE_2__camera_ViewPort_js__["a" /* default */].getPointFromScreen(vec3.create(),
      this.renderer.camera, this.renderer.viewport,
      inputState.x, inputState.y);
    inputState.x = vec[0];
    inputState.y = vec[1];
    inputState.frame = frame;
    return inputState;
  }

  sendClientInput(inputState)
  {
    //FIXME: Force 200ms lag...
    setTimeout(() => this.networkHandler.sendToServer('client.inputstate', inputState), 200);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (ClientGame);


/***/ }),
/* 7 */
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
      click: this.click,
      time: Date.now()
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__asset_AssetManager_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__camera_ViewPort_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__camera_OrthographicCamera_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mogli_Shader_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mogli_Program_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mogli_Mesh_js__ = __webpack_require__(14);
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

  render(world)
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
        for(const entity of world.entities)
        {
          //Setting up the Model Matrix
          mat4.fromTranslation(modelview, [entity.x, entity.y, 0]);
          mat4.mul(modelview, modelview, view);
    			__WEBPACK_IMPORTED_MODULE_6__mogli_gl_js__["a" /* default */].uniformMatrix4fv(this.prgm.uniforms.uModelView, false, modelview);

          //Draw it!
          __WEBPACK_IMPORTED_MODULE_5__mogli_Mesh_js__["a" /* default */].draw(this.mesh);
        }
			}
			this.mesh.unbind();
		}
		this.prgm.unbind();
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Renderer);


/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Camera_js__ = __webpack_require__(11);


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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__integrated_transform_Transform_js__ = __webpack_require__(12);


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
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gl_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__VBO_js__ = __webpack_require__(15);



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
/* 15 */
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


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity_EntityManager_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__entity_EntitySystem_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__entity_PlayerSystem_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__entity_PlayerComponent_js__ = __webpack_require__(4);






class World
{
  constructor(frame, remote=true)
  {
    this.remote = remote;
    this.frame = frame;
    this.predictiveFrame = this.frame;

    this.entityManager = new __WEBPACK_IMPORTED_MODULE_0__entity_EntityManager_js__["a" /* default */]();
    this.systems = [];
    this.systems.push(new __WEBPACK_IMPORTED_MODULE_1__entity_EntitySystem_js__["a" /* default */](this.entityManager));
    this.systems.push(new __WEBPACK_IMPORTED_MODULE_2__entity_PlayerSystem_js__["a" /* default */]());
  }

  step(inputState, frame, target)
  {
    this.predictiveFrame = frame;

    //Update target with inputState
    const targetEntity = this.getEntityByClientID(target);
    if (targetEntity)
    {
      for(const system of this.systems)
      {
        system.onInputUpdate(targetEntity, inputState);
      }
    }

    //Continue to update the world state
    for(const system of this.systems)
    {
      system.onUpdate(this.entityManager, frame);
    }
  }

  captureState(frame)
  {
    //Capture a GameState and return it for sending...
    const dst = {};
    for(const system of this.systems)
    {
      system.writeToGameState(this.entityManager, dst);
    }
    dst.frame = frame;
    return dst;
  }

  resetState(gameState)
  {
    this.frame = gameState.frame;
    this.predictiveFrame = this.frame;
    
    //Continue to reset the world state
    for(const system of this.systems)
    {
      system.readFromGameState(this.entityManager, gameState);
    }
  }

  isNewerThan(frame)
  {
    return this.frame.then > frame.then;
  }

  getEntityByClientID(socketID)
  {
    for(const entity of this.entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_3__entity_PlayerComponent_js__["a" /* default */]))
    {
      if (entity.player.socketID == socketID)
      {
        return entity;
      }
    }

    return null;
  }

  get entities()
  {
    return this.entityManager.getEntities();
  }
}

/* harmony default export */ __webpack_exports__["a"] = (World);


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Entity
{
  constructor()
  {
    this.__init();
  }

  __init()
  {
    this._id = 0;
  }

  addComponent(component)
  {
    this._manager.addComponentToEntity(this, component);
    return this;
  }

  removeComponent(component)
  {
    this._manager.removeComponentFromEntity(this, component);
    return this;
  }

  clearComponents()
  {
    this._manager.clearComponentsFromEntity(this);
  }

  hasComponent(component)
  {
    return this._manager.hasComponent(this, component);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Entity);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ObjectPool
{
  constructor(T)
  {
    this._freeList = [];
    this.size = 0;
    this.T = T;
  }

  obtain()
  {
    if (this._freeList.length <= 0)
    {
      this.expand(Math.round(this.size * 0.2) + 1);
    }

    var item = this._freeList.pop();
    if (item.__init)
    {
      item.__init();
    }
    else
    {
      this.T.call(item);
    }
    return item;
  }

  release(item)
  {
    this._freeList.push(item);
  }

  expand(count)
  {
    for(let i = 0; i < count; ++i)
    {
      this._freeList.push(new this.T());
    }
    this.size += count;
  }

  getTotalObjectsFree()
  {
    return this._freeList.length;
  }

  getTotalObjectsUsed()
  {
    return this._count - this._freeList.length;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (ObjectPool);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EntitySystem
{
  constructor(entityManager)
  {
    this.createCache = [];
    this.destroyCache = [];

    entityManager.addCallback((entity, state) => {
      switch(state)
      {
        case 'create':
          if (this.destroyCache.includes(entity._id))
          {
            this.destroyCache.splice(this.destroyCache.indexOf(entity._id), 1);
          }
          this.createCache.push(entity._id);
          break;
        case 'destroy':
          if (this.createCache.includes(entity._id))
          {
            this.createCache.splice(this.createCache.indexOf(entity._id), 1);
          }
          this.destroyCache.push(entity._id);
          break;
      }
    });
  }

  onUpdate(entityManager, frame)
  {
  }

  onInputUpdate(entity, inputState)
  {
  }

  writeToGameState(entityManager, gameState)
  {
    let entities = gameState['entities.create'];
    if (!entities) entities = gameState['entities.create'] = [];
    for(const entityID of this.createCache)
    {
      entities.push(entityID);
    }
    this.createCache.length = 0;

    entities = gameState['entities.destroy'];
    if (!entities) entities = gameState['entities.destroy'] = [];
    for(const entityID of entities)
    {
      entities.push(entityID);
    }
    this.destroyCache.length = 0;
  }

  readFromGameState(entityManager, gameState)
  {
    let entities = gameState['entities.create'] || [];
    for(const entityID of entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (entity) continue;

      console.log("CREATE ENTITY!");
      entityManager.createEntity(entityID);
    }

    entities = gameState['entities.destroy'] || [];
    for(const entityID of entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (!entity) continue;
      console.log("DESTROY ENTITY!");
      entityManager.destroyEntity(entity);
    }

    entities = gameState['entities'] || {};
    for(const entity of entityManager.getEntities())
    {
      if (!entities[entity._id])
      {
        //Maybe missed destruction event from server...
        entityManager.destroyEntity(entity);
      }
    }
    for(const entityID in entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (!entity)
      {
        //Maybe missed creation event from server...
        entityManager.createEntity(entityID);
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EntitySystem);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__EntityManager_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__PlayerComponent_js__ = __webpack_require__(4);



class PlayerSystem
{
  onUpdate(entityManager, frame)
  {
    const entities = entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_1__PlayerComponent_js__["a" /* default */]);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, frame);
    }
  }

  onEntityUpdate(entity, frame)
  {
    entity.x = entity.player.nextX;
    entity.y = entity.player.nextY;
  }

  onInputUpdate(entity, inputState)
  {
    if (!entity.hasComponent(__WEBPACK_IMPORTED_MODULE_1__PlayerComponent_js__["a" /* default */])) return;
    entity.player.nextX = inputState.x;
    entity.player.nextY = inputState.y;
  }

  writeEntityToData(entity, dst)
  {
    dst.player.nextX = entity.player.nextX;
    dst.player.nextY = entity.player.nextY;
    dst.player.socketID = entity.player.socketID;
  }

  readEntityFromData(src, entity)
  {
    entity.player.nextX = src.player.nextX;
    entity.player.nextY = src.player.nextY;
    entity.player.socketID = src.player.socketID;
  }

  writeToGameState(entityManager, gameState)
  {
    const CNAME = __WEBPACK_IMPORTED_MODULE_0__EntityManager_js__["a" /* default */].getComponentName(__WEBPACK_IMPORTED_MODULE_1__PlayerComponent_js__["a" /* default */]);

    let dst = gameState['entities'];
    if (!dst) dst = gameState['entities'] = {};
    const entities = entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_1__PlayerComponent_js__["a" /* default */]);
    for(const entity of entities)
    {
      let entityData = dst[entity._id];
      if (!entityData) entityData = dst[entity._id] = {};
      if (!entityData[CNAME]) entityData[CNAME] = {};
      this.writeEntityToData(entity, entityData);
    }
  }

  readFromGameState(entityManager, gameState)
  {
    const CNAME = __WEBPACK_IMPORTED_MODULE_0__EntityManager_js__["a" /* default */].getComponentName(__WEBPACK_IMPORTED_MODULE_1__PlayerComponent_js__["a" /* default */]);

    let src = gameState['entities'] || {};
    for(const entityID in src)
    {
      let entity = entityManager.getEntityByID(entityID);
      if (!entity) throw new Error("Cannot find entity with id \'" + entityID + "\'");

      let entityData = src[entityID];

      if (entityData[CNAME])
      {
        if (!entity[CNAME]) entity.addComponent(__WEBPACK_IMPORTED_MODULE_1__PlayerComponent_js__["a" /* default */]);
        this.readEntityFromData(entityData, entity);
      }
      else if (entity[CNAME])
      {
        entity.removeComponent(__WEBPACK_IMPORTED_MODULE_1__PlayerComponent_js__["a" /* default */]);
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (PlayerSystem);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class NetworkHandler
{
  constructor(socket, remote=true)
  {
    this.socket = socket;
    this.remote = remote;

    if (!this.remote)
    {
      //Server-side init
      this.clients = new Map();
      this.onClientConnect = (client) => {};
      this.onClientDisconnect = (client) => {};
    }
    else
    {
      //Client-side init
      this.socketID = -1;
      this.onServerConnect = (server) => {};
      this.onServerDisconnect = (server) => {};
    }
  }

  initClient(callback)
  {
    if (!this.remote) throw new Error("Initializing wrong network side");

    this.socket.emit('client-handshake');

    this.socket.on('server-handshake', (data) => {
      console.log("Connected to server...");
      this.socketID = data.socketID;
      this.onServerConnect(this.socket);

      //Start game...
      callback();
    });

    this.socket.on('disconnect', () => {
      console.log("Disconnected from server...");
      this.socketID = -1;
      this.onServerDisconnect(this.socket);

      window.close();
    });
  }

  initServer(callback)
  {
    if (this.remote) throw new Error("Initializing wrong network side");

    this.socket.on('connection', (socket) => {
      socket.on('client-handshake', () => {
        console.log("Added client: " + socket.id);
        this.clients.set(socket.id, socket);
        socket.emit('server-handshake', {socketID: socket.id});
        this.onClientConnect(socket);

        socket.on('disconnect', () => {
          this.onClientDisconnect(socket);
          console.log("Removed client: " + socket.id);
          this.clients.delete(socket.id);
        });
      });
    });
  }

  sendToServer(id, data)
  {
    if (!this.remote) throw new Error("Unable to send packet to self");

    this.socket.emit(id, data);
  }

  sendTo(id, data, dst)
  {
    dst.emit(id, data);
  }

  sendToAll(id, data)
  {
    if (this.remote) throw new Error("Unable to send packet to all from client");

    this.clients.forEach((client, key) => {
      this.sendTo(id, data, client);
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = (NetworkHandler);


/***/ })
/******/ ]);