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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_integrated_entity_System_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_Reflection_js__ = __webpack_require__(5);



class SynchronizedSystem extends __WEBPACK_IMPORTED_MODULE_0_integrated_entity_System_js__["a" /* default */]
{
  constructor(component)
  {
    super();
    this.component = component;
    this.componentName = __WEBPACK_IMPORTED_MODULE_1_util_Reflection_js__["a" /* default */].getClassVarName(this.component);
  }

  onEntityUpdate(entity, delta)
  {

  }

  writeEntityToData(entity, dst)
  {
    const componentData = dst[this.componentName];
    for(const [key, value] of Object.entries(entity[this.componentName]))
    {
      writeKeyValueToData(key, value, componentData);
    }
  }

  readEntityFromData(src, entity)
  {
    const componentData = entity[this.componentName];
    for(const [key, value] of Object.entries(src[this.componentName]))
    {
      writeKeyValueToData(key, value, componentData);
    }
  }

  onUpdate(entityManager, delta)
  {
    const entities = entityManager.getEntitiesByComponent(this.component);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, delta);
    }
  }

  writeToGameState(entityManager, gameState)
  {
    let dst = gameState['entitylist'];
    if (!dst) dst = gameState['entitylist'] = {};
    const entities = entityManager.getEntitiesByComponent(this.component);
    for(const entity of entities)
    {
      let entityData = dst[entity._id];
      if (!entityData) entityData = dst[entity._id] = {};
      if (!entityData[this.componentName]) entityData[this.componentName] = {};
      this.writeEntityToData(entity, entityData);
    }
  }

  readFromGameState(entityManager, gameState)
  {
    let src = gameState['entitylist'] || {};
    for(const entityID in src)
    {
      let entity = entityManager.getEntityByID(entityID);
      if (!entity) throw new Error("Cannot find entity with id \'" + entityID + "\'");

      let entityData = src[entityID];

      if (entityData[this.componentName])
      {
        if (!entity[this.componentName]) entity.addComponent(this.component);
        this.readEntityFromData(entityData, entity);
      }
      else if (entity[this.componentName])
      {
        entity.removeComponent(this.component);
      }
    }
  }
}

