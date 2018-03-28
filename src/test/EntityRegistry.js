import Entity from './Entity.js';
import ObjectPool from 'util/ObjectPool.js';

import UID from 'util/uid.js';

class EntityRegistry
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
    this.entityMap = new Map();
    this.entityPool = new ObjectPool(Entity);
  }

  register(name, entityGenerator)
  {
    this.entityMap.set(name, entityGenerator);
  }

  unregister(name)
  {
    this.entityMap.delete(name);
  }

  createEntity(name)
  {
    const generator = this.entityMap.get(name);
    if (!generator) throw new Error("entity \'" + name + "\' is not registered");
    const entity = this._createEntity();
    entity._manager = this.entityManager;
    entity._name = name;
    this.entityManager.entities.push(entity);
    generator.apply(entity);
    return entity;
  }

  deleteEntity(entity)
  {
    entity.clearComponents();
    this.entityManager.entities.splice(this.entityManager.entities.indexOf(entity), 1);
    this.entityPool.release(entity);
  }

  _createEntity()
  {
    const entity = this.entityPool.obtain();
    entity._manager = this.entityManager;
    entity._id = this._nextAvailableEntityID();
    return entity;
  }

  _nextAvailableEntityID()
  {
    let iters = 100;
    let id = UID();
    while (this.entityManager.entities[id])
    {
      id = UID();

      if (--iters <= 0)
        throw new Error("cannot find another unique entity id");
    }
    return id;
  }
}

export default EntityRegistry;
