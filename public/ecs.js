class Entity
{
  constructor()
  {
  }

  onCreate()
  {
  }

  onDestroy()
  {
  }
}

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
    entity.onCreate();
    return entity;
  }

  removeEntity(entity)
  {
    if (entity.dead == true)
    {
      throw new Error("entity already destroyed!");
    }

    entity.onDestroy();
    this.clearComponents(entity);
    entity.dead = true;
    this.entities.splice(this.entities.indexOf(entity), 1);
    return entity;
  }

  getEntities(component)
  {
    return this.systems[component].components;
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
      if (system.components.includes(entity))
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
      if (system.components.includes(entity))
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
      return system.components.includes(entity);
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

class System
{
  constructor(id)
  {
    this.id = id;
    this.entityManager = null;

    this.components = [];
  }

  onEntityCreate(entity)
  {
    this.components.push(entity);
  }

  onEntityDestroy(entity)
  {
    this.components.remove(entity);
  }

  onUpdate()
  {

  }

  requireComponent(entity, component)
  {
    if (!this.entityManager.hasComponent(entity, component))
    {
      throw new Error("missing component dependency: \'" + component + "\'");
    }
  }
}

class TransformSystem extends System
{
  constructor()
  {
    super("transform");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);

    entity.transform = new Transform();
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.transform;
  }
}

class RenderableSystem extends System
{
  constructor()
  {
    super("renderable");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");
  }
}

class MotionSystem extends System
{
  constructor()
  {
    super("motion");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");

    entity.motion = vec2.create();
    entity.friction = 0.1;
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.motion;
    delete entity.friction;
  }

  onUpdate()
  {
    super.onUpdate();

    for(let i in this.components)
    {
      let component = this.components[i];
      component.transform.position[0] += component.motion[0];
      component.transform.position[1] += component.motion[1];

      const fric = 1.0 - component.friction;
      component.motion[0] *= fric;
      component.motion[1] *= fric;

      if (component.motion[0] < MotionSystem.MOTION_MIN && component.motion[0] > -MotionSystem.MOTION_MIN) component.motion[0] = 0;
      if (component.motion[1] < MotionSystem.MOTION_MIN && component.motion[1] > -MotionSystem.MOTION_MIN) component.motion[1] = 0;
    }
  }
}
MotionSystem.MOTION_MIN = 0.01;
