import { quat } from 'gl-matrix';
import System from 'test/System.js';

import ComponentTransform from 'test/ComponentTransform.js';

class SystemMotion extends System
{
  constructor()
  {
    super();
  }

  onUpdate(entityManager, delta)
  {
    //Interpolating...
    const entities = entityManager.getEntitiesByComponent(ComponentTransform);
    for(const entity of entities)
    {
      const transform = entity.transform;
      transform.x = Math.lerp(transform.x, transform.nextX, delta);
      transform.y = Math.lerp(transform.y, transform.nextY, delta);
      //quat.rotateZ(transform.rotation, transform.rotation, delta);
    }
  }

  saveToGameState(entityManager, gameState)
  {
    const entities = entityManager.getEntitiesByComponent(ComponentTransform);
    for(const entity of entities)
    {
      let result = gameState.entities[entity.id];
      if (!result) result = gameState.entities[entity.id] = {};
      if (!result.transform) result.transform = {};
      result.transform.x = entity.transform.x;
      result.transform.y = entity.transform.y;
    }
  }

  loadFromGameState(entityManager, gameState)
  {
    const entities = entityManager.getEntitiesByComponent(ComponentTransform);
    for(const entity of entities)
    {
      const result = gameState.entities[entity.id];
      if (!result) continue;
      if (!result.transform) continue;
      entity.transform.nextX = entity.transform.x = result.transform.x;
      entity.transform.nextY = entity.transform.y = result.transform.y;
    }
  }

  writeToGameState(entityManager, gameState)
  {
    const entities = entityManager.getEntitiesByComponent(ComponentTransform);
    for(const entity of entities)
    {
      let result = gameState.entities[entity.id];
      if (!result) result = gameState.entities[entity.id] = {};
      if (!result.transform) result.transform = {};
      result.transform.x = entity.transform.x;
      result.transform.y = entity.transform.y;
    }
  }

  readFromGameState(entityManager, gameState)
  {
    const entities = entityManager.getEntitiesByComponent(ComponentTransform);
    for(const entity of entities)
    {
      let result = gameState.entities[entity.id];
      if (!result) continue;
      if (!result.transform) continue;
      entity.transform.nextX = result.transform.x;
      entity.transform.nextY = result.transform.y;
    }
  }
}

export default SystemMotion;
