import Serializer from './Serializer.js';

class IntegerSerializer extends Serializer
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Math.trunc(Number(propertyData));
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Math.trunc(Number(propertyData));
  }
}

export default IntegerSerializer;
