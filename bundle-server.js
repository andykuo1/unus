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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Serializer
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = propertyData;
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = propertyData;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Serializer);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("gl-matrix");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Eventable_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shared_NetworkHandler_js__ = __webpack_require__(14);



const DEBUG_PRINT_FPS = true;

const MILLIS_PER_SECOND = 1000;
const SECOND_PER_MILLIS = 0.001;

//applicationStart - Called when application starts, before updating
//applicationUpdate - Called each tick
//applicationStop - Called when application stops, after updating
class Application
{
  constructor()
  {
    this._startTime = -1;
    this._stopTime = -1;
    this._now = -1;
    this._then = -1;
    this._delta = 0;
    this._frames = 0;

    this._remote = typeof window != 'undefined' && window.document;

    this._debug_interval = null;
    this._update_interval = null;

    this.client = null;
    this.server = null;
    this.network = new __WEBPACK_IMPORTED_MODULE_1_shared_NetworkHandler_js__["a" /* default */]();
  }

  start()
  {
    if (this._startTime !== -1)
    {
      throw new Error("Application already started");
    }

    this._stopTime = -1;
    this._startTime = Date.now();
    this._now = 0;
    this._then = 0;
    this._delta = 0;
    this._frames = 0;

    if (this._remote && window.requestAnimationFrame)
    {
      const callback = () => {
        this.update();
        if (this._stopTime !== -1) return;
        window.requestAnimationFrame(callback);
      };
      window.requestAnimationFrame(callback);
    }
    else
    {
      const networkSide = this.server || this.client;
      if (networkSide.tickRate <= 0)
      {
        throw new Error("Cannot start application with tick rate <= 0");
      }

      this._update_interval = setInterval(this.update.bind(this), networkSide.tickRate);
    }

    if (DEBUG_PRINT_FPS)
    {
      this._debug_interval = setInterval(() => {
        console.log("FPS " + this._frames);
        this._frames = 0;
      }, MILLIS_PER_SECOND);
    }

    this.emit('applicationStart');
  }

  stop()
  {
    this._stopTime = this._now;

    if (this._debug_interval !== null)
    {
      clearInterval(this._debug_interval);
      this._debug_interval = null;
    }

    if (this._update_interval !== null)
    {
      clearInterval(this._update_interval);
      this._update_interval = null;
    }

    this.emit('applicationStop');

    if (this._remote && window.close)
    {
      window.close();
    }
    else
    {
      process.exit(0);
    }
  }

  update()
  {
    this._then = this._now;
    this._now = Date.now() - this._startTime;
    this._delta = (this._now - this._then) * SECOND_PER_MILLIS;
    this._frames++;

    this.emit('applicationUpdate', this._delta);
  }

  getApplicationTime()
  {
    return this._now;
  }

  getFrameTime()
  {
    return this._delta;
  }

  isRemote()
  {
    return this._remote;
  }
}

Object.assign(Application.prototype, __WEBPACK_IMPORTED_MODULE_0_util_Eventable_js__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (new Application());


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = lerp;
/* unused harmony export clamp */
/* unused harmony export sign */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);


function lerp(a, b, dt)
{
  if (typeof a == 'number' && typeof b == 'number')
  {
    return a * (1 - dt) + b * dt;
  }
  else
  {
    throw new Error("unable to lerp object \'" + a + "\' and \'" + b + "\'");
  }
}

function clamp(a, min, max)
{
  return Math.min(Math.max(value, min), max);
}

function sign(a)
{
  return a > 0 ? 1 : a < 0 ? -1 : 0;
}

/*
Math.lerp = lerp;
Math.clamp = clamp;
*/


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Eventable = {
  __events: new Map(),
  addListener(eventName, listener)
  {
    if (!this.__events.has(eventName)) this.__events.set(eventName, []);

    const listeners = this.__events.get(eventName);
    listeners.push(listener);
  },
  removeListener(eventName, listener)
  {
    if (!this.__events.has(eventName)) return;

    const listeners = this.__events.get(eventName);
    listeners.splice(listeners.indexOf(listener), 1);
  },
  clearListeners(eventName)
  {
    if (!this.__events.has(eventName)) return;

    const listeners = this.__events.get(eventName);
    listeners.length = 0;
  },
  countListeners(eventName)
  {
    return this.__events.has(eventName) ? this.__events.get(eventName).length : 0;
  },
  getListeners(eventName)
  {
    return this.__events.get(eventName);
  },
  emit(eventName)
  {
    if (!this.__events.has(eventName)) return;

    //Can pass additional args to listeners here...
    const args = Array.prototype.splice.call(arguments, 1);
    const listeners = this.__events.get(eventName);
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

    this.onEventProcessed(eventName, args);
  },
  on(eventName, listener)
  {
    this.addListener(eventName, listener);
  },
  once(eventName, listener)
  {
    this.addListener(eventName, () => {
      listener();
      return true;
    });
  },
  onEventProcessed(eventName, args)
  {
    //Do nothing...
  }
};

/* harmony default export */ __webpack_exports__["a"] = (Eventable);


