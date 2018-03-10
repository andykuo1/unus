import SynchronizedSystem from './SynchronizedSystem.js';
import Player from './PlayerComponent.js';

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
