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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
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
/* 3 */
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

  get name() { return this._name; }
}

/* harmony default export */ __webpack_exports__["a"] = (Entity);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Eventable_js__ = __webpack_require__(2);


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
  }

  start(framerate)
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
      if (framerate <= 0)
      {
        throw new Error("Cannot start application with framerate <= 0");
      }

      this._update_interval = setInterval(this.update.bind(this), framerate);
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Reflection_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_UID_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_util_Eventable_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__EntityRegistry_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Entity_js__ = __webpack_require__(3);







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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Transform_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Renderable_js__ = __webpack_require__(20);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Transform", function() { return __WEBPACK_IMPORTED_MODULE_0__Transform_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Renderable", function() { return __WEBPACK_IMPORTED_MODULE_1__Renderable_js__["a"]; });






/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_Application_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_server_ServerEngine_js__ = __webpack_require__(13);




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
/* 10 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_Eventable_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_server_NetworkClient_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_server_world_World_js__ = __webpack_require__(15);





class ServerEngine
{
  constructor(app, socket)
  {
    this._app = app;
    this._socket = socket;
    this._clients = new Map();

    this._world = new __WEBPACK_IMPORTED_MODULE_2_server_world_World_js__["a" /* default */]();
  }

  async initialize()
  {
    this._app.on('applicationStart', this.onApplicationStart.bind(this));
    this._app.on('applicationUpdate', this.onApplicationUpdate.bind(this));

    this._socket.on('connection', socket => {
      //TODO: Validate client before continuing...
      const client = new __WEBPACK_IMPORTED_MODULE_1_server_NetworkClient_js__["a" /* default */](socket);
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
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class NetworkClient
{
  constructor(socket)
  {
    this._socket = socket;
  }

  onConnect()
  {
    console.log("Client connected: " + this._socket.id);
  }

  onDisconnect()
  {
    console.log("Client disconnected: " + this._socket.id);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (NetworkClient);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_shared_entity_EntityManager_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shared_entity_EntitySynchronizer_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Application_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_shared_entity_component_Components_js__ = __webpack_require__(8);







class World
{
  constructor(serverEngine)
  {
    this.entities = new __WEBPACK_IMPORTED_MODULE_0_shared_entity_EntityManager_js__["a" /* default */]();
    this.synchronizer = new __WEBPACK_IMPORTED_MODULE_1_shared_entity_EntitySynchronizer_js__["a" /* default */](this.entities);
    this.entitySyncTimer = 20;
  }

  async initialize()
  {
    this.entity = this.entities.spawnEntity();
    this.entity.addComponent(__WEBPACK_IMPORTED_MODULE_3_shared_entity_component_Components_js__["Transform"]);
    this.entity.addComponent(__WEBPACK_IMPORTED_MODULE_3_shared_entity_component_Components_js__["Renderable"]);
  }

  onClientConnect(client)
  {

  }

  onClientDisconnect(client)
  {

  }

  onUpdate(delta)
  {
    this.entity.Transform.position[0] += -0.1 + Math.random() * 0.2;
    this.entity.Transform.position[1] += -0.1 + Math.random() * 0.2;

    if (--this.entitySyncTimer <= 0)
    {
      console.log("Sending full world state...");

      const worldData = this.synchronizer.serialize();
      for(const client of __WEBPACK_IMPORTED_MODULE_2_Application_js__["a" /* default */].server._clients.values())
      {
        client._socket.emit('serverUpdate', worldData);
      }

      this.entitySyncTimer = 20;
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (World);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_util_ObjectPool_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_UID_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Entity_js__ = __webpack_require__(3);





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
/* 17 */
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
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_util_Reflection_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EntityManager_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Entity_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_shared_serialization_SerializerRegistry_js__ = __webpack_require__(33);










class EntitySynchronizer
{
  constructor(entityManager)
  {
    this.manager = entityManager;
    this.manager.on('entityCreate', this.onEntityCreate.bind(this));
    this.manager.on('entityDestroy', this.onEntityDestroy.bind(this));

    this.serializers = new __WEBPACK_IMPORTED_MODULE_6_shared_serialization_SerializerRegistry_js__["a" /* default */]();
    this.serializers.registerSerializableType('boolean', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["b" /* BooleanSerializer */]());
    this.serializers.registerSerializableType('integer', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["e" /* IntegerSerializer */]());
    this.serializers.registerSerializableType('float', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["d" /* FloatSerializer */]());
    this.serializers.registerSerializableType('vec2', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["i" /* Vec2Serializer */]());
    this.serializers.registerSerializableType('vec3', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["j" /* Vec3Serializer */]());
    this.serializers.registerSerializableType('vec4', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["k" /* Vec4Serializer */]());
    this.serializers.registerSerializableType('quat', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["g" /* QuatSerializer */]());
    this.serializers.registerSerializableType('mat4', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["f" /* Mat4Serializer */]());
    this.serializers.registerSerializableType('string', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["h" /* StringSerializer */]());
    this.serializers.registerSerializableType('array', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["a" /* ArraySerializer */]());
    this.serializers.registerSerializableType('entity', new __WEBPACK_IMPORTED_MODULE_5_shared_serialization_Serializables_js__["c" /* EntityReferenceSerializer */](this.manager));

    this.cachedEvents = [];
  }

  serialize()
  {
    const payload = {};
    payload.isComplete = true;

    //Write events...
    const eventsPayload = payload.events = [];
    for(const event of this.cachedEvents)
    {
      eventsPayload.push(event);
    }
    this.cachedEvents.length = 0;

    //Write entities...
    const entitiesPayload = payload.entities = {};
    for(const entity of this.manager.entities)
    {
      const entityData = entitiesPayload[entity.id] = {};
      entityData.name = entity.name;

      const componentsData = entityData.components = {};
      const components = this.manager.getComponentsByEntity(entity);
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
    return payload;
  }

  deserialize(payload)
  {
    const eventsPayload = payload.events;
    for(const event of payload.events)
    {
      if (event.type === 'create')
      {
        const entity = this.manager.spawnEntity(event.entityName);
        entity._id = event.entityID;
      }
      else if (event.type === 'destroy')
      {
        const entity = this.manager.getEntityByID(event.entityID);
        if (entity === null) continue;
        this.manager.destroyEntity(entity);
      }
      else
      {
        throw new Error("unknown event type \'" + event.type + "\'");
      }
    }

    const entitiesPayload = payload.entities;
    for(const entityID of Object.keys(entitiesPayload))
    {
      const entityData = entitiesPayload[entityID];
      let entity = this.manager.getEntityByID(entityID);
      if (entity === null)
      {
        //Just create it, maybe a packet was skipped...
        entity = this.manager.spawnEntity(entityData.name);
        entity._id = entityID;
      }

      const componentsData = entityData.components;
      for(const componentName of Object.keys(componentsData))
      {
        const componentClass = this.manager.getComponentClassByName(componentName) || __WEBPACK_IMPORTED_MODULE_4_shared_entity_component_Components_js__[componentName];
        if (componentClass === null)
        {
          throw new Error("cannot find component class with name \'" + componentName + "\'");
        }

        const componentData = componentsData[componentName];
        if (!entity.hasComponent(componentClass))
        {
          //Just create it, maybe a packet was skipped...
          entity.addComponent(componentClass);
        }
        const component = entity[componentName];
        for(const propertyName of Object.keys(componentClass.sync))
        {
          this.decodeProperty(propertyName, componentData[propertyName], componentClass.sync[propertyName], component);
        }
      }
    }

    if (payload.isComplete)
    {
      //Destroy any that do not belong...
      for(const entity of this.manager.entities)
      {
        if (!entitiesPayload.hasOwnProperty(entity.id)) //&& !entity.tracker
        {
          this.manager.destroyEntity(entity);
        }
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

  onEntityCreate(entity)
  {
    const event = {};
    event.type = 'create';
    event.entityID = entity.id;
    event.entityName = entity.name;
    this.cachedEvents.push(event);
  }

  onEntityDestroy(entity)
  {
    const event = {};
    event.type = 'destroy';
    event.entityID = entity.id;
    event.entityName = entity.name;
    this.cachedEvents.push(event);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EntitySynchronizer);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);


function Transform()
{
  this.position = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].create();
  this.rotation = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].create();
  this.scale = __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].fromValues(1, 1, 1);
}

Transform.sync = {
  position: { type: 'vec3' },
  rotation: { type: 'quat' },
  scale: { type: 'vec3' }
};

/* harmony default export */ __webpack_exports__["a"] = (Transform);


/***/ }),
/* 20 */
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
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BooleanSerializer_js__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__IntegerSerializer_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__FloatSerializer_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Vec2Serializer_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Vec3Serializer_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Vec4Serializer_js__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__QuatSerializer_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Mat4Serializer_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__StringSerializer_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ArraySerializer_js__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__EntityReferenceSerializer_js__ = __webpack_require__(32);
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
/* 22 */
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
/* 23 */
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
/* 24 */
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
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);



class EntityReferenceSerializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
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

/* harmony default export */ __webpack_exports__["a"] = (EntityReferenceSerializer);


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);



class EntityReferenceSerializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
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

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["vec3"].copy(dst[propertyName], propertyData);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EntityReferenceSerializer);


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);



class EntityReferenceSerializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
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

/* harmony default export */ __webpack_exports__["a"] = (EntityReferenceSerializer);


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);



class EntityReferenceSerializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
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

    __WEBPACK_IMPORTED_MODULE_0_gl_matrix__["quat"].copy(dst[propertyName], propertyData);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (EntityReferenceSerializer);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_gl_matrix___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_gl_matrix__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Serializer_js__ = __webpack_require__(0);



class EntityReferenceSerializer extends __WEBPACK_IMPORTED_MODULE_1__Serializer_js__["a" /* default */]
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

/* harmony default export */ __webpack_exports__["a"] = (EntityReferenceSerializer);


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Serializer_js__ = __webpack_require__(0);


class FloatSerializer extends __WEBPACK_IMPORTED_MODULE_0__Serializer_js__["a" /* default */]
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Number(propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Number(propertyData);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (FloatSerializer);


/***/ }),
/* 31 */
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
      serializer.encodeProperty(i, propertyData[i], syncData.elements, elements);
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
      serializer.decodeProperty(i, propertyData[i], syncData.elements, elements);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (ArraySerializer);


/***/ }),
/* 32 */
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


/***/ }),
/* 33 */
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


/***/ })
/******/ ]);