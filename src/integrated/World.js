import Frame from 'util/Frame.js';

import EntityManager from 'integrated/entity/EntityManager.js';
import EntitySystem from 'game/EntitySystem.js';
import SystemManager from 'integrated/entity/SystemManager.js';

import Application from 'Application.js';
import GameFactory from 'game/GameFactory.js';

class World
{
  constructor()
  {
    this.ticks = 0;

    this.serverState = null;

    this.entitySystem = new EntitySystem();
    this.systemManager = new SystemManager();

    GameFactory.init(this);
  }

  step(frame, predictive=false)
  {
    this.ticks += frame.delta;

    //Continue to update the world state
    this.systemManager.update(this.entityManager, frame, predictive);
    Application.events.emit('worldStep', this.entityManager, frame, predictive);
  }

  updateInput(inputState, targetEntity, predictive=false)
  {
    this.systemManager.updateInput(inputState, targetEntity, predictive);
    Application.events.emit('inputStep', inputState, targetEntity, predictive);
  }

  captureState()
  {
    //Capture a GameState and return it for sending...
    const dst = {};
    const payload = this.entitySystem.serialize();
    dst.payload = payload;

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
    this.systemManager.resetEntityList(this.entityManager, gameState);
    this.entitySystem.deserialize(gameState.payload);

    Application.events.emit('worldReset', this.entityManager, gameState);

    //HACK: Prepare server state for rendering...
    this.serverState = gameState.payload;
  }

  get entityManager() { return this.entitySystem.manager; }

  get entities() { return this.entityManager.entities; }
}

export default World;
