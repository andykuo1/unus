import SimpleSystem from './SimpleSystem.js';
import Transform from './TransformComponent.js';

class TransformSystem extends SimpleSystem
{
  constructor()
  {
    super(Transform);
  }

  onEntityUpdate(entity, frame)
  {
    //HACK: This is just what the renderer reads...
    entity.x = entity.transform.x;
    entity.y = entity.transform.y;
  }

  writeEntityToData(entity, dst)
  {
    dst.transform.x = entity.transform.x;
    dst.transform.y = entity.transform.y;
  }

  readEntityFromData(src, entity)
  {
    entity.transform.x = src.transform.x;
    entity.transform.y = src.transform.y;
  }
}

export default TransformSystem;
