import { vec3 } from 'gl-matrix';
import Serializer from './Serializer.js';
import * as MathHelper from 'util/MathHelper.js';

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

    if (Serializer.INTERPOLATE && syncOpts.hasOwnProperty('blend'))
    {
      switch (syncOpts.blend.mode)
      {
        case 'interpolate':
          const nextPropertyName = syncOpts.blend.next;
          vec3.copy(dst[syncOpts.blend.prev], dst[nextPropertyName]);
          vec3.copy(dst[propertyName], dst[nextPropertyName]);
          propertyName = nextPropertyName;
          break;
        default:
          throw new Error("unknown blend mode to sync for property \'" + propertyName + "\'");
      }
    }

    vec3.copy(dst[propertyName], propertyData);
  }

  interpolate(propertyName, syncOpts, delta, componentData)
  {

    const prevData = componentData[syncOpts.blend.prev];
    const nextData = componentData[syncOpts.blend.next];
    componentData[propertyName][0] = MathHelper.lerp(prevData[0], nextData[0], delta);
    componentData[propertyName][1] = MathHelper.lerp(prevData[1], nextData[1], delta);
    componentData[propertyName][2] = MathHelper.lerp(prevData[2], nextData[2], delta);

    //HACK: this is to make sure the property does not reset when delta resets...
    if (delta >= 1)
    {
      prevData[0] = nextData[0];
      prevData[1] = nextData[1];
      prevData[2] = nextData[2];
    }
  }
}

export default Vec3Serializer;
