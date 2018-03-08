import EntityManager from './entity/EntityManager.js';

import NetworkEntitySystem from './world/NetworkEntitySystem.js';
import PlayerSystem from './world/PlayerSystem.js';
import MotionSystem from './world/MotionSystem.js';
import TransformSystem from './world/TransformSystem.js';

import Player from './world/PlayerComponent.js';

class World
{
  constructor(frame, remote=true)
  {
    this.remote = remote;
    this.frame = frame;
    this.predictiveFrame = this.frame;

    this.entityManager = new EntityManager();

    this.systems = [];
    this.systems.push(new NetworkEntitySystem(this.entityManager));
    this.systems.push(new PlayerSystem());
    this.systems.push(new MotionSystem());
    this.systems.push(new TransformSystem());
  }

  step(frame, inputState, targetEntity)
  {
    this.predictiveFrame = frame;

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

  get entities()
  {
    return this.entityManager.getEntities();
  }
}

export default World;
