class Serializer
{
  constructor()
  {

  }

  serializeData(propertyName, propertyData, syncData, dst)
  {
    const propertyType = syncData.type;
    if (propertyType === 'array')
    {
      const elements = dst[propertyName] = [];
      const length = propertyData.length;
      for(let i = 0; i < length; ++i)
      {
        elements.push(0);
        writeProperty(i, propertyData[i], syncData.elements, elements);
      }
    }
    else if (propertyType === 'integer')
    {
      dst[propertyName] = Math.trunc(Number(propertyData)) ;
    }
    else if (propertyType === 'float')
    {
      dst[propertyName] = Number(propertyData);
    }
    else if (propertyType === 'boolean')
    {
      dst[propertyName] = Boolean(propertyData);
    }
    else if (propertyType === 'string')
    {
      dst[propertyName] = String(propertyData);
    }
    else if (propertyType === 'entity')
    {
      if (typeof propertyData === 'string')
      {
        dst[propertyName] = String(propertyData);
      }
      else if (propertyData instanceof Entity)
      {
        dst[propertyName] = propertyData.id;
      }
      else
      {
        throw new Error("unknown entity type \'" + propertyData + "\'");
      }
    }
    else
    {
      throw new Error("unknown data type \'" + propertyType + "\'");
    }

    return dst;
  }
}

export default Serializer;
