import Bullet from 'game/BulletComponent.js';

import Application from 'Application.js';

class BulletSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    Application.events.on('update', this.onUpdate.bind(this));
  }

  onUpdate(delta)
  {
    const entities = this.entityManager.getEntitiesByComponent(Bullet);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, delta);
    }
  }

  onEntityUpdate(entity, delta)
  {
    //TODO: this would be a problem when calculating collision...
    entity.life -= delta;
    if (entity.life < 0)
    {
      entity.destroy();
    }
    else
    {
      entity.transform.x += entity.bullet.speedx * delta;
      entity.transform.y += entity.bullet.speedy * delta;
    }
  }
}

export default BulletSystem;
