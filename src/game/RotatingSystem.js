import { quat } from 'gl-matrix';

import SynchronizedSystem from './SynchronizedSystem.js';
import Rotating from './RotatingComponent.js';

class RotatingSystem extends SynchronizedSystem
{
  constructor()
  {
    super(Rotating);
  }

  onEntityUpdate(entity, frame)
  {
    //quat.rotateX(entity.transform.rotation, entity.rotating.speed * frame.delta);
  }
}

export default RotatingSystem;
