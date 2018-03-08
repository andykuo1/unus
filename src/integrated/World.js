import EntityManager from './entity/EntityManager.js';
import EntitySystem from './entity/EntitySystem.js';

import PlayerSystem from './entity/PlayerSystem.js';
import Player from './entity/PlayerComponent.js';

class World
{
  constructor(frame, remote=true)
  {
    this.remote = remote;
    this.frame = frame;
    this.predictiveFrame = this.frame;

    this.entityManager = new EntityManager();
    this.systems = [];
    this.systems.push(new EntitySystem(this.entityManager));
    this.systems.push(new PlayerSystem());
  }

  step(inputState, frame, target)
  {
    this.predictiveFrame = frame;

    //Update target with inputState
    const targetEntity = this.getEntityByClientID(target);
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

  getEntityByClientID(socketID)
  {
    for(const entity of this.entityManager.getEntitiesByComponent(Player))
    {
      if (entity.player.socketID == socketID)
      {
        return entity;
      }
    }

    return null;
  }

  get entities()
  {
    return this.entityManager.getEntities();
  }
}

export default World;
