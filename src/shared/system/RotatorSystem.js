import { Rotator } from 'shared/entity/component/Components.js';
import { quat } from 'gl-matrix';

class RotatorSystem
{
  update(entityManager, delta)
  {
    let entities = entityManager.getEntitiesByComponent(Rotator);
    for(const entity of entities)
    {
      this.updateEntity(entity, delta);
    }
  }

  updateEntity(entity, delta)
  {
    quat.rotateZ(entity.Transform.rotation, entity.Transform.rotation, entity.Rotator.speed);
  }
}

export default RotatorSystem;
