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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Frame_js__ = __webpack_require__(10);


class Application
{
  constructor()
  {
    this._frame = new __WEBPACK_IMPORTED_MODULE_0_util_Frame_js__["a" /* default */]();
  }

  async init(network, game)
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

    await this._game.load();
  }

  update()
  {
    this._then = this._now;
    this._now = Date.now() - this._startTime;
    this._delta = (this._now - this._then) * 0.001;
    this._frames++;

    //TODO: slowly get rid of frame and use this._delta
    //this._frame.next(this._now);
    this._game.update(this._delta);
  }

  getFrameTime()
  {
    return this._delta;
  }

  getApplicationTime()
  {
    return this._now;
  }

  isRemote()
  {
    return this._network.remote;
  }

  get network() { return this._network; }

  get game() { return this._game; }
}

/* harmony default export */ __webpack_exports__["a"] = (new Application());


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EventHandler
{
  constructor()
  {
    this.eventMap = new Map();
  }

  addListener(eventName, listener)
  {
    if (!this.eventMap.has(eventName)) this.eventMap.set(eventName, []);

    const listeners = this.eventMap.get(eventName);
    listeners.push(listener);
  }

  removeListener(eventName, listener)
  {
    if (!this.eventMap.has(eventName)) return;

    const listeners = this.eventMap.get(eventName);
    listeners.splice(listeners.indexOf(listener), 1);
  }

  clearListeners(eventName)
  {
    if (!this.eventMap.has(eventName)) return;

    const listeners = this.eventMap.get(eventName);
    listeners.length = 0;
  }

  countListeners(eventName)
  {
    return this.eventMap.has(eventName) ? this.eventMap.get(eventName).length : 0;
  }

  getListeners(eventName)
  {
    return this.eventMap.get(eventName);
  }

  emit(eventName)
  {
    if (!this.eventMap.has(eventName)) return;

    //Can pass additional args to listeners here...
    const args = Array.prototype.splice.call(arguments, 1);
    const listeners = this.eventMap.get(eventName);
    const length = listeners.length;
    let i = 0;
    while(i < length)
    {
      const listener = listeners[i];
      const result = listener.apply(null, args);
      if (result)
      {
        listeners.splice(i, 1);
        --i;
      }
      else
      {
        ++i;
      }
    }
  }

  on(eventName, listener)
  {
    this.addListener(eventName, listener);
  }

  once(eventName, listener)
  {
    this.addListener(eventName, () => {
      listener();
      return true;
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EventHandler);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Entity
{
  constructor()
  {
    this._manager = null;
    this.__init();
  }

  __init()
  {
    this._id = 0;
    this._name = null;
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
    return this._manager.hasComponentByEntity(this, component);
  }

  destroy()
  {
    this._manager.destroyEntity(this);
  }

  get id() { return this._id; }
}

/* harmony default export */ __webpack_exports__["a"] = (Entity);


/***/ }),
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Transform()
{
  this.x = 0;
  this.y = 0;
}

/* harmony default export */ __webpack_exports__["a"] = (Transform);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Application_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_integrated_NetworkHandler_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_test_ServerGame_js__ = __webpack_require__(12);








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
	const game = new __WEBPACK_IMPORTED_MODULE_5_test_ServerGame_js__["a" /* default */]();
	__WEBPACK_IMPORTED_MODULE_3__Application_js__["a" /* default */].init(network, game)
		.then(() => setInterval(onInterval, TIMESTEP));
}

function onInterval()
{
  __WEBPACK_IMPORTED_MODULE_3__Application_js__["a" /* default */].update();
}

//Start the server...
start();


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_EventHandler_js__ = __webpack_require__(1);


class NetworkHandler
{
  constructor(socket, remote=true)
  {
    this.events = new __WEBPACK_IMPORTED_MODULE_0_util_EventHandler_js__["a" /* default */]();
    this.socket = socket;
    this.remote = remote;

    if (!this.remote)
    {
      //Server-side init
      this.clients = new Map();
    }
    else
    {
      //Client-side init
      this.socketID = -1;
    }
  }

