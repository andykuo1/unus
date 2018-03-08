import Entity from './Entity.js';

import ObjectPool from '../../util/ObjectPool.js';

class EntityManager
{
  constructor(E)
  {
    this.entities = [];
    this.entityPool = new ObjectPool(E || Entity);

    this.components = new Map();
    this.nextEntityID = 1;

    this.onEntityCreate = (entity) => {};
    this.onEntityDestroy = (entity) => {};
  }

  createEntity(id)
  {
    const entity = this.entityPool.obtain();
    entity._manager = this;
    entity._id = id || this.getNextAvailableEntityID();
    this.entities.push(entity);

    this.onEntityCreate(entity);

    return entity;
  }

  destroyEntity(entity)
  {
    this.onEntityDestroy(entity);

    this.clearComponentsFromEntity(entity);
    this.entities.splice(this.entities.indexOf(entity), 1);
    this.entityPool.release(entity);
  }

  getEntityByID(id)
  {
    for(let entity of this.entities)
    {
      if (entity._id == id)
      {
        return entity;
      }
    }
    return null;
  }

  addComponentToEntity(entity, component)
  {
    if (this.hasComponent(entity, component))
    {
      throw new Error("entity already includes component \'" + EntityManager.getComponentName(component) + "\'");
    }

    entity[EntityManager.getComponentName(component)] = new component();

    var list = this.components.get(component) || [];
    list.push(entity);
    this.components.set(component, list);
  }

  removeComponentFromEntity(entity, component)
  {
    if (!this.hasComponent(entity, component))
    {
      throw new Error("entity does not include component \'" + EntityManager.getComponentName(component) + "\'");
    }

    delete entity[EntityManager.getComponentName(component)];

    var list = this.components.get(component);
    if (list)
    {
      list.splice(list.indexOf(entity), 1);
    }
  }

  clearComponentsFromEntity(entity)
  {
    for(const [key, list] of this.components)
    {
      if (list.includes(entity))
      {
        delete entity[EntityManager.getComponentName(key)];

        list.splice(list.indexOf(entity), 1);
      }
    }
  }

  hasComponent(entity, component)
  {
    let list = this.components.get(component);
    return list && list.includes(entity);
  }

  getComponentsByEntity(entity)
  {
    let result = [];
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

  getNextAvailableEntityID()
  {
    return this.nextEntityID++;
  }

  static getComponentName(component)
  {
    var name = component.name;
    return name.charAt(0).toLowerCase() + name.slice(1);
  }
}

export default EntityManager;
