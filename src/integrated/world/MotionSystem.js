import SimpleSystem from './SimpleSystem.js';
import Motion from './MotionComponent.js';

class MotionSystem extends SimpleSystem
{
  constructor()
  {
    super(Motion);
  }

  onEntityUpdate(entity, frame)
  {
    const fricRatio = 1.0 / (1.0 + (frame.delta * entity.motion.friction));
    entity.motion.motionX *= fricRatio;
    entity.motion.motionY *= fricRatio;
    entity.transform.x += entity.motion.motionX * frame.delta;
    entity.transform.y += entity.motion.motionY * frame.delta;
  }

  writeEntityToData(entity, dst)
  {
    dst.motion.motionX = entity.motion.motionX;
    dst.motion.motionY = entity.motion.motionY;
    dst.motion.friction = entity.motion.friction;
  }

  readEntityFromData(src, entity)
  {
    entity.motion.motionX = src.motion.motionX;
    entity.motion.motionY = src.motion.motionY;
    entity.motion.friction = src.motion.friction;
  }
}

export default MotionSystem;
