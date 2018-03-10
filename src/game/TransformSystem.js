import SynchronizedSystem from './SynchronizedSystem.js';
import Transform from './TransformComponent.js';

class TransformSystem extends SynchronizedSystem
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
}

export default TransformSystem;
