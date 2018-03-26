import { quat } from 'gl-matrix';

import SynchronizedSystem from 'game/SynchronizedSystem.js';
import Rotating from 'game/RotatingComponent.js';

class RotatingSystem extends SynchronizedSystem
{
  constructor()
  {
    super(Rotating);
  }

  onEntityUpdate(entity, delta)
  {
    quat.rotateZ(entity.transform.rotation, entity.transform.rotation, entity.rotating.speed * delta);
  }
}

export default RotatingSystem;
