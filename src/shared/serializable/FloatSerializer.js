import Serializer from './Serializer.js';
import * as MathHelper from 'util/MathHelper.js';

class FloatSerializer extends Serializer
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = Number(propertyData);
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    if (serializer.shouldInterpolate && syncOpts.hasOwnProperty('blend'))
    {
      if (serializer.isInitial) dst[propertyName] = propertyData;

      switch (syncOpts.blend.mode)
      {
        case 'interpolate':
          const nextPropertyName = syncOpts.blend.next;
          dst[syncOpts.blend.prev] = dst[nextPropertyName];
          propertyName = nextPropertyName;
          break;
        default:
          throw new Error("unknown blend mode to sync for property \'" + propertyName + "\'");
      }
    }

    dst[propertyName] = Number(propertyData);
  }

  interpolate(propertyName, syncOpts, delta, componentData)
  {
    const prevData = componentData[propertyName];
    const nextData = componentData[syncOpts.blend.next];
    componentData[propertyName] = MathHelper.lerp(prevData, nextData, delta);
  }
}

export default FloatSerializer;
