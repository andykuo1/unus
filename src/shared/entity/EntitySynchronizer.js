import { vec3, quat } from 'gl-matrix';
import Reflection from 'util/Reflection.js';
import EntityManager from './EntityManager.js';
import Entity from './Entity.js';
import SerializerRegistry from './SerializerRegistry.js';

import * as Components from 'shared/entity/component/Components.js';
import * as Serializables from 'shared/serializable/Serializables.js';

const MAX_CACHED_STATES = 10;

class EntitySynchronizer
{
  constructor(entityManager)
  {
    this._entityManager = entityManager;

    this.serializers = new SerializerRegistry();
    this.serializers.registerSerializableType('boolean', new Serializables.BooleanSerializer());
    this.serializers.registerSerializableType('integer', new Serializables.IntegerSerializer());
    this.serializers.registerSerializableType('float', new Serializables.FloatSerializer());
    this.serializers.registerSerializableType('vec2', new Serializables.Vec2Serializer());
    this.serializers.registerSerializableType('vec3', new Serializables.Vec3Serializer());
    this.serializers.registerSerializableType('vec4', new Serializables.Vec4Serializer());
    this.serializers.registerSerializableType('quat', new Serializables.QuatSerializer());
    this.serializers.registerSerializableType('mat4', new Serializables.Mat4Serializer());
    this.serializers.registerSerializableType('string', new Serializables.StringSerializer());
    this.serializers.registerSerializableType('array', new Serializables.ArraySerializer());
    this.serializers.registerSerializableType('entity', new Serializables.EntityReferenceSerializer(this._entityManager));

    //HACK: this is so we can use custom components not in Components.js
    this.customComponents = {};

    this.cachedStates = [];
  }

  serialize(isComplete=true)
  {
    const payload = {};
    payload.isComplete = isComplete;

    //Write entities...
    const entitiesPayload = payload.entities = {};
    for(const entity of this._entityManager.entities)
    {
      this.serializeEntity(entity, entitiesPayload, isComplete);
    }

    //Cache serialized states...
    this.cachedStates.push(payload);
    if (this.cachedStates.length > MAX_CACHED_STATES)
    {
      this.cachedStates.shift();
    }

    //Try to make difference state...
    if (!isComplete && this.cachedStates.length > 1)
    {
      const previousState = this.cachedStates[this.cachedStates.length - 2];
      const diffState = this.makeDifferenceState(previousState, payload);
      return diffState;
    }
    else
    {
      return payload;
    }
  }

  deserialize(payload)
  {
    const isComplete = payload.isComplete;

    if (!isComplete)
    {
      const eventsPayload = payload.entityEvents;
      for(const event of eventsPayload)
      {
        if (event.type === 'create')
        {
          //Try to create with default constructor, otherwise use empty entity template
          let entity = null;
          try
          {
            entity = this._entityManager.spawnEntity(event.entityName);
          }
          catch (e)
          {
            entity = this._entityManager.spawnEntity();
          }
          entity._id = event.entityID;
          this.deserializeEntity(entity._id, event.entityData, true);
        }
        else if (event.type === 'destroy')
        {
          const entity = this._entityManager.getEntityByID(event.entityID);
          if (entity === null) continue;
          this._entityManager.destroyEntity(entity);
        }
        else
        {
          throw new Error("unknown entity event type \'" + event.type + "\'");
        }
      }
    }

    const entitiesPayload = payload.entities;
    for(const entityID of Object.keys(entitiesPayload))
    {
      this.deserializeEntity(entityID, entitiesPayload, isComplete);
    }

    if (isComplete)
    {
      //Destroy any that do not belong...
      for(const entity of this._entityManager.entities)
      {
        if (!entitiesPayload.hasOwnProperty(entity.id))//TODO: make a flag to save client only entities
        {
          this._entityManager.destroyEntity(entity);
        }
      }
    }
  }

  serializeEntity(entity, dst)
  {
    const entityData = dst[entity.id] = {};
    entityData.name = entity.name;

    const componentsData = entityData.components = {};
    const components = this._entityManager.getComponentsByEntity(entity);
    for(const component of components)
    {
      const componentName = Reflection.getClassName(component);
      const componentData = componentsData[componentName] = {};
      for(const propName of Object.keys(component.sync))
      {
        this.encodeProperty(propName, entity[componentName][propName], component.sync[propName], componentData);
      }
    }
  }

