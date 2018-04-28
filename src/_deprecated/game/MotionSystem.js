import Motion from 'game/MotionComponent.js';

import Application from 'Application.js';

class MotionSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    Application.events.on('update', this.onUpdate.bind(this));
  }

  onUpdate(delta)
  {
    const entities = this.entityManager.getEntitiesByComponent(Motion);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, delta);
    }
  }

  onEntityUpdate(entity, delta)
  {
    const fricRatio = 1.0 / (1.0 + (delta * entity.motion.friction));
    entity.motion.motionX *= fricRatio;
    entity.motion.motionY *= fricRatio;
    entity.transform.x += entity.motion.motionX * delta;
    entity.transform.y += entity.motion.motionY * delta;
  }
}

export default MotionSystem;
