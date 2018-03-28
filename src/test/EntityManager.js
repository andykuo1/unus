import StackTrace from 'stacktrace-js';
import Entity from 'test/Entity.js';

import Reflection from 'util/Reflection.js';
import ObjectPool from 'util/ObjectPool.js';
import UID from 'util/uid.js';

import EventHandler from 'util/EventHandler.js';
import EntityRegistry from './EntityRegistry.js';

class EntityManager
{
  constructor()
  {
    this.entities = [];
    this.systems = [];
    this.components = new Map();
    this.registry = new EntityRegistry(this);

    this.events = new EventHandler();
  }

  update(delta)
  {
    for(const system of this.systems)
    {
      system.onUpdate(this, delta);
    }
  }

  getEntityByID(id)
  {
    for(const entity of this.entities)
    {
      if (entity._id === id) return entity;
    }
    return null;
  }

  spawnEntity(name)
  {
    const entity = this.registry.createEntity(name);
    this.events.emit('entityCreate', entity, name);
    return entity;
  }

  destroyEntity(entity)
  {
    this.events.emit('entityDestroy', entity);
    this.registry.deleteEntity(entity);
  }

  clearEntities()
  {
    while(this.entities.length > 0)
    {
      this.registry.deleteEntity(this.entities[0]);
    }
  }

  registerEntity(name, generator)
  {
    this.registry.register(name, generator);
  }

  unregisterEntity(name)
  {
    this.registry.unregister(name);
  }

  addSystem(system)
  {
    this.systems.push(system);
  }

  removeSystem(system)
  {
    this.systems.splice(this.systems.indexOf(system), 1);
  }

  addComponentToEntity(entity, component)
  {
    if (this.hasComponentByEntity(entity, component))
    {
      throw new Error("entity already includes component \'" + Reflection.getClassVarName(component) + "\'");
    }

    entity[Reflection.getClassVarName(component)] = new component();

    const list = this.components.get(component) || [];
    list.push(entity);
    this.components.set(component, list);

    this.events.emit('entityComponentAdd', entity, component);
  }

  removeComponentFromEntity(entity, component)
  {
    if (!this.hasComponentByEntity(entity, component))
    {
      throw new Error("entity does not include component \'" + Reflection.getClassVarName(component) + "\'");
    }

    delete entity[Reflection.getClassVarName(component)];

    const list = this.components.get(component);
    if (list)
    {
      list.splice(list.indexOf(entity), 1);
    }

    this.events.emit('entityComponentRemove', entity, component);
  }

  clearComponentsFromEntity(entity)
  {
    for(const [key, list] of this.components)
    {
      if (list.includes(entity))
      {
        const component = entity[Reflection.getClassVarName(key)];
        delete entity[Reflection.getClassVarName(key)];

        list.splice(list.indexOf(entity), 1);

        this.events.emit('entityComponentRemove', entity, component);
      }
    }
  }

  hasComponentByEntity(entity, component)
  {
    const list = this.components.get(component);
    return list && list.includes(entity);
  }

  getComponentsByEntity(entity)
  {
    const result = [];
    for(const [key, list] of this.components)
    {
      if (list.includes(entity))
      {
        result.push(key);
      }
    }
    return result;
  }

  getEntitiesByComponent(component)
  {
    return this.components.get(component) || [];
  }

  getEntities()
  {
    return this.entities;
  }
}

export default EntityManager;
