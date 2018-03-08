import Transform from '../world/TransformComponent.js';
import Player from '../world/PlayerComponent.js';

class PlayerManager
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    //This should only be used by server
    this.players = new Map();

    //This should only be used by client
    this.clientPlayer = null;

    this.onPlayerConnect = (client) => {};
    this.onPlayerCreate = (player) => {};
    this.onPlayerDestroy = (player) => {};
    this.onPlayerDisconnect = (client) => {};
  }

  setClientPlayer(entity)
  {
    this.clientPlayer = entity;
  }

  getClientPlayer()
  {
    return this.clientPlayer;
  }

  createPlayer(socketID)
  {
    const entity = this.entityManager.createEntity()
      .addComponent(Transform)
      .addComponent(Player);
    entity.player.socketID = socketID;
    this.players.set(socketID, entity);
    return entity;
  }

  destroyPlayer(socketID)
  {
    const entity = this.players.get(socketID);
    this.players.delete(socketID);
    this.entityManager.destroyEntity(entity);
  }

  getPlayerByClientID(socketID)
  {
    return this.players.get(socketID);
  }

  getPlayers()
  {
    return this.players.values();
  }
}

export default PlayerManager;
