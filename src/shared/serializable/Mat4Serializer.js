import { mat4 } from 'gl-matrix';
import Serializer from './Serializer.js';

class EntityReferenceSerializer extends Serializer
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    mat4.copy(dst[propertyName], propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = mat4.create();
    }

    mat4.copy(dst[propertyName], propertyData);
  }
}

export default EntityReferenceSerializer;