function writeKeyValueToData(key, value, dst)
{
  if (Array.isArray(value))
  {
    const array = [];
    for(const i in value)
    {
      writeKeyValueToData(i, value[i], array);
    }
    dst[key] = array;
  }
  else
  {
    dst[key] = value;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (SynchronizedSystem);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_game_SynchronizedSystem_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_game_NetworkEntitySystem_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_game_PlayerSystem_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_game_MotionSystem_js__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_game_TransformSystem_js__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_game_BulletSystem_js__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_game_RotatingSystem_js__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_game_FollowSystem_js__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_game_TransformComponent_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_game_MotionComponent_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_game_PlayerComponent_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_game_RenderableComponent_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_game_BulletComponent_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_game_RotatingComponent_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_game_FollowComponent_js__ = __webpack_require__(12);



















class GameFactory
{
  constructor()
  {
    this.entityTypes = new Map();
    this.entityManager = null;
  }

  static init(game)
  {
    GameFactory.INSTANCE.entityManager = game.entityManager;
    game.systemManager.systems.push(new __WEBPACK_IMPORTED_MODULE_2_game_NetworkEntitySystem_js__["a" /* default */](game.entityManager));
    game.systemManager.systems.push(new __WEBPACK_IMPORTED_MODULE_3_game_PlayerSystem_js__["a" /* default */]());
    game.systemManager.systems.push(new __WEBPACK_IMPORTED_MODULE_4_game_MotionSystem_js__["a" /* default */]());
    game.systemManager.systems.push(new __WEBPACK_IMPORTED_MODULE_5_game_TransformSystem_js__["a" /* default */]());
    game.systemManager.systems.push(new __WEBPACK_IMPORTED_MODULE_1_game_SynchronizedSystem_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_12_game_RenderableComponent_js__["a" /* default */]));
    game.systemManager.systems.push(new __WEBPACK_IMPORTED_MODULE_6_game_BulletSystem_js__["a" /* default */]());
    game.systemManager.systems.push(new __WEBPACK_IMPORTED_MODULE_7_game_RotatingSystem_js__["a" /* default */]());
    game.systemManager.systems.push(new __WEBPACK_IMPORTED_MODULE_8_game_FollowSystem_js__["a" /* default */]());

    GameFactory.INSTANCE.entityTypes.set('player', (entity) => {
      return entity
        .addComponent(__WEBPACK_IMPORTED_MODULE_9_game_TransformComponent_js__["a" /* default */])
        .addComponent(__WEBPACK_IMPORTED_MODULE_12_game_RenderableComponent_js__["a" /* default */])
        .addComponent(__WEBPACK_IMPORTED_MODULE_10_game_MotionComponent_js__["a" /* default */])
        .addComponent(__WEBPACK_IMPORTED_MODULE_11_game_PlayerComponent_js__["a" /* default */]);
    });
    GameFactory.INSTANCE.entityTypes.set('bullet', (entity) => {
      return entity
        .addComponent(__WEBPACK_IMPORTED_MODULE_9_game_TransformComponent_js__["a" /* default */])
        .addComponent(__WEBPACK_IMPORTED_MODULE_12_game_RenderableComponent_js__["a" /* default */])
        .addComponent(__WEBPACK_IMPORTED_MODULE_13_game_BulletComponent_js__["a" /* default */]);
    });
    GameFactory.INSTANCE.entityTypes.set('star', (entity) => {
      return entity
        .addComponent(__WEBPACK_IMPORTED_MODULE_9_game_TransformComponent_js__["a" /* default */])
        .addComponent(__WEBPACK_IMPORTED_MODULE_12_game_RenderableComponent_js__["a" /* default */])
        .addComponent(__WEBPACK_IMPORTED_MODULE_14_game_RotatingComponent_js__["a" /* default */]);
    });
    GameFactory.INSTANCE.entityTypes.set('cart', (entity) => {
      return entity
        .addComponent(__WEBPACK_IMPORTED_MODULE_9_game_TransformComponent_js__["a" /* default */])
        .addComponent(__WEBPACK_IMPORTED_MODULE_12_game_RenderableComponent_js__["a" /* default */])
        .addComponent(__WEBPACK_IMPORTED_MODULE_15_game_FollowComponent_js__["a" /* default */]);
    });
  }

  static createWorld(game)
  {
    if (game.isRemote()) throw new Error('must be server-side');
    if (GameFactory.INSTANCE.entityManager == null) throw new Error('must init first');

    //populate with random
    for(let i = 0; i < 100; ++i)
    {
      const entity = GameFactory.createEntity('star');
      entity.transform.x = Math.random() * 100 - 50;
      entity.transform.y = Math.random() * 100 - 50;
      const scale = 0.2 + 0.1 * Math.random();
      entity.transform.scale[0] = scale;
      entity.transform.scale[1] = scale;
      __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].rotateZ(entity.transform.rotation, entity.transform.rotation, Math.random() * Math.PI);
      entity.renderable.color = 0xF2A900;
      entity.rotating.speed = Math.random() + 1;
    }
  }

  static createEntity(entityType)
  {
    const entity = GameFactory.INSTANCE.entityManager.createEntity(null, 2);
    const entityConstructor = GameFactory.INSTANCE.entityTypes.get(entityType);
    entityConstructor(entity);
    return entity;
  }
}

GameFactory.INSTANCE = new GameFactory();

