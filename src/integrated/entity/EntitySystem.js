class System
{
  constructor(id)
  {
    this.id = id;
    this.entityManager = null;

    this.entities = [];
  }

  onEntityCreate(entity)
  {
    this.entities.push(entity);
  }

  onEntityDestroy(entity)
  {
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  onUpdate()
  {

  }

  static requireComponent(system, entity, component)
  {
    if (!system.entityManager.hasComponent(entity, component))
    {
      throw new Error("missing component dependency: \'" + component + "\'");
    }
  }
}

export default EntitySystem;
