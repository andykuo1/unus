import Serializer from './Serializer.js';

class EntityReferenceSerializer extends Serializer
{
  constructor(entityManager)
  {
    super();
    this._entityManager = entityManager;
  }

  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    if (propertyData instanceof Entity)
    {
      dst[propertyName] = propertyData.id;
    }
    else
    {
      throw new Error("unknown entity type \'" + propertyData + "\' for encoding");
    }
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    let entity = this._entityManager.getEntityByID(propertyData);
    if (entity === null)
    {
      throw new Error("cannot find entity with id \'" + propertyData + "\'");
    }
    dst[propertyName] = entity;
  }
}

export default EntityReferenceSerializer;
