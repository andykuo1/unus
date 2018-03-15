import SynchronizedSystem from './SynchronizedSystem.js';
import Player from './PlayerComponent.js';
import Transform from './TransformComponent.js';
import Renderable from './RenderableComponent.js';
import Bullet from './BulletComponent.js';

import GameFactory from './GameFactory.js';

class PlayerSystem extends SynchronizedSystem
{
  constructor()
  {
    super(Player);
  }

  onInputUpdate(entity, inputState)
  {
    if (!entity.hasComponent(Player)) return;
    entity.player.nextX = inputState.x;
    entity.player.nextY = inputState.y;
    entity.player.move = inputState.down;
    //HACK: this will run once on server and client-side, needs a way to keep predicted alive
    if (inputState.click && !inputState.predictive)
    {
      const bulletSpeed = 10;
      const bulletEntity = GameFactory.createEntity('bullet');
      const dx = entity.player.nextX - entity.transform.x;
      const dy = entity.player.nextY - entity.transform.y;
      const rot = -Math.atan2(-dy, dx);
      bulletEntity.transform.x = entity.transform.x;
      bulletEntity.transform.y = entity.transform.y;
      bulletEntity.renderable.color = 0xFF00FF;
      bulletEntity.bullet.owner = entity._id;
      bulletEntity.bullet.speedx = Math.cos(rot) * bulletSpeed;
      bulletEntity.bullet.speedy = Math.sin(rot) * bulletSpeed;

      //FIXME: need to have a function to create predicted entity, and replace it later.
      //FIXME: this is because, this may be created multiple times, and should be the same.
      //FIXME: to keep track of the predicted entity, Valve fingerprints the code that is called.
      //FIXME: https://developer.valvesoftware.com/wiki/Prediction#Predicting_entity_creation

      //TODO: What you could do is make 2 different update loops: one for update once, and the other for predictions
    }
  }

  onEntityUpdate(entity, frame)
  {
    if (entity.player.move)
    {
      const dx = entity.player.nextX - entity.transform.x;
      const dy = entity.player.nextY - entity.transform.y;
      const rot = -Math.atan2(-dy, dx);

      const speed = 15.0;
      entity.motion.motionX += Math.cos(rot) * speed * frame.delta;
      entity.motion.motionY += Math.sin(rot) * speed * frame.delta;
    }
  }

  writeEntityToData(entity, dst)
  {
    dst.player.nextX = entity.player.nextX;
    dst.player.nextY = entity.player.nextY;
    dst.player.move = entity.player.move;
  }

  readEntityFromData(src, entity)
  {
    entity.player.nextX = src.player.nextX;
    entity.player.nextY = src.player.nextY;
    entity.player.move = src.player.move;
  }
}

export default PlayerSystem;
