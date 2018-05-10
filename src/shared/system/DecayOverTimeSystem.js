import { DecayOverTime } from 'shared/entity/component/Components.js';
import { quat } from 'gl-matrix';

class DecayOverTimeSystem
{
  update(entityManager, delta)
  {
    let entities = entityManager.getEntitiesByComponent(DecayOverTime);
    let i = entities.length;
    while(i--)
    {
      this.updateEntity(entities[i], delta);
    }
  }

  updateEntity(entity, delta)
  {
    if (entity.DecayOverTime.age-- <= 0)
    {
      entity.destroy();
    }
  }
}

export default DecayOverTimeSystem;
