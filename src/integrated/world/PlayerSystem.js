import EntityManager from '../entity/EntityManager.js';
import System from '../entity/System.js';
import Player from './PlayerComponent.js';
import Transform from './TransformComponent.js';

import Reflection from '../../util/Reflection.js';

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
    const dx = entity.player.nextX - entity.x;
    const dy = entity.player.nextY - entity.y;
    const rot = -Math.atan2(-dy, dx);

    const speed = 10.0;
    entity.x += Math.cos(rot) * speed * frame.delta;
    entity.y += Math.sin(rot) * speed * frame.delta;
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
    const PLAYER_NAME = Reflection.getClassVarName(Player);

    let dst = gameState['entities'];
    if (!dst) dst = gameState['entities'] = {};
    const entities = entityManager.getEntitiesByComponent(Player);
    for(const entity of entities)
    {
      let entityData = dst[entity._id];
      if (!entityData) entityData = dst[entity._id] = {};
      if (!entityData[PLAYER_NAME]) entityData[PLAYER_NAME] = {};
      this.writeEntityToData(entity, entityData);
    }
  }

  readFromGameState(entityManager, gameState)
  {
    const PLAYER_NAME = Reflection.getClassVarName(Player);

    let src = gameState['entities'] || {};
    for(const entityID in src)
    {
      let entity = entityManager.getEntityByID(entityID);
      if (!entity) throw new Error("Cannot find entity with id \'" + entityID + "\'");

      let entityData = src[entityID];

      if (entityData[PLAYER_NAME])
      {
        if (!entity[PLAYER_NAME]) entity.addComponent(Player);
        this.readEntityFromData(entityData, entity);
      }
      else if (entity[PLAYER_NAME])
      {
        entity.removeComponent(Player);
      }
    }
  }
}

export default PlayerSystem;
