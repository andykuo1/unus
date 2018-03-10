import SynchronizedSystem from './SynchronizedSystem.js';
import Bullet from './BulletComponent.js';

class BulletSystem extends SynchronizedSystem
{
  constructor()
  {
    super(Bullet);
  }

  onEntityUpdate(entity, frame)
  {
    //TODO: this would be a problem when calculating collision...
    entity.life -= frame.delta;
    if (entity.life < 0)
    {
      entity.destroy();
    }
    else
    {
      entity.transform.x += entity.bullet.speedx * frame.delta;
      entity.transform.y += entity.bullet.speedy * frame.delta;
    }
  }
}

export default BulletSystem;
