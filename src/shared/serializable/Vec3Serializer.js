import { vec3 } from 'gl-matrix';
import Serializer from './Serializer.js';

class Vec3Serializer extends Serializer
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    vec3.copy(dst[propertyName], propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = vec3.create();
    }

    vec3.copy(dst[propertyName], propertyData);
  }
}

export default Vec3Serializer;
