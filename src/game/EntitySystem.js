import Reflection from 'util/Reflection.js';
import EntityManager from 'integrated/entity/EntityManager.js';
import Entity from 'integrated/entity/Entity.js';

class EntitySystem
{
  constructor()
  {
    this.manager = new EntityManager();
  }

  serialize()
  {
    const payload = {};
    for(const entity of this.manager.entities)
    {
      const entityData = payload[entity.id] = {};
      entityData.name = entity.name;
      if (entity.tracker !== null) entityData.tracker = String(entity.tracker);

      const componentsData = entityData.components = {};
      const components = this.manager.getComponentsByEntity(entity);
      for(const component of components)
      {
        const componentName = Reflection.getClassVarName(component);
        const componentData = componentsData[componentName] = {};
        for(const propName of Object.keys(component.sync))
        {
          writeProperty(propName, entity[componentName][propName], component.sync[propName], componentData);
        }
      }
    }
    return payload;
  }

  deserialize(payload)
  {
    for(const entityID of Object.keys(payload))
    {
      const entityData = payload[entityID];
      let entity = this.manager.getEntityByID(entityID);
      if (entity === null)
      {
        if (entityData.tracker)
        {
          entity = this.manager.getEntityByTracker(entityData.tracker);
          if (entity === null)
          {
            throw new Error("found invalid entity with unknown id and tracker");
          }
        }
        else
        {
          //Just create it, maybe a packet was skipped...
          entity = this.manager.spawnEntity(entityData.name);
          entity._id = entityID;
        }
      }

      const componentsData = entityData.components;
      for(const componentName of Object.keys(componentsData))
      {
        const componentClass = this.manager.getComponentClassByName(componentName);
        if (componentClass === null) throw new Error("cannot find component class with name \'" + componentName + "\'");
        const componentData = componentsData[componentName];
        if (!entity.hasComponent(componentClass))
        {
          //Just create it, maybe a packet was skipped...
          entity.addComponent(componentClass);
        }
        const component = entity[componentName];
        for(const propertyName of Object.keys(componentClass.sync))
        {
          writeProperty(propertyName, componentData[propertyName], componentClass.sync[propertyName], component);
        }
      }
    }
  }
}

function writeProperty(propertyName, propertyData, syncData, dst)
{
  const propertyType = syncData.type;
  if (propertyType === 'array')
  {
    const elements = dst[propertyName] = [];
    const length = propertyData.length;
    for(let i = 0; i < length; ++i)
    {
      elements.push(0);
      writeProperty(i, propertyData[i], syncData.elements, elements);
    }
  }
  else if (propertyType === 'integer')
  {
    dst[propertyName] = Math.trunc(Number(propertyData)) ;
  }
  else if (propertyType === 'float')
  {
    dst[propertyName] = Number(propertyData);
  }
  else if (propertyType === 'boolean')
  {
    dst[propertyName] = Boolean(propertyData);
  }
  else if (propertyType === 'string')
  {
    dst[propertyName] = String(propertyData);
  }
  else if (propertyType === 'entity')
  {
    if (typeof propertyData === 'string')
    {
      dst[propertyName] = String(propertyData);
    }
    else if (propertyData instanceof Entity)
    {
      dst[propertyName] = propertyData.id;
    }
    else
    {
      throw new Error("unknown entity type \'" + propertyData + "\'");
    }
  }
  else
  {
    throw new Error("unknown data type \'" + propertyType + "\'");
  }

  return dst;
}

export default EntitySystem;
