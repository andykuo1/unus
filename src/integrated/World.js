import Frame from '../util/Frame.js';
import EntityManager from './entity/EntityManager.js';

import NetworkEntitySystem from './world/NetworkEntitySystem.js';
import PlayerSystem from './world/PlayerSystem.js';
import MotionSystem from './world/MotionSystem.js';
import TransformSystem from './world/TransformSystem.js';
import BulletSystem from './world/BulletSystem.js';
import SynchronizedSystem from './world/SynchronizedSystem.js';
import Renderable from './world/RenderableComponent.js';

import Player from './world/PlayerComponent.js';

class World
{
  constructor(remote=true)
  {
    this.remote = remote;
    this.ticks = 0;

    this.serverState = null;

    this.entityManager = new EntityManager();

    this.systems = [];
    this.systems.push(new NetworkEntitySystem(this.entityManager));
    this.systems.push(new PlayerSystem());
    this.systems.push(new MotionSystem());
    this.systems.push(new TransformSystem());
    this.systems.push(new SynchronizedSystem(Renderable));
    this.systems.push(new BulletSystem());
  }

  step(frame, predictive=true)
  {
    this.ticks += frame.delta;

    //Continue to update the world state
    for(const system of this.systems)
    {
      system.onUpdate(this.entityManager, frame);
    }
  }

  updateInput(inputState, targetEntity)
  {
    for(const system of this.systems)
    {
      system.onInputUpdate(targetEntity, inputState);
    }
  }

  captureState()
  {
    //Capture a GameState and return it for sending...
    const dst = {};
    for(const system of this.systems)
    {
      system.writeToGameState(this.entityManager, dst);
    }
    dst.worldTicks = this.ticks;
    return dst;
  }

  resetState(gameState)
  {
    this.ticks = gameState.worldTicks;

    //Continue to reset the world state
    for(const system of this.systems)
    {
      system.readFromGameState(this.entityManager, gameState);
    }

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