  async initClient()
  {
    if (!this.remote) throw new Error("Initializing wrong network side");

    this.socket.on('disconnect', () => {
      console.log("Disconnected from server...");
      this.socketID = -1;
      this.events.emit('serverDisconnect', this.socket);

      window.close();
    });

    return new Promise((resolve, reject) => {
      this.socket.emit('client-handshake');
      this.socket.on('server-handshake', (data) => {
        console.log("Connected to server...");
        this.socketID = data.socketID;
        this.events.emit('serverConnect', this.socket, data);

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
        this.events.emit('clientConnect', socket, data);

        socket.emit('server-handshake', data);

        socket.on('disconnect', () => {
          this.events.emit('clientDisconnect', socket);
          console.log("Removed client: " + socket.id);
          this.clients.delete(socket.id);
        });
      });
    });
  }

  sendTo(id, data, dst)
  {
    dst.emit(id, data);
  }

  sendToServer(id, data)
  {
    if (!this.remote) throw new Error("Unable to send packet to self");

    this.sendTo(id, data, this.socket);
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_PriorityQueue_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_server_console_Console_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_Application_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_test_World_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_test_RemotePlayer_js__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_test_GameWorld_js__ = __webpack_require__(23);











class ServerGame
{
  constructor()
  {
    this.world = new __WEBPACK_IMPORTED_MODULE_4_test_World_js__["a" /* default */]();
    this.inputStates = new __WEBPACK_IMPORTED_MODULE_1_util_PriorityQueue_js__["a" /* default */]((a, b) => {
      return a.worldTicks - b.worldTicks;
    });

    this.players = [];
  }

  async load()
  {
    console.log("Loading server...");
    __WEBPACK_IMPORTED_MODULE_6_test_GameWorld_js__["a" /* default */].init(this);

    //Setup console...
    this.onCommandSetup();

    //Setup world...
    this.onWorldSetup();

    await this.connect();
  }

  async connect()
  {
    console.log("Connecting server...");

    __WEBPACK_IMPORTED_MODULE_3_Application_js__["a" /* default */].network.events.on('clientConnect', (client, data) => {
      //Insert new player...
      const playerEntity = this.world.entityManager.spawnEntity('player');
      data.playerID = playerEntity.id;
      data.clientID = client.id;
      //TODO: Load and send player data...
      const player = new __WEBPACK_IMPORTED_MODULE_5_test_RemotePlayer_js__["a" /* default */](playerEntity, client.id);
      this.players.push(player);

      //Send previous game state...
      data.initialState = this.world.saveState();

      //Listening to the client...
      client.on('client.inputstate', (data) => {
        this.onClientUpdate(client, data);
      });
    });

    __WEBPACK_IMPORTED_MODULE_3_Application_js__["a" /* default */].network.events.on('clientDisconnect', (client) => {
      const player = this.getPlayerByClientID(client.id);
      this.world.entityManager.destroyEntity(player.entity);
      this.players.splice(this.players.indexOf(player), 1);
    });

    await __WEBPACK_IMPORTED_MODULE_3_Application_js__["a" /* default */].network.initServer();
  }

  onCommandSetup()
  {
    __WEBPACK_IMPORTED_MODULE_2_server_console_Console_js__["a" /* default */].addCommand("stop", "stop", (args) => {
      console.log("Stopping server...");
      //TODO: ADD state-preservation features...
      console.log("Server stopped.");
      process.exit(0);
    });
  }

  onWorldSetup()
  {
    __WEBPACK_IMPORTED_MODULE_6_test_GameWorld_js__["a" /* default */].create(this);
  }

  update(delta)
  {
    //SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
    while(this.inputStates.length > 0)
    {
      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const inputState = this.inputStates.dequeue();
      const player = this.getPlayerByClientID(inputState.clientID);
      if (!player) throw new Error("cannot find player with id \'" + inputState.clientID + "\'");

      //Update world to just before input...
      const dt = inputState.ticks - this.world.ticks;
      player.onInputUpdate(inputState);
      player.onUpdate(delta);
    }

    //SERVER sends CURRENT_GAME_STATE to all CLIENTS.
    this.sendServerUpdate();
  }

  onClientUpdate(client, inputState)
  {
    //SERVER stores CURRENT_INPUT_STATE.
    inputState.clientID = client.id;
    this.inputStates.queue(inputState);
  }

  sendServerUpdate()
  {
    const gameState = this.world.captureState();
    __WEBPACK_IMPORTED_MODULE_3_Application_js__["a" /* default */].network.sendToAll('server.gamestate', gameState);
  }

  getPlayerByClientID(clientID)
  {
    for(const player of this.players)
    {
      if (player.clientID === clientID)
      {
        return player;
      }
    }

    return null;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (ServerGame);


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("gl-matrix");

/***/ }),
/* 14 */
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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_readline__ = __webpack_require__(16);
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
/* 16 */
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_test_EntityManager_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Application_js__ = __webpack_require__(0);




class World
{
  constructor()
  {
    this.worldTicks = 0;

    this.eventCache = [];
    this.entityManager = new __WEBPACK_IMPORTED_MODULE_0_test_EntityManager_js__["a" /* default */]();
    this.entityManager.events.on('entityCreate', (entity, name) => {
      this.eventCache.push({
        name: 'entityCreate',
        target: entity.id,
        targetName: name
      });
    });
    this.entityManager.events.on('entityDestroy', (entity) => {
      this.eventCache.push({
        name: 'entityDestroy',
        target: entity.id
      });
    });
  }

  update(delta)
  {
    this.worldTicks += delta;
    this.entityManager.update(delta);
  }

  saveState()
  {
    const gameState = {
      ticks: this.worldTicks,
      entities: {},
      players: {}
    };

    for(const system of this.entityManager.systems)
    {
      system.saveToGameState(this.entityManager, gameState);
    }

    for(const entity of this.entityManager.entities)
    {
      let entityData = gameState.entities[entity.id];
      if (!entityData) entityData = gameState.entities[entity.id] = {};
      entityData.name = entity._name;
    }

    return gameState;
  }

  loadState(gameState)
  {
    this.worldTicks = gameState.ticks;
    for(const entityID in gameState.entities)
    {
      const entityData = gameState.entities[entityID];
      let entity = this.entityManager.getEntityByID(entityID);
      if (!entity)
      {
        entity = this.entityManager.spawnEntity(entityData.name);
        entity._id = entityID;
      }
    }

    for(const system of this.entityManager.systems)
    {
      system.loadFromGameState(this.entityManager, gameState);
    }
  }

  captureState()
  {
    const gameState = {
      ticks: this.worldTicks,
      events: [],
      entities: {}
    };

    gameState.events = [];
    for(const event of this.eventCache)
    {
      gameState.events.push(event);
    }
    this.eventCache.length = 0;

    for(const system of this.entityManager.systems)
    {
      system.writeToGameState(this.entityManager, gameState);
    }

    return gameState;
  }

  resetState(gameState)
  {
    this.worldTicks = gameState.ticks;

    for(const event of gameState.events)
    {
      if (event.name === 'entityCreate')
      {
        console.log("Created entity \'" + event.targetName + "\'...");
        if (this.entityManager.getEntityByID(event.target)) continue;
        const entity = this.entityManager.spawnEntity(event.targetName);
        entity._id = event.target;
      }
      else if (event.name === 'entityDestroy')
      {
        console.log("Destroyed entity...");
        if (!this.entityManager.entities[event.target]) continue;
        const entity = this.entityManager.getEntityByID(event.target);
        if (!entity) throw new Error("Cannot find entity by id \'" + event.taraget + "\' for removal");
        this.entityManager.destroyEntity(entity);
      }
      else
      {
        throw new Error("Unknown event type for entity");
      }
    }
    this.eventCache.length = 0;

    for(const system of this.entityManager.systems)
    {
      system.readFromGameState(this.entityManager, gameState);
    }
  }

  get entities() { return this.entityManager.entities; }
}

/* harmony default export */ __webpack_exports__["a"] = (World);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_stacktrace_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_stacktrace_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_stacktrace_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_test_Entity_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_util_ObjectPool_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_util_uid_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_util_EventHandler_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__EntityRegistry_js__ = __webpack_require__(21);










class EntityManager
{
  constructor()
  {
    this.entities = [];
    this.systems = [];
    this.components = new Map();
    this.registry = new __WEBPACK_IMPORTED_MODULE_6__EntityRegistry_js__["a" /* default */](this);

    this.events = new __WEBPACK_IMPORTED_MODULE_5_util_EventHandler_js__["a" /* default */]();
  }

  update(delta)
  {
    for(const system of this.systems)
    {
      system.onUpdate(this, delta);
    }
  }

  getEntityByID(id)
  {
    for(const entity of this.entities)
    {
      if (entity._id === id) return entity;
    }
    return null;
  }

  spawnEntity(name)
  {
    const entity = this.registry.createEntity(name);
    this.events.emit('entityCreate', entity, name);
    return entity;
  }

  destroyEntity(entity)
  {
    this.events.emit('entityDestroy', entity);
    this.registry.deleteEntity(entity);
  }

  clearEntities()
  {
    while(this.entities.length > 0)
    {
      this.registry.deleteEntity(this.entities[0]);
    }
  }

  registerEntity(name, generator)
  {
    this.registry.register(name, generator);
  }

  unregisterEntity(name)
  {
    this.registry.unregister(name);
  }

  addSystem(system)
  {
    this.systems.push(system);
  }

  removeSystem(system)
  {
    this.systems.splice(this.systems.indexOf(system), 1);
  }

  addComponentToEntity(entity, component)
  {
    if (this.hasComponentByEntity(entity, component))
    {
      throw new Error("entity already includes component \'" + __WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(component) + "\'");
    }

    entity[__WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(component)] = new component();

    const list = this.components.get(component) || [];
    list.push(entity);
    this.components.set(component, list);

    this.events.emit('entityComponentAdd', entity, component);
  }

  removeComponentFromEntity(entity, component)
  {
    if (!this.hasComponentByEntity(entity, component))
    {
      throw new Error("entity does not include component \'" + __WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(component) + "\'");
    }

    delete entity[__WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(component)];

    const list = this.components.get(component);
    if (list)
    {
      list.splice(list.indexOf(entity), 1);
    }

    this.events.emit('entityComponentRemove', entity, component);
  }

  clearComponentsFromEntity(entity)
  {
    for(const [key, list] of this.components)
    {
      if (list.includes(entity))
      {
        const component = entity[__WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(key)];
        delete entity[__WEBPACK_IMPORTED_MODULE_2_util_Reflection_js__["a" /* default */].getClassVarName(key)];

        list.splice(list.indexOf(entity), 1);

        this.events.emit('entityComponentRemove', entity, component);
      }
    }
  }

  hasComponentByEntity(entity, component)
  {
    const list = this.components.get(component);
    return list && list.includes(entity);
  }

  getComponentsByEntity(entity)
  {
    const result = [];
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
}

/* harmony default export */ __webpack_exports__["a"] = (EntityManager);


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("stacktrace-js");

/***/ }),
/* 20 */
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
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Entity_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_ObjectPool_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_util_uid_js__ = __webpack_require__(4);





class EntityRegistry
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
    this.entityMap = new Map();
    this.entityPool = new __WEBPACK_IMPORTED_MODULE_1_util_ObjectPool_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__Entity_js__["a" /* default */]);
  }

  register(name, entityGenerator)
  {
    this.entityMap.set(name, entityGenerator);
  }

  unregister(name)
  {
    this.entityMap.delete(name);
  }

  createEntity(name)
  {
    const generator = this.entityMap.get(name);
    if (!generator) throw new Error("entity \'" + name + "\' is not registered");
    const entity = this._createEntity();
    entity._manager = this.entityManager;
    entity._name = name;
    this.entityManager.entities.push(entity);
    generator.apply(entity);
    return entity;
  }

  deleteEntity(entity)
  {
    entity.clearComponents();
    this.entityManager.entities.splice(this.entityManager.entities.indexOf(entity), 1);
    this.entityPool.release(entity);
  }

  _createEntity()
  {
    const entity = this.entityPool.obtain();
    entity._manager = this.entityManager;
    entity._id = this._nextAvailableEntityID();
    return entity;
  }

  _nextAvailableEntityID()
  {
    let iters = 100;
    let id = Object(__WEBPACK_IMPORTED_MODULE_2_util_uid_js__["a" /* default */])();
    while (this.entityManager.entities[id])
    {
      id = Object(__WEBPACK_IMPORTED_MODULE_2_util_uid_js__["a" /* default */])();

      if (--iters <= 0)
        throw new Error("cannot find another unique entity id");
    }
    return id;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EntityRegistry);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class RemotePlayer
{
  constructor(entity, clientID)
  {
    this.entity = entity;
    this.clientID = clientID;
  }

  onUpdate(delta)
  {
    
  }

  onInputUpdate(inputState)
  {
    this.entity.transform.x = inputState.x;
    this.entity.transform.y = inputState.y;
  }

  saveToGameState(gameState)
  {
  }

  loadFromGameState(gameState)
  {
  }

  writeToGameState(gameState)
  {

  }

  readFromGameState(gameState)
  {

  }
}

