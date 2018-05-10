import { Motion } from 'shared/entity/component/Components.js';

class MotionSystem
{
  update(entityManager, delta)
  {
    let entities = entityManager.getEntitiesByComponent(Motion);
    for(const entity of entities)
    {
      this.updateEntity(entity, delta);
    }
  }

  updateEntity(entity, delta)
  {
    const fricRatio = 1.0 / (1.0 + (delta * entity.Motion.friction));
    entity.Motion.motionX *= fricRatio;
    entity.Motion.motionY *= fricRatio;
    entity.Transform.position[0] += entity.Motion.motionX * delta;
    entity.Transform.position[1] += entity.Motion.motionY * delta;
  }
}

export default MotionSystem;