  deserializeEntity(entityID, src, isComplete)
  {
    const entityData = src[entityID];
    let entity = this._entityManager.getEntityByID(entityID);

    if (entity === null)
    {
      if (!isComplete)
      {
        //Just create it, maybe a packet was skipped
        console.log("WARNING! - Found unknown entity...");
      }

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
      const componentClass = this._entityManager.getComponentClassByName(componentName) || Components[componentName] || this.customComponents[componentName];
      if (!componentClass)
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
        if (!componentData.hasOwnProperty(propertyName))
        {
          if (isComplete)
          {
            throw new Error("cannot find synchronized property \'" + propertyName + "\' for component \'" + componentName + "\' - Perhaps you forgot to modify the sync variable?");
          }
          else
          {
            //The property could not require any changes if incomplete update...
            continue;
          }
        }

        this.decodeProperty(propertyName, componentData[propertyName], componentClass.sync[propertyName], component);
      }
    }
  }

  encodeProperty(propertyName, propertyData, syncOpts, dst)
  {
    const propertyType = syncOpts.type;
    const serializer = this.serializers.getSerializerForType(propertyType);
    serializer.encode(this, propertyName, propertyData, syncOpts, dst);
    return dst;
  }

  decodeProperty(propertyName, propertyData, syncOpts, dst)
  {
    const propertyType = syncOpts.type;
    const serializer = this.serializers.getSerializerForType(propertyType);
    serializer.decode(this, propertyName, propertyData, syncOpts, dst);
    return dst;
  }

  makeDifferenceState(oldState, newState)
  {
    if (oldState === null || newState === null) return newState;

    const oldEntities = oldState.entities;
    const newEntities = newState.entities;

    if (oldEntities === null || newEntities === null) return true;

    const payload = {};
    const eventsPayload = payload.entityEvents = [];
    const entitiesPayload = payload.entities = {};

    for(const entityID of Object.keys(newEntities))
    {
      if (!oldEntities.hasOwnProperty(entityID))
      {
        //Create event
        const entity = newEntities[entityID];
        const event = {};
        event.type = 'create';
        event.entityID = entityID;
        event.entityName = newEntities[entityID].name;
        event.entityData = {}
        event.entityData[entityID] = newEntities[entityID];
        eventsPayload.push(event);
      }
      else
      {
        //Diff the states...
        const oldEntityData = oldEntities[entityID];
        const newEntityData = newEntities[entityID];
        const dstEntityData = {};
        let entityDirty = false;

        const oldComponentsData = oldEntityData.components;
        const newComponentsData = newEntityData.components;
        const dstComponentsData = {};
        let componentsDirty = false;

        for(const componentName of Object.keys(newComponentsData))
        {
          //Found new component...
          if (!oldComponentsData.hasOwnProperty(componentName))
          {
            //Just keep the new data...
            dstComponentsData[componentName] = newComponentsData[componentName];
            componentsDirty = true;
            continue;
          }
          else
          {
            const newComponentData = newComponentsData[componentName];
            const oldComponentData = oldComponentsData[componentName];
            const dstComponentData = {};
            let componentDirty = false;

            for(const propertyName of Object.keys(newComponentData))
            {
              const newPropertyData = newComponentData[propertyName];
              const oldPropertyData = oldComponentData[propertyName];

              if (this.isPropertyChanged(oldPropertyData, newPropertyData))
              {
                //Add new, changed property from payload
                dstComponentData[propertyName] = newPropertyData;
                componentDirty = true;
              }
            }

            //Only write if dirty...
            if (componentDirty)
            {
              dstComponentsData[componentName] = dstComponentData;
              componentsDirty = true;
            }
          }
        }

        //Only write if dirty...
        if (componentsDirty)
        {
          dstEntityData.components = dstComponentsData;
          entityDirty = true;
        }

        //Only write if dirty...
        if (entityDirty)
        {
          entitiesPayload[entityID] = dstEntityData;
        }
      }
    }

    for(const entityID of Object.keys(oldEntities))
    {
      if (!newEntities.hasOwnProperty(entityID))
      {
        //Destroy event
        const entity = oldEntities[entityID];
        const event = {};
        event.type = 'destroy';
        event.entityID = entityID;
        eventsPayload.push(event);
      }
    }

    return payload;
  }

  isPropertyChanged(newPropertyData, oldPropertyData)
  {
    if (oldPropertyData === newPropertyData) return false;
    if (oldPropertyData === null || newPropertyData === null) return true;
    if (Array.isArray(oldPropertyData) && Array.isArray(newPropertyData))
    {
      if (oldPropertyData.length != newPropertyData.length) return true;

      let i = oldPropertyData.length;
      while(--i)
      {
        if (this.isPropertyChanged(newPropertyData[i], oldPropertyData[i]))
        {
          return true;
        }
      }
    }
    else if (typeof oldPropertyData == 'string' && typeof newPropertyData == 'string')
    {
      return oldPropertyData != newPropertyData;
    }
    else if ((typeof oldPropertyData == 'number' && typeof newPropertyData == 'number')
      || (typeof oldPropertyData == 'boolean' && typeof newPropertyData == 'boolean'))
    {
      return oldPropertyData !== newPropertyData;
    }
    else if (typeof oldPropertyData === typeof newPropertyData)
    {
      if (oldPropertyData !== newPropertyData)
      {
        console.log("WARNING! - matching generic type, force updating property");
        return true;
      }
    }
    else
    {
      console.log("WARNING! - could not match type, force updating property");
      return true;
    }

    return false;
  }
}

export default EntitySynchronizer;
