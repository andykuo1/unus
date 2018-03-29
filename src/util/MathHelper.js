function lerp(a, b, dt)
{
  return a * (1 - dt) + b * dt;
}

function clamp(a, min, max)
{
  return Math.min(Math.max(value, min), max);
}

Math.lerp = lerp;
Math.clamp = clamp;
