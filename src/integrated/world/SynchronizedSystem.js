import System from '../entity/System.js';
import Reflection from '../../util/Reflection.js';

class SynchronizedSystem extends System
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
    for(const [key, value] of Object.entries(entity[this.componentName]))
    {
      dst[this.componentName][key] = value;
    }
  }

  readEntityFromData(src, entity)
  {
    for(const [key, value] of Object.entries(src[this.componentName]))
    {
      entity[this.componentName][key] = value;
    }
  }

  onUpdate(entityManager, frame)
  {
    const entities = entityManager.getEntitiesByComponent(this.component);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, frame);
    }
  }

  writeToGameState(entityManager, gameState)
  {
    let dst = gameState['entitylist'];
    if (!dst) dst = gameState['entitylist'] = {};
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
    let src = gameState['entitylist'] || {};
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

export default SynchronizedSystem;