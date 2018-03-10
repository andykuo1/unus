import Frame from '../util/Frame.js';
import EntityManager from './entity/EntityManager.js';

import NetworkEntitySystem from './world/NetworkEntitySystem.js';
import PlayerSystem from './world/PlayerSystem.js';
import MotionSystem from './world/MotionSystem.js';
import TransformSystem from './world/TransformSystem.js';

import Player from './world/PlayerComponent.js';

class World
{
  constructor(remote=true)
  {
    this.remote = remote;
    this.ticks = 0;
    this.frame = new Frame();
    this.predictiveFrame = new Frame();

    this.entityManager = new EntityManager();

    this.systems = [];
    this.systems.push(new NetworkEntitySystem(this.entityManager));
    this.systems.push(new PlayerSystem());
    this.systems.push(new MotionSystem());
    this.systems.push(new TransformSystem());
  }

  step(frame, inputState, targetEntity, predictive=true)
  {
    if (!predictive) this.frame.set(frame);
    this.predictiveFrame.set(frame);

    //Update target with inputState
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
    dst.frame = new Frame().set(frame);
    dst.ticks = this.ticks;
    return dst;
  }

  resetState(gameState)
  {
    this.ticks = gameState.ticks;
    this.frame.set(gameState.frame);
    this.predictiveFrame.set(this.frame);

    //Continue to reset the world state
    for(const system of this.systems)
    {
      system.readFromGameState(this.entityManager, gameState);
    }
  }

  get entities()
  {
    return this.entityManager.getEntities();
  }
}

export default World;