/***/ }),
/* 5 */
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

  getComponents()
  {
    return this._manager.getComponentsByEntity(this);
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

  get name() { return this._name; }
}

/* harmony default export */ __webpack_exports__["a"] = (Entity);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Reflection_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_UID_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_util_Eventable_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__EntityRegistry_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Entity_js__ = __webpack_require__(5);







class EntityManager
{
  constructor()
  {
    this.entities = [];
    this.components = new Map();
    this.registry = new __WEBPACK_IMPORTED_MODULE_3__EntityRegistry_js__["a" /* default */](this);
  }

  getEntityByID(id)
  {
    for(const entity of this.entities)
    {
      if (entity._id === id) return entity;
    }
    return null;
  }

  spawnEntity(name=null)
  {
    const entity = this.registry.createEntity(name);
    this.emit('entityCreate', entity, name);
    return entity;
  }

  destroyEntity(entity)
  {
    this.emit('entityDestroy', entity);
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

  addComponentToEntity(entity, component)
  {
    if (this.hasComponentByEntity(entity, component))
    {
      throw new Error("entity already includes component \'" + __WEBPACK_IMPORTED_MODULE_0_util_Reflection_js__["a" /* default */].getClassName(component) + "\'");
    }

    if (!component)
    {
      throw new Error("cannot add undefined component to entity");
    }

    entity[__WEBPACK_IMPORTED_MODULE_0_util_Reflection_js__["a" /* default */].getClassName(component)] = new component();

    const list = this.components.get(component) || [];
    list.push(entity);
    this.components.set(component, list);

    this.emit('entityComponentAdd', entity, component);
  }

  removeComponentFromEntity(entity, component)
  {
    if (!this.hasComponentByEntity(entity, component))
    {
      throw new Error("entity does not include component \'" + __WEBPACK_IMPORTED_MODULE_0_util_Reflection_js__["a" /* default */].getClassName(component) + "\'");
    }

    delete entity[__WEBPACK_IMPORTED_MODULE_0_util_Reflection_js__["a" /* default */].getClassName(component)];

    const list = this.components.get(component);
    if (list)
    {
      list.splice(list.indexOf(entity), 1);
    }

    this.emit('entityComponentRemove', entity, component);
  }

  clearComponentsFromEntity(entity)
  {
    for(const [key, list] of this.components)
    {
      if (list.includes(entity))
      {
        const component = entity[__WEBPACK_IMPORTED_MODULE_0_util_Reflection_js__["a" /* default */].getClassName(key)];
        delete entity[__WEBPACK_IMPORTED_MODULE_0_util_Reflection_js__["a" /* default */].getClassName(key)];

        list.splice(list.indexOf(entity), 1);

        this.emit('entityComponentRemove', entity, component);
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

  getComponentClassByName(componentName)
  {
    for(const component of this.components.keys())
    {
      if (__WEBPACK_IMPORTED_MODULE_0_util_Reflection_js__["a" /* default */].getClassName(component) === componentName)
      {
        return component;
      }
    }
    return null;
  }

  getEntitiesByComponent(component)
  {
    return this.components.get(component) || [];
  }
}

Object.assign(EntityManager.prototype, __WEBPACK_IMPORTED_MODULE_2_util_Eventable_js__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (EntityManager);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Reflection
{
  static getClassName(T)
  {
    return T.name;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Reflection);


/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Transform_js__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Renderable_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Motion_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__DecayOverTime_js__ = __webpack_require__(25);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Transform", function() { return __WEBPACK_IMPORTED_MODULE_0__Transform_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Renderable", function() { return __WEBPACK_IMPORTED_MODULE_1__Renderable_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Motion", function() { return __WEBPACK_IMPORTED_MODULE_2__Motion_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "DecayOverTime", function() { return __WEBPACK_IMPORTED_MODULE_3__DecayOverTime_js__["a"]; });








/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_Application_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_server_ServerEngine_js__ = __webpack_require__(15);




const __dirname = __WEBPACK_IMPORTED_MODULE_2_path___default.a.resolve();
const DEVMODE = process.argv.indexOf('--dev') != -1;
const PORT = process.env.PORT || 8082;
const FRAMERATE = 1000/10;

//Server Setup
const app = __WEBPACK_IMPORTED_MODULE_1_express___default()();
app.set('port', PORT);
app.use('/', __WEBPACK_IMPORTED_MODULE_1_express___default.a.static(__dirname + '/public'));
app.get('/', function(request, response) {
  response.sendFile(__WEBPACK_IMPORTED_MODULE_2_path___default.a.join(__dirname, 'index.html'));
});
const serverApp = app.listen(PORT, function() {
  const port = serverApp.address().port;
  console.log("Server is listening on port " + port + "...");
});




//Application Setup
function onServerLoad()
{
  const server = __WEBPACK_IMPORTED_MODULE_3_Application_js__["a" /* default */].server = new __WEBPACK_IMPORTED_MODULE_4_server_ServerEngine_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_3_Application_js__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0_socket_io___default()(serverApp));
  server.initialize()
    .then(() => __WEBPACK_IMPORTED_MODULE_3_Application_js__["a" /* default */].start(FRAMERATE));
}

//Start the server...
onServerLoad();


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const ENABLE_SIMULATED_LATENCY = true;
const AVERAGE_SIMULATED_LATENCY = 200;
const AVERAGE_SIMULATED_JITTER = 50;

class NetworkHandler
{
  sendTo(socket, packetID, packetData)
  {
    if (ENABLE_SIMULATED_LATENCY)
    {
      setTimeout(() => socket.emit(packetID, packetData),
        AVERAGE_SIMULATED_LATENCY + AVERAGE_SIMULATED_JITTER * Math.random());
    }
    else
    {
      socket.emit(packetID, packetData);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (NetworkHandler);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Eventable_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_server_NetworkClient_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_server_world_World_js__ = __webpack_require__(17);





class ServerEngine
{
  constructor(app, socket)
  {
    this._app = app;
    this._socket = socket;
    this._clients = new Map();

    this._world = new __WEBPACK_IMPORTED_MODULE_2_server_world_World_js__["a" /* default */]();

    this.tickRate = 10;
  }

  async initialize()
  {
    this._app.on('applicationStart', this.onApplicationStart.bind(this));
    this._app.on('applicationUpdate', this.onApplicationUpdate.bind(this));

    this._socket.on('connection', socket => {
      //TODO: Validate client before continuing...
      const client = new __WEBPACK_IMPORTED_MODULE_1_server_NetworkClient_js__["a" /* default */](socket, this._world);
      this._clients.set(socket.id, client);
      client.onConnect();
      this._world.onClientConnect(client);

      socket.on('disconnect', () => {
        this._world.onClientDisconnect(client);
        client.onDisconnect();
        this._clients.delete(socket.id);
      });
    });

    await this._world.initialize();

    console.log("Game initialized!");
  }

  onApplicationStart()
  {
    console.log("Application started!");
  }

  onApplicationUpdate(delta)
  {
    for(const client of this._clients.values())
    {
      client.onUpdate(delta);
    }

    this._world.onUpdate(delta);
  }

  getClientByID(clientID)
  {
    return this._clients.get(clientID);
  }
}

Object.assign(ServerEngine.prototype, __WEBPACK_IMPORTED_MODULE_0_util_Eventable_js__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (ServerEngine);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_MathHelper_js__ = __webpack_require__(3);


class NetworkClient
{
  constructor(socket, world)
  {
    this._world = world;
    this._socket = socket;
    this._player = null;

    this.targetX = 0;
    this.targetY = 0;
    this.speed = 1;
  }

  onPlayerCreate(entityPlayer)
  {
    console.log("Creating player...");

    this._player = entityPlayer;
  }

  onPlayerDestroy()
  {
    console.log("Destroying player...");

    this._player = null;
  }

  onConnect()
  {
    console.log("Connecting client: " + this._socket.id);

    this._socket.on('clientInput', this.onClientInput.bind(this));
  }

  onDisconnect()
  {
    console.log("Disconnecting client: " + this._socket.id);
  }

  onUpdate(delta)
  {
    if (this._player)
    {
      let dx = this.targetX - this._player.Transform.position[0];
      let dy = this.targetY - this._player.Transform.position[1];
      const dist = dx * dx + dy * dy;
      if (dist > 1)
      {
        const angle = Math.atan2(dy, dx);
        this._player.Motion.motionX = Math.cos(angle) * this.speed;
        this._player.Motion.motionY = Math.sin(angle) * this.speed;
      }
    }
  }

  onClientInput(data)
  {
    this.targetX = data.targetX;
    this.targetY = data.targetY;

    if (data.fireBullet)
    {
      const bullet = this._world.entityManager.spawnEntity('bullet');
      bullet.Transform.position[0] = this._player.Transform.position[0];
      bullet.Transform.position[1] = this._player.Transform.position[1];
      bullet.Motion.motionX = this.targetX - this._player.Transform.position[0];
      bullet.Motion.motionY = this.targetY - this._player.Transform.position[1];
      bullet.Motion.friction = 0;
    }
  }

  get player()
  {
    return this._player;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (NetworkClient);


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Application_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shared_entity_EntityManager_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_shared_entity_EntitySynchronizer_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_util_MathHelper_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__ = __webpack_require__(9);








class World
{
  constructor(serverEngine)
  {
    this.entityManager = new __WEBPACK_IMPORTED_MODULE_1_shared_entity_EntityManager_js__["a" /* default */]();
    this.synchronizer = new __WEBPACK_IMPORTED_MODULE_2_shared_entity_EntitySynchronizer_js__["a" /* default */](this.entityManager);
    this.entitySyncTimer = 20;

    this.forceUpdateRestart = true;
  }

  async initialize()
  {
    this.entityManager.registerEntity('player', function() {
      this.addComponent(__WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__["Transform"]);
      this.addComponent(__WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__["Renderable"]);
      this.addComponent(__WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__["Motion"]);
    });

    this.entityManager.registerEntity('bullet', function() {
      this.addComponent(__WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__["Transform"]);
      this.addComponent(__WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__["Renderable"]);
      this.addComponent(__WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__["Motion"]);
      this.addComponent(__WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__["DecayOverTime"]);
    });
  }

  onClientConnect(client)
  {
    console.log("Preparing environment for client...");

    const entity = this.entityManager.spawnEntity('player');
    client.onPlayerCreate(entity);

    this.forceUpdateRestart = true;
    client._player = entity;
  }

  onClientDisconnect(client)
  {
    console.log("Resetting environment for client...");

    const entityPlayer = client.player;
    client.onPlayerDestroy();
    this.entityManager.destroyEntity(entityPlayer);
  }

  onUpdate(delta)
  {
    //Do regular logic here...

    //Update motion logic
    let entities = this.entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__["Motion"]);
    for(const entity of entities)
    {
      entity.Transform.position[0] += entity.Motion.motionX;
      entity.Transform.position[1] += entity.Motion.motionY;
      entity.Motion.motionX *= 1 - entity.Motion.friction;
      entity.Motion.motionY *= 1 - entity.Motion.friction;
    }

    //Update decay over time logic
    entities = this.entityManager.getEntitiesByComponent(__WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__["DecayOverTime"]);
    let i = entities.length;
    while(i--)
    {
      const entity = entities[i];
      if (entity.DecayOverTime.age-- <= 0)
      {
        this.entityManager.destroyEntity(entity);
        continue;
      }
    }

    //Send full update every few ticks
    if (this.forceUpdateRestart || --this.entitySyncTimer <= 0)
    {
      console.log("Sending complete world state...");

      const payload = {};
      payload.worldData = this.synchronizer.serialize(true);

      for(const client of __WEBPACK_IMPORTED_MODULE_0_Application_js__["a" /* default */].server._clients.values())
      {
        payload.playerData = {
          entity: client.player.id
        };

        client._socket.emit(this.forceUpdateRestart ? 'serverRestart' : 'serverUpdate', payload);
      }

      this.entitySyncTimer = 20;
      this.forceUpdateRestart = false;
    }
    else
    {
      //console.log("Sending differential world state...");

      const payload = {};
      payload.worldData = this.synchronizer.serialize(false);

      for(const client of __WEBPACK_IMPORTED_MODULE_0_Application_js__["a" /* default */].server._clients.values())
      {
        payload.playerData = {
          entity: client.player.id
        };

        //Send server update
        __WEBPACK_IMPORTED_MODULE_0_Application_js__["a" /* default */].network.sendTo(client._socket, 'serverUpdate', payload);
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (World);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_ObjectPool_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_UID_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Entity_js__ = __webpack_require__(5);





class EntityRegistry
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
    this.entityMap = new Map();
    this.entityPool = new __WEBPACK_IMPORTED_MODULE_0_util_ObjectPool_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_2__Entity_js__["a" /* default */]);

    this.register(null, function() {});
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
    let id = Object(__WEBPACK_IMPORTED_MODULE_1_util_UID_js__["a" /* default */])();
    while (this.entityManager.entities[id])
    {
      id = Object(__WEBPACK_IMPORTED_MODULE_1_util_UID_js__["a" /* default */])();

      if (--iters <= 0)
        throw new Error("cannot find another unique entity id");
    }
    return id;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EntityRegistry);


/***/ }),
/* 19 */
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
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_Reflection_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Application_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__EntityManager_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Entity_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__SerializerRegistry_js__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_shared_serializable_Serializer_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_shared_entity_component_Components_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__ = __webpack_require__(26);












const MAX_CACHED_STATES = 10;

class EntitySynchronizer
{
  constructor(entityManager)
  {
    this._entityManager = entityManager;

    this.serializers = new __WEBPACK_IMPORTED_MODULE_5__SerializerRegistry_js__["a" /* default */]();
    this.serializers.registerSerializableType('boolean', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["b" /* BooleanSerializer */]());
    this.serializers.registerSerializableType('integer', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["e" /* IntegerSerializer */]());
    this.serializers.registerSerializableType('float', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["d" /* FloatSerializer */]());
    this.serializers.registerSerializableType('vec2', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["i" /* Vec2Serializer */]());
    this.serializers.registerSerializableType('vec3', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["j" /* Vec3Serializer */]());
    this.serializers.registerSerializableType('vec4', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["k" /* Vec4Serializer */]());
    this.serializers.registerSerializableType('quat', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["g" /* QuatSerializer */]());
    this.serializers.registerSerializableType('mat4', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["f" /* Mat4Serializer */]());
    this.serializers.registerSerializableType('string', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["h" /* StringSerializer */]());
    this.serializers.registerSerializableType('array', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["a" /* ArraySerializer */]());
    this.serializers.registerSerializableType('entity', new __WEBPACK_IMPORTED_MODULE_8_shared_serializable_Serializables_js__["c" /* EntityReferenceSerializer */](this._entityManager));

    //HACK: this is so we can use custom components not in Components.js
    this.customComponents = {};

    this.cachedStates = [];

    //States that are read by serializers...
    this.isInitial = true;
    this.shouldInterpolate = __WEBPACK_IMPORTED_MODULE_2_Application_js__["a" /* default */].isRemote();
  }

  serialize(isComplete=true)
  {
    const payload = {};
    payload.isComplete = isComplete;

    //Write entities...
    const entitiesPayload = payload.entities = {};
    for(const entity of this._entityManager.entities)
    {
      this.serializeEntity(entity, entitiesPayload, isComplete);
    }

    //Cache serialized states...
    this.cachedStates.push(payload);
    if (this.cachedStates.length > MAX_CACHED_STATES)
    {
      this.cachedStates.shift();
    }

    //Try to make difference state...
    if (!isComplete && this.cachedStates.length > 1)
    {
      const previousState = this.cachedStates[this.cachedStates.length - 2];
      const diffState = this.makeDifferenceState(previousState, payload);
      return diffState;
    }
    else
    {
      return payload;
    }
  }

  deserialize(payload)
  {
    const isComplete = payload.isComplete;

    if (!isComplete)
    {
      const eventsPayload = payload.entityEvents;
      for(const event of eventsPayload)
      {
        if (event.type === 'create')
        {
          //Try to create with default constructor, otherwise use empty entity template
          let entity = null;
          try
          {
            entity = this._entityManager.spawnEntity(event.entityName);
          }
          catch (e)
          {
            entity = this._entityManager.spawnEntity();
          }
          entity._id = event.entityID;

          const prevInitial = this.isInitial;
          this.isInitial = true;
          this.deserializeEntity(entity._id, event.entityData, true);
          this.isInitial = prevInitial;
        }
        else if (event.type === 'destroy')
        {
          const entity = this._entityManager.getEntityByID(event.entityID);
          if (entity === null) continue;
          this._entityManager.destroyEntity(entity);
        }
        else
        {
          throw new Error("unknown entity event type \'" + event.type + "\'");
        }
      }
    }

    const entitiesPayload = payload.entities;
    for(const entityID of Object.keys(entitiesPayload))
    {
      this.deserializeEntity(entityID, entitiesPayload, isComplete);
    }

    if (isComplete)
    {
      //Destroy any that do not belong...
      for(const entity of this._entityManager.entities)
      {
        if (!entitiesPayload.hasOwnProperty(entity.id))//TODO: make a flag to save client only entities
        {
          this._entityManager.destroyEntity(entity);
        }
      }

      if (this.isInitial)
      {
        this.isInitial = false;
      }
    }
  }

  serializeEntity(entity, dst)
  {
    const entityData = dst[entity.id] = {};
    entityData.name = entity.name;

    const componentsData = entityData.components = {};
    const components = this._entityManager.getComponentsByEntity(entity);
    for(const component of components)
    {
      const componentName = __WEBPACK_IMPORTED_MODULE_1_util_Reflection_js__["a" /* default */].getClassName(component);
      const componentData = componentsData[componentName] = {};
      for(const propName of Object.keys(component.sync))
      {
        this.encodeProperty(propName, entity[componentName][propName], component.sync[propName], componentData);
      }
    }
  }

  deserializeEntity(entityID, src, isComplete)
  {
    const entityData = src[entityID];
    let entity = this._entityManager.getEntityByID(entityID);

    if (entity === null)
    {
      if (!isComplete)
      {
        //Just create it, maybe a packet was skipped
        console.log("WARNING! - Found unknown entity...");
      }

      //Try to create with default constructor, otherwise use empty entity template
      try
      {
        entity = this._entityManager.spawnEntity(entityData.name);
      }
      catch (e)
      {
        entity = this._entityManager.spawnEntity();
      }
      entity._id = entityID;
    }

    const componentsData = entityData.components;
    for(const componentName of Object.keys(componentsData))
    {
      const componentClass = this._entityManager.getComponentClassByName(componentName) || __WEBPACK_IMPORTED_MODULE_7_shared_entity_component_Components_js__[componentName] || this.customComponents[componentName];
      if (!componentClass)
      {
        throw new Error("cannot find component class with name \'" + componentName + "\'");
      }

      const componentData = componentsData[componentName];
      if (!this._entityManager.hasComponentByEntity(entity, componentClass))
      {
        this._entityManager.addComponentToEntity(entity, componentClass);
      }
      const component = entity[componentName];
      for(const propertyName of Object.keys(componentClass.sync))
      {
        if (!componentData.hasOwnProperty(propertyName))
        {
          if (isComplete)
          {
            throw new Error("cannot find synchronized property \'" + propertyName + "\' for component \'" + componentName + "\' - Perhaps you forgot to modify the sync variable?");
          }
          else
          {
            //The property could not require any changes if incomplete update...
            continue;
          }
        }

        this.decodeProperty(propertyName, componentData[propertyName], componentClass.sync[propertyName], component);
      }
    }
  }

  encodeProperty(propertyName, propertyData, syncOpts, dst)
  {
    const propertyType = syncOpts.type;
    const serializer = this.serializers.getSerializerForType(propertyType);
    serializer.encode(this, propertyName, propertyData, syncOpts, dst);
    return dst;
  }

  decodeProperty(propertyName, propertyData, syncOpts, dst)
  {
    const propertyType = syncOpts.type;
    const serializer = this.serializers.getSerializerForType(propertyType);
    serializer.decode(this, propertyName, propertyData, syncOpts, dst);
    return dst;
  }

  makeDifferenceState(oldState, newState)
  {
    if (oldState === null || newState === null) return newState;

    const oldEntities = oldState.entities;
    const newEntities = newState.entities;

    if (oldEntities === null || newEntities === null) return true;

    const payload = {};
    const eventsPayload = payload.entityEvents = [];
    const entitiesPayload = payload.entities = {};

    for(const entityID of Object.keys(newEntities))
    {
      if (!oldEntities.hasOwnProperty(entityID))
      {
        //Create event
        const entity = newEntities[entityID];
        const event = {};
        event.type = 'create';
        event.entityID = entityID;
        event.entityName = newEntities[entityID].name;
        event.entityData = {}
        event.entityData[entityID] = newEntities[entityID];
        eventsPayload.push(event);
      }
      else
      {
        //Diff the states...
        const oldEntityData = oldEntities[entityID];
        const newEntityData = newEntities[entityID];
        const dstEntityData = {};
        let entityDirty = false;

        const oldComponentsData = oldEntityData.components;
        const newComponentsData = newEntityData.components;
        const dstComponentsData = {};
        let componentsDirty = false;

        for(const componentName of Object.keys(newComponentsData))
        {
          //Found new component...
          if (!oldComponentsData.hasOwnProperty(componentName))
          {
            //Just keep the new data...
            dstComponentsData[componentName] = newComponentsData[componentName];
            componentsDirty = true;
            continue;
          }
          else
          {
            const newComponentData = newComponentsData[componentName];
            const oldComponentData = oldComponentsData[componentName];
            const dstComponentData = {};
            let componentDirty = false;

            for(const propertyName of Object.keys(newComponentData))
            {
              const newPropertyData = newComponentData[propertyName];
              const oldPropertyData = oldComponentData[propertyName];

              if (this.isPropertyChanged(oldPropertyData, newPropertyData))
              {
                //Add new, changed property from payload
                dstComponentData[propertyName] = newPropertyData;
                componentDirty = true;
              }
            }

            //Only write if dirty...
            if (componentDirty)
            {
              dstComponentsData[componentName] = dstComponentData;
              componentsDirty = true;
            }
          }
        }

        //Only write if dirty...
        if (componentsDirty)
        {
          dstEntityData.components = dstComponentsData;
          entityDirty = true;
        }

        //Only write if dirty...
        if (entityDirty)
        {
          entitiesPayload[entityID] = dstEntityData;
        }
      }
    }

    for(const entityID of Object.keys(oldEntities))
    {
      if (!newEntities.hasOwnProperty(entityID))
      {
        //Destroy event
        const entity = oldEntities[entityID];
        const event = {};
        event.type = 'destroy';
        event.entityID = entityID;
        eventsPayload.push(event);
      }
    }

    return payload;
  }

  isPropertyChanged(newPropertyData, oldPropertyData)
  {
    if (oldPropertyData === newPropertyData) return false;
    if (oldPropertyData === null || newPropertyData === null) return true;
    if (Array.isArray(oldPropertyData) && Array.isArray(newPropertyData))
    {
      if (oldPropertyData.length != newPropertyData.length) return true;

      let i = oldPropertyData.length;
      while(i--)
      {
        if (this.isPropertyChanged(newPropertyData[i], oldPropertyData[i]))
        {
          return true;
        }
      }
    }
    else if (typeof oldPropertyData == 'string' && typeof newPropertyData == 'string')
    {
      return oldPropertyData != newPropertyData;
    }
    else if ((typeof oldPropertyData == 'number' && typeof newPropertyData == 'number')
      || (typeof oldPropertyData == 'boolean' && typeof newPropertyData == 'boolean'))
    {
      return oldPropertyData !== newPropertyData;
    }
    else if (typeof oldPropertyData === typeof newPropertyData)
    {
      if (oldPropertyData !== newPropertyData)
      {
        console.log("WARNING! - matching generic type, force updating property");
        return true;
      }
    }
    else
    {
      console.log("WARNING! - could not match type, force updating property");
      return true;
    }

    return false;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EntitySynchronizer);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class SerializerRegistry
{
  constructor()
  {
    this._registry = new Map();
  }

  registerSerializableType(type, serializer)
  {
    this._registry.set(type, serializer);
  }

  unregisterSerializableType(type)
  {
    this._registry.delete(type);
  }

  getSerializerForType(type)
  {
    if (!this._registry.has(type))
    {
      throw new Error("cannot find serializer for type \'" + type + "\'");
    }
    return this._registry.get(type);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (SerializerRegistry);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Application_js__ = __webpack_require__(2);




function Transform()
{
  this.position = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].create();
  this.rotation = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].create();
  this.scale = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].fromValues(1, 1, 1);

  if (__WEBPACK_IMPORTED_MODULE_1_Application_js__["a" /* default */].isRemote())
  {
    this.nextPosition = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].create();
    this.prevPosition = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].create();
  }
}

Transform.sync = {
  position: { type: 'vec3' ,
    blend: { mode: 'interpolate',
      next: 'nextPosition',
      prev: 'prevPosition'
    }},
  rotation: { type: 'quat' },
  scale: { type: 'vec3' }
};

/* harmony default export */ __webpack_exports__["a"] = (Transform);


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function Renderable()
{
  this.renderType = 'box';
  this.visible = true;
  this.color = 0xFFFFFF;
}

Renderable.sync = {
  renderType: { type: 'string' },
  visible: { type: 'boolean' },
  color: { type: 'integer' }
};

/* harmony default export */ __webpack_exports__["a"] = (Renderable);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Application_js__ = __webpack_require__(2);


function Motion()
{
  this.motionX = 0;
  this.motionY = 0;
  this.friction = 0.8;

  if (__WEBPACK_IMPORTED_MODULE_0_Application_js__["a" /* default */].isRemote())
  {
    this.nextMotionX = 0;
    this.prevMotionX = 0;
    this.nextMotionY = 0;
    this.prevMotionY = 0;
  }
}

Motion.sync = {
  motionX: { type: 'float', blend: {
    mode: 'interpolate',
    next: 'nextMotionX',
    prev: 'prevMotionX'
  }},
  motionY: { type: 'float', blend: {
    mode: 'interpolate',
    next: 'nextMotionY',
    prev: 'prevMotionY'
  }}
};

/* harmony default export */ __webpack_exports__["a"] = (Motion);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function DecayOverTime()
{
  this.age = 10;
}

DecayOverTime.sync = {
  age: { type: 'integer' }
};

/* harmony default export */ __webpack_exports__["a"] = (DecayOverTime);


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BooleanSerializer_js__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__IntegerSerializer_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__FloatSerializer_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Vec2Serializer_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Vec3Serializer_js__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Vec4Serializer_js__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__QuatSerializer_js__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Mat4Serializer_js__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__StringSerializer_js__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ArraySerializer_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__EntityReferenceSerializer_js__ = __webpack_require__(37);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__BooleanSerializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_1__IntegerSerializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_2__FloatSerializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return __WEBPACK_IMPORTED_MODULE_3__Vec2Serializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return __WEBPACK_IMPORTED_MODULE_4__Vec3Serializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return __WEBPACK_IMPORTED_MODULE_5__Vec4Serializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_6__QuatSerializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_7__Mat4Serializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return __WEBPACK_IMPORTED_MODULE_8__StringSerializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_9__ArraySerializer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_10__EntityReferenceSerializer_js__["a"]; });















/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Serializer_js__ = __webpack_require__(0);


class BooleanSerializer extends __WEBPACK_IMPORTED_MODULE_0__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Boolean(propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Boolean(propertyData);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (BooleanSerializer);


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Serializer_js__ = __webpack_require__(0);


class IntegerSerializer extends __WEBPACK_IMPORTED_MODULE_0__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Math.trunc(Number(propertyData));
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Math.trunc(Number(propertyData));
  }
}

/* harmony default export */ __webpack_exports__["a"] = (IntegerSerializer);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Serializer_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_MathHelper_js__ = __webpack_require__(3);



class FloatSerializer extends __WEBPACK_IMPORTED_MODULE_0__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Number(propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    if (serializer.shouldInterpolate && syncOpts.hasOwnProperty('blend'))
    {
      if (serializer.isInitial) dst[propertyName] = propertyData;

      switch (syncOpts.blend.mode)
      {
        case 'interpolate':
          const nextPropertyName = syncOpts.blend.next;
          dst[syncOpts.blend.prev] = dst[nextPropertyName];
          propertyName = nextPropertyName;
          break;
        default:
          throw new Error("unknown blend mode to sync for property \'" + propertyName + "\'");
      }
    }

    dst[propertyName] = Number(propertyData);
  }

  interpolate(propertyName, syncOpts, delta, componentData)
  {
    const prevData = componentData[propertyName];
    const nextData = componentData[syncOpts.blend.next];
    componentData[propertyName] = __WEBPACK_IMPORTED_MODULE_1_util_MathHelper_js__["a" /* lerp */](prevData, nextData, delta);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (FloatSerializer);


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);



class Vec2Serializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec2"].copy(dst[propertyName], propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec2"].create();
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec2"].copy(dst[propertyName], propertyData);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Vec2Serializer);


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_util_MathHelper_js__ = __webpack_require__(3);




class Vec3Serializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].copy(dst[propertyName], propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].create();
    }

    if (serializer.shouldInterpolate && syncOpts.hasOwnProperty('blend'))
    {
      if (serializer.isInitial) __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].copy(dst[propertyName], propertyData);

      switch (syncOpts.blend.mode)
      {
        case 'interpolate':
          const nextPropertyName = syncOpts.blend.next;
          __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].copy(dst[syncOpts.blend.prev], dst[nextPropertyName]);
          propertyName = nextPropertyName;
          break;
        default:
          throw new Error("unknown blend mode to sync for property \'" + propertyName + "\'");
      }
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].copy(dst[propertyName], propertyData);
  }

  interpolate(propertyName, syncOpts, delta, componentData)
  {
    //TODO: if using this, change delta to be interpolationTime
    //const prevData = componentData[syncOpts.blend.prev];
    const prevData = componentData[propertyName];
    const nextData = componentData[syncOpts.blend.next];
    componentData[propertyName][0] = __WEBPACK_IMPORTED_MODULE_2_util_MathHelper_js__["a" /* lerp */](prevData[0], nextData[0], delta);
    componentData[propertyName][1] = __WEBPACK_IMPORTED_MODULE_2_util_MathHelper_js__["a" /* lerp */](prevData[1], nextData[1], delta);
    componentData[propertyName][2] = __WEBPACK_IMPORTED_MODULE_2_util_MathHelper_js__["a" /* lerp */](prevData[2], nextData[2], delta);

    //HACK: this is to make sure the property does not reset when delta resets...
    /*
    if (delta >= 1)
    {
      prevData[0] = nextData[0];
      prevData[1] = nextData[1];
      prevData[2] = nextData[2];
    }
    */
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Vec3Serializer);


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);



