import { DecayOverTime } from 'shared/entity/component/Components.js';
import { quat } from 'gl-matrix';

class DecayOverTimeSystem
{
  constructor()
  {
    this.worldTicks = 0;
  }

  update(entityManager, delta)
  {
    this.worldTicks += delta;
    while (this.worldTicks >= 1)
    {
      let entities = entityManager.getEntitiesByComponent(DecayOverTime);
      let i = entities.length;
      while(i--)
      {
        this.updateEntity(entities[i], delta);
      }

      --this.worldTicks;
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
