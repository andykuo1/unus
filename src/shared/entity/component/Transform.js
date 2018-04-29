import { vec3, quat } from 'gl-matrix';

import Application from 'Application.js';

function Transform()
{
  this.position = vec3.create();
  this.rotation = quat.create();
  this.scale = vec3.fromValues(1, 1, 1);

  if (Application.isRemote())
  {
    this.nextPosition = vec3.create();
    this.prevPosition = vec3.create();
  }
}

Transform.sync = {
  position: { type: 'vec3' ,
    blend: { mode: 'interpolate',
      next: 'nextPosition',
      prev: 'prevPosition'
    }},
  rotation: { type: 'quat' },
  scale: { type: 'vec3' }
};

export default Transform;
