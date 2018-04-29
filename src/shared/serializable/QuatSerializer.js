import { quat } from 'gl-matrix';
import Serializer from './Serializer.js';

class QuatSerializer extends Serializer
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = [];
    }

    quat.copy(dst[propertyName], propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    //Create if it does not exist...
    if (!dst.hasOwnProperty(propertyName) || dst[propertyName] === null)
    {
      dst[propertyName] = quat.create();
    }

    if (Serializer.INTERPOLATE && syncOpts.hasOwnProperty('blend'))
    {
      switch (syncOpts.blend.mode)
      {
        case 'interpolate':
          const nextPropertyName = syncOpts.blend.next;
          quat.copy(dst[syncOpts.blend.prev], dst[nextPropertyName]);
          propertyName = nextPropertyName;
          break;
        default:
          throw new Error("unknown blend mode to sync for property \'" + propertyName + "\'");
      }
    }

    quat.copy(dst[propertyName], propertyData);
  }

  interpolate(propertyName, syncOpts, delta, componentData)
  {
    const prevData = componentData[propertyName];
    const nextData = componentData[syncOpts.blend.next];
    componentData[propertyName][0] = MathHelper.lerp(prevData[0], nextData[0], delta);
    componentData[propertyName][1] = MathHelper.lerp(prevData[1], nextData[1], delta);
    componentData[propertyName][2] = MathHelper.lerp(prevData[2], nextData[2], delta);
    componentData[propertyName][3] = MathHelper.lerp(prevData[3], nextData[3], delta);
  }
}

export default QuatSerializer;
