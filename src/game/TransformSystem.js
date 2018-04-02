import SynchronizedSystem from 'game/SynchronizedSystem.js';
import Transform from 'game/TransformComponent.js';

class TransformSystem extends SynchronizedSystem
{
  constructor(entityManager)
  {
    super(entityManager, Transform);
  }
}

export default TransformSystem;
