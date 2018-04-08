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

  onInputUpdate(entity, inputState)
  {
    if (!entity.hasComponent(Player)) return;
    entity.player.nextX = inputState.x;
    entity.player.nextY = inputState.y;
    entity.player.move = inputState.down;
    //HACK: this will run once on server and client-side, needs a way to keep predicted alive
    if (inputState.click)
    {
      const dx = entity.player.nextX - entity.transform.x;
      const dy = entity.player.nextY - entity.transform.y;
      const rot = -Math.atan2(-dy, dx);
      Application.events.emit('fireBullet', entity, rot);

      //FIXME: need to have a function to create predicted entity, and replace it later.
      //FIXME: this is because, this may be created multiple times, and should be the same.
      //FIXME: to keep track of the predicted entity, Valve fingerprints the code that is called.
      //FIXME: https://developer.valvesoftware.com/wiki/Prediction#Predicting_entity_creation

      //TODO: What you could do is make 2 different update loops: one for update once, and the other for predictions
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
