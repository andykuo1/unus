import Frame from '../util/Frame.js';
import EntityManager from './entity/EntityManager.js';
import SystemManager from './entity/SystemManager.js';

import GameFactory from '../game/GameFactory.js';

class World
{
  constructor(remote=true)
  {
    this.remote = remote;
    this.ticks = 0;

    this.serverState = null;

    this.entityManager = new EntityManager();
    this.systemManager = new SystemManager();

    GameFactory.init(this);
  }

  step(frame, predictive=true)
  {
    this.ticks += frame.delta;

    //Continue to update the world state
    this.systemManager.update(this.entityManager, frame);
  }

  updateInput(inputState, targetEntity)
  {
    this.systemManager.updateInput(inputState, targetEntity);
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

export default World;
