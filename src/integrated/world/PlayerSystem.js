import EntityManager from '../entity/EntityManager.js';
import System from '../entity/System.js';
import Player from './PlayerComponent.js';

class PlayerSystem extends System
{
  constructor()
  {
    super();
  }

  onUpdate(entityManager, frame)
  {
    super.onUpdate(entityManager, frame);

    const entities = entityManager.getEntitiesByComponent(Player);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, frame);
    }
  }

  onEntityUpdate(entity, frame)
  {
    entity.x = entity.player.nextX;
    entity.y = entity.player.nextY;
  }

  onInputUpdate(entity, inputState)
  {
    super.onInputUpdate(entity, inputState);

    if (!entity.hasComponent(Player)) return;
    entity.player.nextX = inputState.x;
    entity.player.nextY = inputState.y;
  }

  writeEntityToData(entity, dst)
  {
    dst.player.nextX = entity.player.nextX;
    dst.player.nextY = entity.player.nextY;
    dst.player.socketID = entity.player.socketID;
  }

  readEntityFromData(src, entity)
  {
    entity.player.nextX = src.player.nextX;
    entity.player.nextY = src.player.nextY;
    entity.player.socketID = src.player.socketID;
  }

  writeToGameState(entityManager, gameState)
  {
    const CNAME = EntityManager.getComponentName(Player);

    let dst = gameState['entities'];
    if (!dst) dst = gameState['entities'] = {};
    const entities = entityManager.getEntitiesByComponent(Player);
    for(const entity of entities)
    {
      let entityData = dst[entity._id];
      if (!entityData) entityData = dst[entity._id] = {};
      if (!entityData[CNAME]) entityData[CNAME] = {};
      this.writeEntityToData(entity, entityData);
    }
  }

  readFromGameState(entityManager, gameState)
  {
    const CNAME = EntityManager.getComponentName(Player);

    let src = gameState['entities'] || {};
    for(const entityID in src)
    {
      let entity = entityManager.getEntityByID(entityID);
      if (!entity) throw new Error("Cannot find entity with id \'" + entityID + "\'");

      let entityData = src[entityID];

      if (entityData[CNAME])
      {
        if (!entity[CNAME]) entity.addComponent(Player);
        this.readEntityFromData(entityData, entity);
      }
      else if (entity[CNAME])
      {
        entity.removeComponent(Player);
      }
    }
  }
}

export default PlayerSystem;
