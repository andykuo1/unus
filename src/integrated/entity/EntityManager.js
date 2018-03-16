import Entity from './Entity.js';

import Reflection from 'util/Reflection.js';
import ObjectPool from 'util/ObjectPool.js';
import UID from 'util/uid.js';

class EntityManager
{
  constructor(E)
  {
    this.entities = [];
    this.entityPool = new ObjectPool(E || Entity);

    this.components = new Map();
    this.nextEntityID = UID();

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
      throw new Error("entity already includes component \'" + Reflection.getClassVarName(component) + "\'");
    }

    entity[Reflection.getClassVarName(component)] = new component();

    var list = this.components.get(component) || [];
    list.push(entity);
    this.components.set(component, list);
  }

  removeComponentFromEntity(entity, component)
  {
    if (!this.hasComponent(entity, component))
    {
      throw new Error("entity does not include component \'" + Reflection.getClassVarName(component) + "\'");
    }

    delete entity[Reflection.getClassVarName(component)];

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
        delete entity[Reflection.getClassVarName(key)];

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

  getEntityIterator()
  {
    return new EntityIterator(this);
  }

  getNextAvailableEntityID()
  {
    let iters = 100;
    let id = UID();
    while (this.entities[id])
    {
      id = UID();

      if (--iters <= 0)
        throw new Error("cannot find another unique entity id");
    }
    return id;
  }
}

export default EntityManager;