/* harmony default export */ __webpack_exports__["a"] = (RemotePlayer);


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Application_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_test_SystemMotion_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_test_ComponentTransform_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_test_ComponentRenderable_js__ = __webpack_require__(26);







class GameWorld
{
  constructor()
  {
    this.entityManager = null;
  }

  init(game)
  {
    this.entityManager = game.world.entityManager;

    this.entityManager.addSystem(new __WEBPACK_IMPORTED_MODULE_1_test_SystemMotion_js__["a" /* default */]());

    this.entityManager.registerEntity('player', function() {
      this.addComponent(__WEBPACK_IMPORTED_MODULE_2_test_ComponentTransform_js__["a" /* default */]);
      this.addComponent(__WEBPACK_IMPORTED_MODULE_3_test_ComponentRenderable_js__["a" /* default */]);
      this.renderable.color = 0xFF00FF;
    });

    this.entityManager.registerEntity('star', function() {
      this.addComponent(__WEBPACK_IMPORTED_MODULE_2_test_ComponentTransform_js__["a" /* default */]);
      this.addComponent(__WEBPACK_IMPORTED_MODULE_3_test_ComponentRenderable_js__["a" /* default */]);
    });
  }

  create(game)
  {
    if (__WEBPACK_IMPORTED_MODULE_0_Application_js__["a" /* default */].isRemote()) throw new Error('must be server-side');
    if (this.entityManager == null) throw new Error('must init first');

    //populate with random
    for(let i = 0; i < 100; ++i)
    {
      const entity = this.entityManager.spawnEntity('star');
      entity.transform.x = Math.random() * 100 - 50;
      entity.transform.y = Math.random() * 100 - 50;
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (new GameWorld());


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_test_System_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_test_ComponentTransform_js__ = __webpack_require__(5);




class SystemMotion extends __WEBPACK_IMPORTED_MODULE_0_test_System_js__["a" /* default */]
{
  constructor()
  {
    super();
  }

  onUpdate(entityManager, delta)
  {
    //Interpolating...
    const entities = entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_1_test_ComponentTransform_js__["a" /* default */]);
    for(const entity of entities)
    {
      entity.transform.x = entity.transform.x + (entity.transform.nextX - entity.transform.x) * delta;
      entity.transform.y = entity.transform.y + (entity.transform.nextY - entity.transform.y) * delta;
    }
  }

  saveToGameState(entityManager, gameState)
  {
    const entities = entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_1_test_ComponentTransform_js__["a" /* default */]);
    for(const entity of entities)
    {
      let result = gameState.entities[entity.id];
      if (!result) result = gameState.entities[entity.id] = {};
      if (!result.transform) result.transform = {};
      result.transform.x = entity.transform.x;
      result.transform.y = entity.transform.y;
    }
  }

  loadFromGameState(entityManager, gameState)
  {
    const entities = entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_1_test_ComponentTransform_js__["a" /* default */]);
    for(const entity of entities)
    {
      const result = gameState.entities[entity.id];
      if (!result) continue;
      if (!result.transform) continue;
      entity.transform.nextX = result.transform.x;
      entity.transform.nextY = result.transform.y;
    }
  }

  writeToGameState(entityManager, gameState)
  {
    const entities = entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_1_test_ComponentTransform_js__["a" /* default */]);
    for(const entity of entities)
    {
      let result = gameState.entities[entity.id];
      if (!result) result = gameState.entities[entity.id] = {};
      if (!result.transform) result.transform = {};
      result.transform.x = entity.transform.x;
      result.transform.y = entity.transform.y;
    }
  }

  readFromGameState(entityManager, gameState)
  {
    const entities = entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_1_test_ComponentTransform_js__["a" /* default */]);
    for(const entity of entities)
    {
      let result = gameState.entities[entity.id];
      if (!result) continue;
      if (!result.transform) continue;
      entity.transform.nextX = result.transform.x;
      entity.transform.nextY = result.transform.y;
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (SystemMotion);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class System
{
  constructor()
  {

  }

  onUpdate(entityManager, delta)
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
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Renderable()
{
  this.visible = true;
  this.color = 0xFFFFFF;
}

/* harmony default export */ __webpack_exports__["a"] = (Renderable);


/***/ })
/******/ ]);