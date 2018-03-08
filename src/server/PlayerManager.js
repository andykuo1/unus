import Transform from '../integrated/world/TransformComponent.js';
import Motion from '../integrated/world/MotionComponent.js';
import Player from '../integrated/world/PlayerComponent.js';

class PlayerManager
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    this.players = new Map();
  }

  createPlayer(socketID)
  {
    const entity = this.entityManager.createEntity()
      .addComponent(Transform)
      .addComponent(Motion)
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
