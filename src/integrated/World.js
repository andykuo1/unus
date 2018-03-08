import EntityManager from './entity/EntityManager.js';
import PlayerManager from './player/PlayerManager.js';

import NetworkEntitySystem from './world/NetworkEntitySystem.js';
import PlayerSystem from './world/PlayerSystem.js';
import Player from './world/PlayerComponent.js';

class World
{
  constructor(frame, remote=true)
  {
    this.remote = remote;
    this.frame = frame;
    this.predictiveFrame = this.frame;

    this.entityManager = new EntityManager();
    //TODO: move player manager to server code only
    this.playerManager = new PlayerManager(this.entityManager);

    this.systems = [];
    this.systems.push(new NetworkEntitySystem(this.entityManager));
    this.systems.push(new PlayerSystem());
  }

  step(inputState, frame, target)
  {
    this.predictiveFrame = frame;

    //Update target with inputState
    const targetEntity = this.playerManager.getPlayerByClientID(target);
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

  get players()
  {
    return this.playerManager.getPlayers();
  }

  get entities()
  {
    return this.entityManager.getEntities();
  }
}

export default World;
