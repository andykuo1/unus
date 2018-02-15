import Entity from './Entity.js';

class EntityManager
{
  constructor()
  {
    this.systems = {};
    this.entities = [];
  }

  registerSystem(system)
  {
    this.systems[system.id] = system;
    system.entityManager = this;
    return this;
  }

  createEntity(components)
  {
    return this.addEntity(new Entity(), components);
  }

  addEntity(entity, components)
  {
    if (entity.dead == false)
    {
      throw new Error("entity already created!");
    }

    this.entities.push(entity);
    if (components)
    {
      for(let i in components)
      {
        this.addComponent(entity, components[i]);
      }
    }
    entity.dead = false;
    entity.onCreate(this);
    return entity;
  }

  removeEntity(entity)
  {
    if (entity.dead == true)
    {
      throw new Error("entity already destroyed!");
    }

    entity.onDestroy(this);
    this.clearComponents(entity);
    entity.dead = true;
    this.entities.splice(this.entities.indexOf(entity), 1);
    return entity;
  }

  getEntities(component)
  {
    return this.systems[component].entities;
  }

  addComponent(entity, component)
  {
    let system = this.systems[component];
    if (system)
    {
      system.onEntityCreate(entity);
      return this;
    }
    throw new Error("could not find system for \'" + component + "\'");
  }

  removeComponent(entity, component)
  {
    let system = this.systems[component];
    if (system)
    {
      if (system.entities.includes(entity))
      {
        system.onEntityDestroy(entity);
        return this;
      }

      throw new Error("entity does not include component \'" + component + "\'");
    }
    throw new Error("could not find system for \'" + component + "\'");
  }

  clearComponents(entity)
  {
    for(let i = this.systems.size; i >= 0; --i)
    {
      let system = this.systems[i];
      if (system.entities.includes(entity))
      {
        system.onEntityDestroy(entity);
      }
    }
  }

  hasComponent(entity, component)
  {
    let system = this.systems[component];
    if (system)
    {
      return system.entities.includes(entity);
    }
    throw new Error("could not find system for \'" + component + "\'");
  }

  update()
  {
    for(let id in this.systems)
    {
      this.systems[id].onUpdate();
    }

    var i = this.entities.length;
    while(i--)
    {
      let entity = this.entities[i];
      if (entity.dead)
      {
        this.removeEntity(entity);
      }
    }
  }
}

export default EntityManager;
