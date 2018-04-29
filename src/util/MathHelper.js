import { vec3 } from 'gl-matrix';

export function lerp(a, b, dt)
{
  if (typeof a == 'number' && typeof b == 'number')
  {
    return a * (1 - dt) + b * dt;
  }
  else
  {
    throw new Error("unable to lerp object \'" + a + "\' and \'" + b + "\'");
  }
}

export function clamp(a, min, max)
{
  return Math.min(Math.max(value, min), max);
}

/*
Math.lerp = lerp;
Math.clamp = clamp;
*/
