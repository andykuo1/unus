import EntityManager from '../entity/EntityManager.js';
import System from '../entity/System.js';
import Reflection from '../../util/Reflection.js';

class SimpleSystem extends System
{
  constructor(component)
  {
    super();
    this.component = component;
    this.componentName = Reflection.getClassVarName(this.component);
  }

  onEntityUpdate(entity, frame)
  {

  }

  writeEntityToData(entity, dst)
  {

  }

  readEntityFromData(src, entity)
  {

  }

  onUpdate(entityManager, frame)
  {
    super.onUpdate(entityManager, frame);

    const entities = entityManager.getEntitiesByComponent(this.component);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, frame);
    }
  }

  writeToGameState(entityManager, gameState)
  {
    let dst = gameState['entities'];
    if (!dst) dst = gameState['entities'] = {};
    const entities = entityManager.getEntitiesByComponent(this.component);
    for(const entity of entities)
    {
      let entityData = dst[entity._id];
      if (!entityData) entityData = dst[entity._id] = {};
      if (!entityData[this.componentName]) entityData[this.componentName] = {};
      this.writeEntityToData(entity, entityData);
    }
  }

  readFromGameState(entityManager, gameState)
  {
    let src = gameState['entities'] || {};
    for(const entityID in src)
    {
      let entity = entityManager.getEntityByID(entityID);
      if (!entity) throw new Error("Cannot find entity with id \'" + entityID + "\'");

      let entityData = src[entityID];

      if (entityData[this.componentName])
      {
        if (!entity[this.componentName]) entity.addComponent(this.component);
        this.readEntityFromData(entityData, entity);
      }
      else if (entity[this.componentName])
      {
        entity.removeComponent(this.component);
      }
    }
  }
}

export default SimpleSystem;
