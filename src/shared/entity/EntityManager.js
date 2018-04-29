import Reflection from 'util/Reflection.js';
import UID from 'util/UID.js';
import Eventable from 'util/Eventable.js';

import EntityRegistry from './EntityRegistry.js';
import Entity from './Entity.js';

class EntityManager
{
  constructor()
  {
    this.entities = [];
    this.components = new Map();
    this.registry = new EntityRegistry(this);
  }

  getEntityByID(id)
  {
    for(const entity of this.entities)
    {
      if (entity._id === id) return entity;
    }
    return null;
  }

  spawnEntity(name=null)
  {
    const entity = this.registry.createEntity(name);
    this.emit('entityCreate', entity, name);
    return entity;
  }

  destroyEntity(entity)
  {
    this.emit('entityDestroy', entity);
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

  addComponentToEntity(entity, component)
  {
    if (this.hasComponentByEntity(entity, component))
    {
      throw new Error("entity already includes component \'" + Reflection.getClassName(component) + "\'");
    }

    if (!component)
    {
      throw new Error("cannot add undefined component to entity");
    }

    entity[Reflection.getClassName(component)] = new component();

    const list = this.components.get(component) || [];
    list.push(entity);
    this.components.set(component, list);

    this.emit('entityComponentAdd', entity, component);
  }

  removeComponentFromEntity(entity, component)
  {
    if (!this.hasComponentByEntity(entity, component))
    {
      throw new Error("entity does not include component \'" + Reflection.getClassName(component) + "\'");
    }

    delete entity[Reflection.getClassName(component)];

    const list = this.components.get(component);
    if (list)
    {
      list.splice(list.indexOf(entity), 1);
    }

    this.emit('entityComponentRemove', entity, component);
  }

  clearComponentsFromEntity(entity)
  {
    for(const [key, list] of this.components)
    {
      if (list.includes(entity))
      {
        const component = entity[Reflection.getClassName(key)];
        delete entity[Reflection.getClassName(key)];

        list.splice(list.indexOf(entity), 1);

        this.emit('entityComponentRemove', entity, component);
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

  getComponentClassByName(componentName)
  {
    for(const component of this.components.keys())
    {
      if (Reflection.getClassName(component) === componentName)
      {
        return component;
      }
    }
    return null;
  }

  getEntitiesByComponent(component)
  {
    return this.components.get(component) || [];
  }
}

Object.assign(EntityManager.prototype, Eventable);

export default EntityManager;
