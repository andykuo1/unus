import Transform from '../world/TransformComponent.js';
import Player from '../world/PlayerComponent.js';

class PlayerManager
{
  constructor(entityManager)
  {
    //This should only be used by server
    this.entityManager = entityManager;
    this.players = new Map();

    this.onPlayerConnect = (client) => {};
    this.onPlayerCreate = (player) => {};
    this.onPlayerDestroy = (player) => {};
    this.onPlayerDisconnect = (client) => {};
  }

  createPlayer(socketID)
  {
    const entity = this.entityManager.createEntity()
      .addComponent(Transform)
      .addComponent(Player);
    entity.player.socketID = socketID;
    this.players.set(socketID, entity);
  }

  destroyPlayer(socketID)
  {
    const entity = this.players.get(socketID);
    this.players.delete(socketID);
    this.entityManager.destroyEntity(entity);
  }

  getPlayerByClientID(socketID)
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

  getPlayers()
  {
    return this.players.values();
  }
}

export default PlayerManager;
