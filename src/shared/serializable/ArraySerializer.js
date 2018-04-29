import Serializer from './Serializer.js';

class ArraySerializer extends Serializer
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    const elements = dst[propertyName];
    const length = propertyData.length;
    for(let i = 0; i < length; ++i)
    {
      elements.push(0);
      serializer.encodeProperty(i, propertyData[i], syncOpts.elements, elements);
    }
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    const elements = dst[propertyName];
    const length = propertyData.length;
    for(let i = 0; i < length; ++i)
    {
      elements.push(0);
      serializer.decodeProperty(i, propertyData[i], syncOpts.elements, elements);
    }
  }
}

export default ArraySerializer;
