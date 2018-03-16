import SynchronizedSystem from 'game/SynchronizedSystem.js';
import Motion from 'game/MotionComponent.js';

class MotionSystem extends SynchronizedSystem
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
}

export default MotionSystem;
