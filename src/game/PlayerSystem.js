import Player from 'game/PlayerComponent.js';
import Transform from 'game/TransformComponent.js';
import Renderable from 'game/RenderableComponent.js';
import Bullet from 'game/BulletComponent.js';

import Application from 'Application.js';
import GameFactory from 'game/GameFactory.js';

class PlayerSystem
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;

    Application.events.on('update', this.onUpdate.bind(this));
  }

  onUpdate(delta)
  {
    const entities = this.entityManager.getEntitiesByComponent(Player);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, delta);
    }
  }

  onEntityUpdate(entity, delta)
  {
    if (entity.player.move)
    {
      const dx = entity.player.nextX - entity.transform.x;
      const dy = entity.player.nextY - entity.transform.y;
      const rot = -Math.atan2(-dy, dx);

      const speed = 15.0;
      entity.motion.motionX += Math.cos(rot) * speed * delta;
      entity.motion.motionY += Math.sin(rot) * speed * delta;
    }
  }
}

export default PlayerSystem;
