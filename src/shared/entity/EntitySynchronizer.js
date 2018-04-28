import { vec3, quat } from 'gl-matrix';
import Reflection from 'util/Reflection.js';
import EntityManager from './EntityManager.js';
import Entity from './Entity.js';

import * as Components from 'shared/entity/component/Components.js';

import SerializerRegistry from 'shared/serialization/SerializerRegistry.js';

import BooleanSerializer from 'shared/serialization/BooleanSerializer.js';
import IntegerSerializer from 'shared/serialization/IntegerSerializer.js';
import FloatSerializer from 'shared/serialization/FloatSerializer.js';
import Vec2Serializer from 'shared/serialization/Vec2Serializer.js';
import Vec3Serializer from 'shared/serialization/Vec3Serializer.js';
import Vec4Serializer from 'shared/serialization/Vec4Serializer.js';
import QuatSerializer from 'shared/serialization/QuatSerializer.js';
import Mat4Serializer from 'shared/serialization/Mat4Serializer.js';
import StringSerializer from 'shared/serialization/StringSerializer.js';
import ArraySerializer from 'shared/serialization/ArraySerializer.js';
import EntityReferenceSerializer from 'shared/serialization/EntityReferenceSerializer.js';

class EntitySynchronizer
{
  constructor(entityManager)
  {
    this.manager = entityManager;
    this.manager.on('entityCreate', this.onEntityCreate.bind(this));
    this.manager.on('entityDestroy', this.onEntityDestroy.bind(this));

    this.serializers = new SerializerRegistry();
    this.serializers.registerSerializableType('boolean', new BooleanSerializer());
    this.serializers.registerSerializableType('integer', new IntegerSerializer());
    this.serializers.registerSerializableType('float', new FloatSerializer());
    this.serializers.registerSerializableType('vec2', new Vec2Serializer());
    this.serializers.registerSerializableType('vec3', new Vec3Serializer());
    this.serializers.registerSerializableType('vec4', new Vec4Serializer());
    this.serializers.registerSerializableType('quat', new QuatSerializer());
    this.serializers.registerSerializableType('mat4', new Mat4Serializer());
    this.serializers.registerSerializableType('string', new StringSerializer());
    this.serializers.registerSerializableType('array', new ArraySerializer());
    this.serializers.registerSerializableType('entity', new EntityReferenceSerializer(this.manager));

    this.cachedEvents = [];
  }

  serialize()
  {
    const payload = {};
    payload.isComplete = true;

    //Write events...
    const eventsPayload = payload.events = [];
    for(const event of this.cachedEvents)
    {
      eventsPayload.push(event);
    }
    this.cachedEvents.length = 0;

    //Write entities...
    const entitiesPayload = payload.entities = {};
    for(const entity of this.manager.entities)
    {
      const entityData = entitiesPayload[entity.id] = {};
      entityData.name = entity.name;

      const componentsData = entityData.components = {};
      const components = this.manager.getComponentsByEntity(entity);
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
    return payload;
  }

  deserialize(payload)
  {
    const eventsPayload = payload.events;
    for(const event of payload.events)
    {
      if (event.type === 'create')
      {
        const entity = this.manager.spawnEntity(event.entityName);
        entity._id = event.entityID;
      }
      else if (event.type === 'destroy')
      {
        const entity = this.manager.getEntityByID(event.entityID);
        if (entity === null) continue;
        this.manager.destroyEntity(entity);
      }
      else
      {
        throw new Error("unknown event type \'" + event.type + "\'");
      }
    }

    const entitiesPayload = payload.entities;
    for(const entityID of Object.keys(entitiesPayload))
    {
      const entityData = entitiesPayload[entityID];
      let entity = this.manager.getEntityByID(entityID);
      if (entity === null)
      {
        //Just create it, maybe a packet was skipped...
        entity = this.manager.spawnEntity(entityData.name);
        entity._id = entityID;
      }

      const componentsData = entityData.components;
      for(const componentName of Object.keys(componentsData))
      {
        const componentClass = this.manager.getComponentClassByName(componentName) || Components[componentName];
        if (componentClass === null)
        {
          throw new Error("cannot find component class with name \'" + componentName + "\'");
        }

        const componentData = componentsData[componentName];
        if (!entity.hasComponent(componentClass))
        {
          //Just create it, maybe a packet was skipped...
          entity.addComponent(componentClass);
        }
        const component = entity[componentName];
        for(const propertyName of Object.keys(componentClass.sync))
        {
          this.decodeProperty(propertyName, componentData[propertyName], componentClass.sync[propertyName], component);
        }
      }
    }

    if (payload.isComplete)
    {
      //Destroy any that do not belong...
      for(const entity of this.manager.entities)
      {
        if (!entitiesPayload.hasOwnProperty(entity.id)) //&& !entity.tracker
        {
          this.manager.destroyEntity(entity);
        }
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

  onEntityCreate(entity)
  {
    const event = {};
    event.type = 'create';
    event.entityID = entity.id;
    event.entityName = entity.name;
    this.cachedEvents.push(event);
  }

  onEntityDestroy(entity)
  {
    const event = {};
    event.type = 'destroy';
    event.entityID = entity.id;
    event.entityName = entity.name;
    this.cachedEvents.push(event);
  }
}

export default EntitySynchronizer;