class Vec4Serializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec4"].copy(dst[propertyName], propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec4"].create();
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec4"].copy(dst[propertyName], propertyData);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Vec4Serializer);


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_util_MathHelper_js__ = __webpack_require__(3);




class QuatSerializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].copy(dst[propertyName], propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].create();
    }

    if (serializer.shouldInterpolate && syncOpts.hasOwnProperty('blend'))
    {
      if (serializer.isInitial) __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].copy(dst[propertyName], propertyData);

      switch (syncOpts.blend.mode)
      {
        case 'interpolate':
          const nextPropertyName = syncOpts.blend.next;
          __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].copy(dst[syncOpts.blend.prev], dst[nextPropertyName]);
          propertyName = nextPropertyName;
          break;
        default:
          throw new Error("unknown blend mode to sync for property \'" + propertyName + "\'");
      }
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].copy(dst[propertyName], propertyData);
  }

  interpolate(propertyName, syncOpts, delta, componentData)
  {
    const prevData = componentData[propertyName];
    const nextData = componentData[syncOpts.blend.next];
    componentData[propertyName][0] = __WEBPACK_IMPORTED_MODULE_2_util_MathHelper_js__["a" /* lerp */](prevData[0], nextData[0], delta);
    componentData[propertyName][1] = __WEBPACK_IMPORTED_MODULE_2_util_MathHelper_js__["a" /* lerp */](prevData[1], nextData[1], delta);
    componentData[propertyName][2] = __WEBPACK_IMPORTED_MODULE_2_util_MathHelper_js__["a" /* lerp */](prevData[2], nextData[2], delta);
    componentData[propertyName][3] = __WEBPACK_IMPORTED_MODULE_2_util_MathHelper_js__["a" /* lerp */](prevData[3], nextData[3], delta);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (QuatSerializer);


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);



