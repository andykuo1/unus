import SynchronizedSystem from 'game/SynchronizedSystem.js';
import Bullet from 'game/BulletComponent.js';

class BulletSystem extends SynchronizedSystem
{
  constructor(entityManager)
  {
    super(entityManager, Bullet);
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
