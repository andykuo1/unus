import Serializer from './Serializer.js';
import Reflection from 'util/Reflection.js';

import * as Components from 'shared/entity/component/Components.js';

class EntityDataSerializer extends Serializer
{
  constructor(entityManager)
  {
    super();
    this._entityManager = entityManager;
  }

  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    const entityData = dst[propertyName] = {};
    entityData.name = propertyData.name;

    const componentsData = entityData.components = {};
    const components = this._entityManager.getComponentsByEntity(propertyData);
    for(const component of components)
    {
      const componentName = Reflection.getClassName(component);
      const componentData = componentsData[componentName] = {};
      for(const propName of Object.keys(component.sync))
      {
        serializer.encodeProperty(propName, propertyData[componentName][propName], component.sync[propName], componentData);
      }
    }
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst=null)
  {
    const entityData = propertyData[propertyName];
    const entityID = propertyName;
    let entity = this._entityManager.getEntityByID(entityID);

    //Just create it, maybe a packet was skipped...
    if (entity === null)
    {
      console.log("WARNING! - Creating missing entity...");

      //Try to create with default constructor, otherwise use empty entity template
      try
      {
        entity = this._entityManager.spawnEntity(entityData.name);
      }
      catch (e)
      {
        entity = this._entityManager.spawnEntity();
      }
      entity._id = entityID;
    }

    const componentsData = entityData.components;
    for(const componentName of Object.keys(componentsData))
    {
      const componentClass = this._entityManager.getComponentClassByName(componentName) || Components[componentName];
      if (componentClass === null)
      {
        throw new Error("cannot find component class with name \'" + componentName + "\'");
      }

      const componentData = componentsData[componentName];
      if (!this._entityManager.hasComponentByEntity(entity, componentClass))
      {
        this._entityManager.addComponentToEntity(entity, componentClass);
      }
      const component = entity[componentName];
      for(const propertyName of Object.keys(componentClass.sync))
      {
        serializer.decodeProperty(propertyName, componentData[propertyName], componentClass.sync[propertyName], component);
      }
    }
  }
}

export default EntityDataSerializer;
