import System from 'integrated/entity/System.js';
import Reflection from 'util/Reflection.js';

class SynchronizedSystem extends System
{
  constructor(entityManager, component)
  {
    super(entityManager);
    this.component = component;
    this.componentName = Reflection.getClassVarName(this.component);
  }

  onEntityUpdate(entity, delta)
  {

  }

  writeEntityToData(entity, dst)
  {
    const componentData = dst[this.componentName];
    for(const [key, value] of Object.entries(entity[this.componentName]))
    {
      writeKeyValueToData(key, value, componentData);
    }
  }

  readEntityFromData(src, entity)
  {
    const componentData = entity[this.componentName];
    for(const [key, value] of Object.entries(src[this.componentName]))
    {
      writeKeyValueToData(key, value, componentData);
    }
  }

  onUpdate(entityManager, delta)
  {
    const entities = entityManager.getEntitiesByComponent(this.component);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, delta);
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

function writeKeyValueToData(key, value, dst)
{
  if (Array.isArray(value))
  {
    const array = [];
    for(const i in value)
    {
      writeKeyValueToData(i, value[i], array);
    }
    dst[key] = array;
  }
  else
  {
    dst[key] = value;
  }
}

export default SynchronizedSystem;