/* harmony default export */ __webpack_exports__["a"] = (GameFactory);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Frame
{
  constructor(delta=0, then=0, count=0)
  {
    this.delta = 0;
    this.then = 0;
    this.count = 0;
  }

  set(frame)
  {
    this.delta = frame.delta;
    this.then = frame.then;
    this.count = frame.count;
    return this;
  }

  next(now)
  {
  	now *= 0.001;
  	this.delta = now - this.then;
  	this.then = now;
  	++this.count;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Frame);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Transform()
{
  this.x = 0;
  this.y = 0;
  this.position = [0, 0, 0];
  this.rotation = [0, 0, 0, 1];
  this.scale = [1, 1, 1];
}

/* harmony default export */ __webpack_exports__["a"] = (Transform);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Bullet()
{
  this.owner = null;
  this.life = 3;
  this.speedx = 0;
  this.speedy = 0;
}

/* harmony default export */ __webpack_exports__["a"] = (Bullet);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Reflection
{
  static getClassVarName(T)
  {
    const name = T.name;
    return name.charAt(0).toLowerCase() + name.slice(1);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Reflection);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("gl-matrix");

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class System
{
  constructor()
  {

  }

  onUpdate(entityManager, frame)
  {

  }

  onInputUpdate(targetEntity, inputState)
  {

  }

  writeToGameState(entityManager, gameState)
  {

  }

  readFromGameState(entityManager, gameState)
  {

  }
}

/* harmony default export */ __webpack_exports__["a"] = (System);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Player()
{
  this.socketID = -1;
  this.nextX = 0;
  this.nextY = 0;
  this.move = false;
}

/* harmony default export */ __webpack_exports__["a"] = (Player);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Renderable()
{
  this.model = 'square';
  this.color = 0xFFFFFF;
  this.visible = true;
}

/* harmony default export */ __webpack_exports__["a"] = (Renderable);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Motion()
{
  this.motionX = 0;
  this.motionY = 0;
  this.friction = 2;
}

/* harmony default export */ __webpack_exports__["a"] = (Motion);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Rotating()
{
  this.speed = 0.1;
}

/* harmony default export */ __webpack_exports__["a"] = (Rotating);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Follow()
{
  this.target = null;
  this.targetDistance = 2;
}

/* harmony default export */ __webpack_exports__["a"] = (Follow);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Application_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_integrated_NetworkHandler_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_server_ServerGame_js__ = __webpack_require__(19);








const __dirname = __WEBPACK_IMPORTED_MODULE_2_path___default.a.resolve();
const DEVMODE = process.argv.indexOf('--dev') != -1;
const TIMESTEP = 1000/10;
const PORT = process.env.PORT || 8082;

//Server Setup
const app = __WEBPACK_IMPORTED_MODULE_1_express___default()();
app.set('port', PORT);
app.use('/', __WEBPACK_IMPORTED_MODULE_1_express___default.a.static(__dirname + '/public'));
app.get('/', function(request, response) {
  response.sendFile(__WEBPACK_IMPORTED_MODULE_2_path___default.a.join(__dirname, 'index.html'));
});
app.get('/gl-matrix/gl-matrix.js', function(request, response) {
  response.sendFile(__WEBPACK_IMPORTED_MODULE_2_path___default.a.join(__dirname, 'node_modules/gl-matrix/dist/gl-matrix.js'));
});
const server = app.listen(PORT, function() {
  const port = server.address().port;
  console.log("Server is listening on port " + port + "...");
});

//Application Setup
function start()
{
	const socket = __WEBPACK_IMPORTED_MODULE_0_socket_io___default()(server);
	const network = new __WEBPACK_IMPORTED_MODULE_4_integrated_NetworkHandler_js__["a" /* default */](socket, false);
	const game = new __WEBPACK_IMPORTED_MODULE_5_server_ServerGame_js__["a" /* default */](network);
	__WEBPACK_IMPORTED_MODULE_3__Application_js__["a" /* default */].init(network, game)
    .then(() => { return game.load(); })
    .then(() => { return game.connect(); })
    .then(() => { setInterval(onInterval, TIMESTEP); });
}

function onInterval()
{
  __WEBPACK_IMPORTED_MODULE_3__Application_js__["a" /* default */].update();
}

//Start the server...
start();


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Frame_js__ = __webpack_require__(2);


class Application
{
  constructor()
  {
    this._frame = new __WEBPACK_IMPORTED_MODULE_0_util_Frame_js__["a" /* default */]();
  }

  init(network, game)
  {
    this._network = network;
    this._game = game;

    this._startTime = Date.now();

    this._now = 0;
    this._then = 0;
    this._delta = 0;
    this._frames = 0;

    //Display frames per second
    setInterval(() => {
      console.log("FPS " + this._frames);
      this._frames = 0;
    }, 1000);

    return new Promise(function(resolve, reject) {
      resolve();
    });
  }

  update()
  {
    this._then = this._now;
    this._now = Date.now() - this._startTime;
    this._delta = (this._now - this._then) * 0.001;
    this._frames++;

    this._frame.next(this._now);

    this._game.update(this._frame);
  }

  getFrameTime()
  {
    return this._delta;
  }

  getApplicationTime()
  {
    return this._now;
  }

  get network() { return this._network; }

  get game() { return this._game; }

  get remote() { return this._network.remote; }
}

/* harmony default export */ __webpack_exports__["a"] = (new Application());


/***/ }),
/* 18 */
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
      this.onClientConnect = (client, data) => {};
      this.onClientDisconnect = (client) => {};
    }
    else
    {
      //Client-side init
      this.socketID = -1;
      this.onServerConnect = (server, data) => {};
      this.onServerDisconnect = (server) => {};
    }
  }

  async initClient()
  {
    if (!this.remote) throw new Error("Initializing wrong network side");

    this.socket.on('disconnect', () => {
      console.log("Disconnected from server...");
      this.socketID = -1;
      this.onServerDisconnect(this.socket);

      window.close();
    });

    return new Promise((resolve, reject) => {
      this.socket.emit('client-handshake');
      this.socket.on('server-handshake', (data) => {
        console.log("Connected to server...");
        this.socketID = data.socketID;
        this.onServerConnect(this.socket, data);

        //Start game...
        resolve();
      });
    });
  }

  async initServer()
  {
    if (this.remote) throw new Error("Initializing wrong network side");

    this.socket.on('connection', (socket) => {
      socket.on('client-handshake', () => {
        console.log("Added client: " + socket.id);
        this.clients.set(socket.id, socket);
        const data = { socketID: socket.id };
        this.onClientConnect(socket, data);

        socket.emit('server-handshake', data);

        socket.on('disconnect', () => {
          this.onClientDisconnect(socket);
          console.log("Removed client: " + socket.id);
          this.clients.delete(socket.id);
        });
      });
    });

    return new Promise((resolve, reject) => {
      resolve();
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


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Frame_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_integrated_Game_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_server_PlayerManager_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_server_console_Console_js__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_game_GameFactory_js__ = __webpack_require__(1);









/*
SERVER stores CURRENT_INPUT_STATE.
SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
SERVER sends CURRENT_GAME_STATE to all CLIENTS.
*/

class ServerGame extends __WEBPACK_IMPORTED_MODULE_1_integrated_Game_js__["a" /* default */]
{
  constructor(networkHandler)
  {
    super(networkHandler);

    this.playerManager = new __WEBPACK_IMPORTED_MODULE_2_server_PlayerManager_js__["a" /* default */](this.world.entityManager);
  }

  async load()
  {
    console.log("Loading server...");

    //Setup console...
    this.onCommandSetup();

    //Setup world...
    this.onWorldSetup();
  }

  async connect()
  {
    console.log("Connecting server...");

    this.networkHandler.onClientConnect = (client, data) => {
      //Insert new player...
      const clientEntity = this.playerManager.createPlayer(client.id);
      data.entityID = clientEntity._id;

      //Send previous game state...
      const gameState = this.world.captureState();
      data.gameState = gameState;

      //Listening to the client...
      client.on('client.inputstate', (data) => {
        this.onClientUpdate(client, data);
      });
    };
    this.networkHandler.onClientDisconnect = (client) => {
      this.playerManager.destroyPlayer(client.id);
    };

    await this.networkHandler.initServer();
  }

  update(frame)
  {
    this.onUpdate(frame);
    this.playerManager.onUpdate(frame);
  }

  /************* Game Implementation *************/

  onCommandSetup()
  {
    __WEBPACK_IMPORTED_MODULE_3_server_console_Console_js__["a" /* default */].addCommand("stop", "stop", (args) => {
      console.log("Stopping server...");
      //TODO: ADD state-preservation features...
      console.log("Server stopped.");
      process.exit(0);
    });
  }

  onWorldSetup()
  {
    //TODO: ADD initial world state / loading
    __WEBPACK_IMPORTED_MODULE_4_game_GameFactory_js__["a" /* default */].createWorld(this);
  }

  onUpdate(frame)
  {
    const currentTicks = this.world.ticks + frame.delta;
    const nextFrame = new __WEBPACK_IMPORTED_MODULE_0_util_Frame_js__["a" /* default */]();

    //SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
    while(this.inputStates.length > 0)
    {
      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const inputState = this.inputStates.dequeue();
      const targetEntity = this.playerManager.getPlayerByClientID(inputState.target);

      //Update world to just before input...
      const dt = inputState.worldTicks - this.world.ticks;
      if (dt > 0)
      {
        nextFrame.delta = dt;
        this.world.step(nextFrame);
      }

      //Update world to after this input state...
      if (targetEntity) this.world.updateInput(inputState, targetEntity);
    }

    //Update world to current tick...
    const dt = currentTicks - this.world.ticks;
    if (dt > 0)
    {
      nextFrame.delta = dt;
      this.world.step(nextFrame);
    }

    //SERVER sends CURRENT_GAME_STATE to all CLIENTS.
    this.sendServerUpdate();
  }

  onClientUpdate(client, inputState)
  {
    //SERVER stores CURRENT_INPUT_STATE.
    inputState.target = client.id;
    this.inputStates.queue(inputState);
  }

  sendServerUpdate()
  {
    const gameState = this.world.captureState();
    this.networkHandler.sendToAll('server.gamestate', gameState);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (ServerGame);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_PriorityQueue_js__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_integrated_World_js__ = __webpack_require__(22);



class Game
{
  constructor(networkHandler, remote=true)
  {
    this.networkHandler = networkHandler;

    this.world = new __WEBPACK_IMPORTED_MODULE_1_integrated_World_js__["a" /* default */](this.networkHandler.remote);
    this.inputStates = new __WEBPACK_IMPORTED_MODULE_0_util_PriorityQueue_js__["a" /* default */]((a, b) => {
      return a.worldTicks - b.worldTicks;
    });
  }

  async load()
  {
  }

  async connect()
  {
  }

  update(frame)
  {
    throw new Error("must be overriden");
  }

  isRemote()
  {
    return this.networkHandler.remote;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PriorityQueue
{
  constructor(comparator)
  {
    this.comparator = comparator || ((a, b) => {
      return (a || 0) - (b || 0);
    });
    this.length = 0;
    this.data = [];
    this._heapify();
  }

  queue(value)
  {
    this.length++;
    this.data.push(value);
    this._bubbleUp(this.data.length - 1);
  }

  dequeue()
  {
    if (!this.length) throw new Error("empty queue");
    this.length--;
    var last, ret;
    ret = this.data[0];
    last = this.data.pop();
    if (this.data.length > 0)
    {
      this.data[0] = last;
      this._bubbleDown(0);
    }
    return ret;
  }

  peek()
  {
    if (!this.length) throw new Error("empty queue");
    return this.data[0];
  }

  clear()
  {
    this.length = 0;
    this.data.length = 0;
  }

  _heapify()
  {
    var i, j, ref;
    if (this.data.length > 0)
    {
      for (i = j = 1, ref = this.data.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j)
      {
        this._bubbleUp(i);
      }
    }
  }

  _bubbleUp(pos)
  {
    var parent, x;
    while (pos > 0)
    {
      parent = (pos - 1) >>> 1;
      if (this.comparator(this.data[pos], this.data[parent]) < 0)
      {
        x = this.data[parent];
        this.data[parent] = this.data[pos];
        this.data[pos] = x;
        pos = parent;
      }
      else
      {
        break;
      }
    }
  }

  _bubbleDown(pos)
  {
    var last, left, minIndex, right, x;
    last = this.data.length - 1;
    while (true)
    {
      left = (pos << 1) + 1;
      right = left + 1;
      minIndex = pos;
      if (left <= last && this.comparator(this.data[left], this.data[minIndex]) < 0)
      {
        minIndex = left;
      }
      if (right <= last && this.comparator(this.data[right], this.data[minIndex]) < 0)
      {
        minIndex = right;
      }
      if (minIndex !== pos)
      {
        x = this.data[minIndex];
        this.data[minIndex] = this.data[pos];
        this.data[pos] = x;
        pos = minIndex;
      }
      else
      {
        break;
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (PriorityQueue);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Frame_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_integrated_entity_EntityManager_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_integrated_entity_SystemManager_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_game_GameFactory_js__ = __webpack_require__(1);







class World
{
  constructor(remote=true)
  {
    this.remote = remote;
    this.ticks = 0;

    this.serverState = null;

    this.entityManager = new __WEBPACK_IMPORTED_MODULE_1_integrated_entity_EntityManager_js__["a" /* default */]();
    this.systemManager = new __WEBPACK_IMPORTED_MODULE_2_integrated_entity_SystemManager_js__["a" /* default */]();

    __WEBPACK_IMPORTED_MODULE_3_game_GameFactory_js__["a" /* default */].init(this);
  }

  step(frame, predictive=false)
  {
    this.ticks += frame.delta;

    //Continue to update the world state
    this.systemManager.update(this.entityManager, frame, predictive);
  }

  updateInput(inputState, targetEntity, predictive=false)
  {
    this.systemManager.updateInput(inputState, targetEntity, predictive);
  }

  captureState()
  {
    //Capture a GameState and return it for sending...
    const dst = {};
    this.systemManager.captureSystemStates(this.entityManager, dst);
    dst.worldTicks = this.ticks;
    return dst;
  }

  resetState(gameState)
  {
    this.ticks = gameState.worldTicks;

    //Continue to reset the world state
    this.systemManager.resetSystemStates(this.entityManager, gameState);

    //HACK: Prepare server state for rendering...
    this.serverState = gameState;
    this.serverState.entities = Object.values(gameState.entitylist);
  }

  get entities()
  {
    return this.entityManager.getEntities();
  }
}

/* harmony default export */ __webpack_exports__["a"] = (World);


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_stacktrace_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_stacktrace_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_stacktrace_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Entity_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_util_ObjectPool_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_util_uid_js__ = __webpack_require__(27);







class EntityManager
{
  constructor(E)
  {
    this.entities = [];
    this.entityPool = new __WEBPACK_IMPORTED_MODULE_3_util_ObjectPool_js__["a" /* default */](E || __WEBPACK_IMPORTED_MODULE_1__Entity_js__["a" /* default */]);

    this.components = new Map();
    this.nextEntityID = Object(__WEBPACK_IMPORTED_MODULE_4_util_uid_js__["a" /* default */])();

    this.onEntityCreate = (entity) => {};
    this.onEntityDestroy = (entity) => {};

    this._timestamp = null;
  }

  createEntity(id, depth=1)
  {
    const entity = this.entityPool.obtain();
    entity._manager = this;
    entity._id = id || this.getNextAvailableEntityID();
    entity._trace = getEntityFingerprint(this._timestamp, depth);
    this.entities.push(entity);

    this.onEntityCreate(entity);

    return entity;
  }

  destroyEntity(entity)
  {
    this.onEntityDestroy(entity);

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
      throw new Error("entity already includes component \'" + __WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(component) + "\'");
    }

    entity[__WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(component)] = new component();

    var list = this.components.get(component) || [];
    list.push(entity);
    this.components.set(component, list);
  }

  removeComponentFromEntity(entity, component)
  {
    if (!this.hasComponent(entity, component))
    {
      throw new Error("entity does not include component \'" + __WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(component) + "\'");
    }

    delete entity[__WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(component)];

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
        delete entity[__WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(key)];

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

  getEntityIterator()
  {
    return new EntityIterator(this);
  }

  getNextAvailableEntityID()
  {
    let iters = 100;
    let id = Object(__WEBPACK_IMPORTED_MODULE_4_util_uid_js__["a" /* default */])();
    while (this.entities[id])
    {
      id = Object(__WEBPACK_IMPORTED_MODULE_4_util_uid_js__["a" /* default */])();

      if (--iters <= 0)
        throw new Error("cannot find another unique entity id");
    }
    return id;
  }
}

function getEntityFingerprint(timestamp, depth)
{
  const stackTrace = __WEBPACK_IMPORTED_MODULE_0_stacktrace_js___default.a.getSync()[1 + depth];
  return timestamp + "@" + stackTrace.lineNumber + "," + stackTrace.columnNumber + ":" + stackTrace.functionName;
}

/* harmony default export */ __webpack_exports__["a"] = (EntityManager);


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("stacktrace-js");

/***/ }),
/* 25 */
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
    this.x = 0;
    this.y = 0;
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

  destroy()
  {
    this._manager.destroyEntity(this);
  }

  get id()
  {
    return this._id;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Entity);


/***/ }),
/* 26 */
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
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function generate()
{
  let fst = (Math.random() * 46656) | 0;
  let snd = (Math.random() * 46656) | 0;
  fst = ("000" + fst.toString(36)).slice(-3);
  snd = ("000" + snd.toString(36)).slice(-3);
  return fst + snd;
}

/* harmony default export */ __webpack_exports__["a"] = (generate);


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class SystemManager
{
  constructor()
  {
    this.systems = [];
    this.predictiveEntities = {};
  }

  update(entityManager, frame, predictive)
  {
    this.makePredictiveState(frame, predictive);

    for(const system of this.systems)
    {
      system.onUpdate(entityManager, frame.delta);
    }
  }

  updateInput(inputState, targetEntity, predictive)
  {
    this.makePredictiveState(inputState, predictive);

    for(const system of this.systems)
    {
      system.onInputUpdate(targetEntity, inputState);
    }
  }

  captureSystemStates(entityManager, dst)
  {
    for(const system of this.systems)
    {
      system.writeToGameState(entityManager, dst);
    }
  }

  resetSystemStates(entityManager, gameState)
  {
    this.resetEntityList(entityManager, gameState);

    for(const system of this.systems)
    {
      system.readFromGameState(entityManager, gameState);
    }
  }

  resetEntityList(entityManager, gameState)
  {
    //HACK: This is to correct any dead / alive entities left...
    const entities = gameState['entitylist'] || {};
    for(const entity of entityManager.getEntities())
    {
      if (!entities[entity._id] && !entity.tracker)
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

  makePredictiveState(state, predictive)
  {
    if (predictive || state.hasOwnProperty('predictive'))
    {
      state.predictiveFirst = (predictive && !state.predictive);
      state.predictive = predictive;
    }

    return state;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (SystemManager);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_integrated_entity_System_js__ = __webpack_require__(7);


class NetworkEntitySystem extends __WEBPACK_IMPORTED_MODULE_0_integrated_entity_System_js__["a" /* default */]
{
  constructor(entityManager)
  {
    super();

    this.createCache = [];
    this.destroyCache = [];

    entityManager.onEntityCreate = (entity) => {
      if (this.destroyCache.includes(entity._id))
      {
        this.destroyCache.splice(this.destroyCache.indexOf(entity._id), 1);
      }
      this.createCache.push(entity._id);
    };

    entityManager.onEntityDestroy = (entity) => {
      if (this.createCache.includes(entity._id))
      {
        this.createCache.splice(this.createCache.indexOf(entity._id), 1);
      }
      this.destroyCache.push(entity._id);
    };
  }

  onUpdate(entityManager, delta)
  {
    super.onUpdate(entityManager, delta);
  }

  onInputUpdate(entity, inputState)
  {
    super.onInputUpdate(entity, inputState)
  }

  writeToGameState(entityManager, gameState)
  {
    super.writeToGameState(entityManager, gameState);

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
    super.readFromGameState(entityManager, gameState);

    //BUG: This is not actually running...
    let entities = gameState['entities.create'] || [];
    for(const entityID of entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (entity) continue;

      entityManager.createEntity(entityID);
    }

    //BUG: This is not actually running...
    entities = gameState['entities.destroy'] || [];
    for(const entityID of entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (!entity) continue;

      entityManager.destroyEntity(entity);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (NetworkEntitySystem);


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_game_PlayerComponent_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_game_TransformComponent_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_game_RenderableComponent_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_game_BulletComponent_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_game_GameFactory_js__ = __webpack_require__(1);








class PlayerSystem extends __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__["a" /* default */]
{
  constructor()
  {
    super(__WEBPACK_IMPORTED_MODULE_1_game_PlayerComponent_js__["a" /* default */]);
  }

  onInputUpdate(entity, inputState)
  {
    if (!entity.hasComponent(__WEBPACK_IMPORTED_MODULE_1_game_PlayerComponent_js__["a" /* default */])) return;
    entity.player.nextX = inputState.x;
    entity.player.nextY = inputState.y;
    entity.player.move = inputState.down;
    //HACK: this will run once on server and client-side, needs a way to keep predicted alive
    if (inputState.click)// && !inputState.predictive)
    {
      const bulletSpeed = 10;
      const bulletEntity = __WEBPACK_IMPORTED_MODULE_5_game_GameFactory_js__["a" /* default */].createEntity('bullet');
      const dx = entity.player.nextX - entity.transform.x;
      const dy = entity.player.nextY - entity.transform.y;
      const rot = -Math.atan2(-dy, dx);
      bulletEntity.transform.x = entity.transform.x;
      bulletEntity.transform.y = entity.transform.y;
      bulletEntity.renderable.color = 0xFF00FF;
      bulletEntity.bullet.owner = entity._id;
      bulletEntity.bullet.speedx = Math.cos(rot) * bulletSpeed;
      bulletEntity.bullet.speedy = Math.sin(rot) * bulletSpeed;

      //FIXME: need to have a function to create predicted entity, and replace it later.
      //FIXME: this is because, this may be created multiple times, and should be the same.
      //FIXME: to keep track of the predicted entity, Valve fingerprints the code that is called.
      //FIXME: https://developer.valvesoftware.com/wiki/Prediction#Predicting_entity_creation

      //TODO: What you could do is make 2 different update loops: one for update once, and the other for predictions
    }
  }

  onEntityUpdate(entity, delta)
  {
    if (entity.player.move)
    {
      const dx = entity.player.nextX - entity.transform.x;
      const dy = entity.player.nextY - entity.transform.y;
      const rot = -Math.atan2(-dy, dx);

      const speed = 15.0;
      entity.motion.motionX += Math.cos(rot) * speed * delta;
      entity.motion.motionY += Math.sin(rot) * speed * delta;
    }
  }

  writeEntityToData(entity, dst)
  {
    dst.player.nextX = entity.player.nextX;
    dst.player.nextY = entity.player.nextY;
    dst.player.move = entity.player.move;
  }

  readEntityFromData(src, entity)
  {
    entity.player.nextX = src.player.nextX;
    entity.player.nextY = src.player.nextY;
    entity.player.move = src.player.move;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (PlayerSystem);


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_game_MotionComponent_js__ = __webpack_require__(10);



class MotionSystem extends __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__["a" /* default */]
{
  constructor()
  {
    super(__WEBPACK_IMPORTED_MODULE_1_game_MotionComponent_js__["a" /* default */]);
  }

  onEntityUpdate(entity, delta)
  {
    const fricRatio = 1.0 / (1.0 + (delta * entity.motion.friction));
    entity.motion.motionX *= fricRatio;
    entity.motion.motionY *= fricRatio;
    entity.transform.x += entity.motion.motionX * delta;
    entity.transform.y += entity.motion.motionY * delta;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (MotionSystem);


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_game_TransformComponent_js__ = __webpack_require__(3);



class TransformSystem extends __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__["a" /* default */]
{
  constructor()
  {
    super(__WEBPACK_IMPORTED_MODULE_1_game_TransformComponent_js__["a" /* default */]);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (TransformSystem);


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_game_BulletComponent_js__ = __webpack_require__(4);



class BulletSystem extends __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__["a" /* default */]
{
  constructor()
  {
    super(__WEBPACK_IMPORTED_MODULE_1_game_BulletComponent_js__["a" /* default */]);
  }

  onEntityUpdate(entity, delta)
  {
    //TODO: this would be a problem when calculating collision...
    entity.life -= delta;
    if (entity.life < 0)
    {
      entity.destroy();
    }
    else
    {
      entity.transform.x += entity.bullet.speedx * delta;
      entity.transform.y += entity.bullet.speedy * delta;
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (BulletSystem);


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_game_SynchronizedSystem_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_game_RotatingComponent_js__ = __webpack_require__(11);





class RotatingSystem extends __WEBPACK_IMPORTED_MODULE_1_game_SynchronizedSystem_js__["a" /* default */]
{
  constructor()
  {
    super(__WEBPACK_IMPORTED_MODULE_2_game_RotatingComponent_js__["a" /* default */]);
  }

  onEntityUpdate(entity, delta)
  {
    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].rotateZ(entity.transform.rotation, entity.transform.rotation, entity.rotating.speed * delta);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (RotatingSystem);


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_game_FollowComponent_js__ = __webpack_require__(12);



class FollowSystem extends __WEBPACK_IMPORTED_MODULE_0_game_SynchronizedSystem_js__["a" /* default */]
{
  constructor()
  {
    super(__WEBPACK_IMPORTED_MODULE_1_game_FollowComponent_js__["a" /* default */]);
  }

  onEntityUpdate(entity, delta)
  {
    if (entity.follow.target != null)
    {
      const targetEntity = entity.follow.target;
      const dx = targetEntity.transform.x - entity.transform.x;
      const dy = targetEntity.transform.y - entity.transform.y;
      const distSqu = dx * dx + dy * dy;
      if (distSqu > entity.follow.targetDistance * entity.follow.targetDistance)
      {
        const dist = Math.sqrt(distSqu);
        entity.motion.motionX += (dx / dist) * delta;
        entity.motion.motionY += (dy / dist) * delta;
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (FollowSystem);


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_game_GameFactory_js__ = __webpack_require__(1);


class PlayerManager
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    this.players = new Map();
  }

  createPlayer(socketID)
  {
    const entity = __WEBPACK_IMPORTED_MODULE_0_game_GameFactory_js__["a" /* default */].createEntity('player');
    entity.player.socketID = socketID;
    this.players.set(socketID, entity);
    return entity;
  }

  destroyPlayer(socketID)
  {
    const entity = this.players.get(socketID);
    this.players.delete(socketID);
    this.entityManager.destroyEntity(entity);
  }

  onUpdate(frame)
  {
    //Nothing here really...
  }

  getPlayerByClientID(socketID)
  {
    return this.players.get(socketID);
  }

  getPlayers()
  {
    return this.players.values();
  }
}

/* harmony default export */ __webpack_exports__["a"] = (PlayerManager);


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_readline__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_readline___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_readline__);


const rl = __WEBPACK_IMPORTED_MODULE_0_readline___default.a.createInterface({
  input: process.stdin,
  output: process.stdout
});

const command = {
  commands: new Map(),
  infos: new Map(),
  addCommand: function(name, info, callback)
  {
    this.commands.set(name, callback);
    this.infos.set(name, info);
    return this; //For method chaining
  },
  removeCommand: function(name)
  {
    this.commands.delete(name);
    this.infos.delete(name);
    return this; //For method chaining
  },
  hasCommand: function(name)
  {
    return this.commands.has(name);
  },
  getCommand: function(name)
  {
    return this.commands.get(name);
  },
  getCommandInfo: function(name)
  {
    return this.infos.get(name);
  }
};

rl.on('line', (input) => {
  let inputs = input.split(' ');
  let name = inputs[0];
  if (command.hasCommand(name))
  {
    let callback = command.getCommand(name);
    try
    {
      inputs.splice(0, 1);
      callback(inputs);
    }
    catch (e)
    {
      console.log(e);
      console.log(command.getCommandInfo(name));
    }
  }
  else if (name == "help")
  {
    for (const c of this.commands.keys())
    {
      console.log(c + ": " + command.infos.get(c));
    }
    console.log("Press \'CTRL-C\' to close the server.");
  }
  else
  {
    console.log("ERROR: Unknown command \'" + name + "\'.");
  }
});

/* harmony default export */ __webpack_exports__["a"] = (command);


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ })
/******/ ]);