class Mat4Serializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["mat4"].copy(dst[propertyName], propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["mat4"].create();
    }

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["mat4"].copy(dst[propertyName], propertyData);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Mat4Serializer);


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Serializer_js__ = __webpack_require__(0);


class StringSerializer extends __WEBPACK_IMPORTED_MODULE_0__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = String(propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = String(propertyData);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (StringSerializer);


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Serializer_js__ = __webpack_require__(0);


class ArraySerializer extends __WEBPACK_IMPORTED_MODULE_0__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    const elements = dst[propertyName];
    const length = propertyData.length;
    for(let i = 0; i < length; ++i)
    {
      elements.push(0);
      serializer.encodeProperty(i, propertyData[i], syncOpts.elements, elements);
    }
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    const elements = dst[propertyName];
    const length = propertyData.length;
    for(let i = 0; i < length; ++i)
    {
      elements.push(0);
      serializer.decodeProperty(i, propertyData[i], syncOpts.elements, elements);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (ArraySerializer);


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Serializer_js__ = __webpack_require__(0);


class EntityReferenceSerializer extends __WEBPACK_IMPORTED_MODULE_0__Serializer_js__["a" /* default */]
{
  constructor(entityManager)
  {
    super();
    this._entityManager = entityManager;
  }

  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    if (propertyData instanceof Entity)
    {
      dst[propertyName] = propertyData.id;
    }
    else
    {
      throw new Error("unknown entity type \'" + propertyData + "\' for encoding");
    }
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    let entity = this._entityManager.getEntityByID(propertyData);
    if (entity === null)
    {
      throw new Error("cannot find entity with id \'" + propertyData + "\'");
    }
    dst[propertyName] = entity;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EntityReferenceSerializer);


/***/ })
/******/ ]);