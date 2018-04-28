import Serializer from './Serializer.js';

class BooleanSerializer extends Serializer
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Boolean(propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Boolean(propertyData);
  }
}

export default BooleanSerializer;
