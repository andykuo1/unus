import SynchronizedSystem from './SynchronizedSystem.js';
import Transform from './TransformComponent.js';

class TransformSystem extends SynchronizedSystem
{
  constructor()
  {
    super(Transform);
  }
}

export default TransformSystem;
