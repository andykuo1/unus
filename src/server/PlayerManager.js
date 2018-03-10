import GameFactory from '../game/GameFactory.js';

class PlayerManager
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    this.players = new Map();
  }

  createPlayer(socketID)
  {
    const entity = GameFactory.createEntity(this.entityManager, 'player');
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

  onUpdate(frame)
  {
    //Nothing here really...
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
