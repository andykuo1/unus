import SynchronizedSystem from 'game/SynchronizedSystem.js';
import Follow from 'game/FollowComponent.js';

class FollowSystem extends SynchronizedSystem
{
  constructor()
  {
    super(Follow);
  }

  onEntityUpdate(entity, delta)
  {
    if (entity.follow.target != null)
    {
      const targetEntity = entity.follow.target;
      const dx = targetEntity.transform.x - entity.transform.x;
      const dy = targetEntity.transform.y - entity.transform.y;
      const distSqu = dx * dx + dy * dy;
      if (distSqu > entity.follow.targetDistance * entity.follow.targetDistance)
      {
        const dist = Math.sqrt(distSqu);
        entity.motion.motionX += (dx / dist) * delta;
        entity.motion.motionY += (dy / dist) * delta;
      }
    }
  }
}

export default FollowSystem;
