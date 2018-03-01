class EntitySystem
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

  encodeEntityData(src, dst)
  {

  }

  decodeEntityData(src, dst)
  {

  }

  getEntityByID(id)
  {
    //TODO: make a hash map for this
    for(const entity of this.entities)
    {
      if (entity.id == id)
      {
        return entity;
      }
    }
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
