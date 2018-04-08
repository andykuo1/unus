import Frame from 'util/Frame.js';

import EntityManager from 'integrated/entity/EntityManager.js';
import EntitySystem from 'game/EntitySystem.js';

import Application from 'Application.js';
import GameFactory from 'game/GameFactory.js';

class World
{
  constructor()
  {
    this.ticks = 0;

    this.serverState = null;

    this.entitySystem = new EntitySystem();
    this.systems = [];
  }

  init()
  {
    GameFactory.init(this);
    Application.events.on('serverResponse', this.onServerResponse.bind(this));
  }

  onServerResponse(data)
  {
     data.worldState = this.captureState();
  }

  step(delta)
  {
    this.ticks += delta;
    Application.events.emit('worldStep', this, delta);
  }

  updateInput(inputState, targetEntity)
  {
    Application.events.emit('inputStep', inputState, targetEntity);
  }

  captureState()
  {
    //Capture a GameState and return it for sending...
    const dst = this.entitySystem.serialize();

    if (!dst.entitylist) dst.entitylist = {};
    for(const entity of this.entities)
    {
      if (!dst.entitylist[entity.id]) dst.entitylist[entity.id] = {};
      dst.entitylist[entity.id].name = entity._name;
    }
    dst.worldTicks = this.ticks;

    Application.events.emit('worldCapture', this.entityManager, dst);
    return dst;
  }

  resetState(gameState)
  {
    this.ticks = gameState.worldTicks;

    //Continue to reset the world state
    this.entitySystem.deserialize(gameState);

    Application.events.emit('worldReset', this.entityManager, gameState);

    //HACK: Prepare server state for rendering...
    this.serverState = gameState;
  }

  get entityManager() { return this.entitySystem.manager; }

  get entities() { return this.entityManager.entities; }
}

export default World;
