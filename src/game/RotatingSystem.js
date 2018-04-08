import { quat } from 'gl-matrix';

import Rotating from 'game/RotatingComponent.js';

import Application from 'Application.js';

class RotatingSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    Application.events.on('update', this.onUpdate.bind(this));
  }

  onUpdate(delta)
  {
    const entities = this.entityManager.getEntitiesByComponent(Rotating);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, delta);
    }
  }

  onEntityUpdate(entity, delta)
  {
    quat.rotateZ(entity.transform.rotation, entity.transform.rotation, entity.rotating.speed * delta);
  }
}

export default RotatingSystem;
