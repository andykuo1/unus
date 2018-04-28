import { vec3, quat } from 'gl-matrix';

function Transform()
{
  this.position = vec3.create();
  this.rotation = quat.create();
  this.scale = vec3.fromValues(1, 1, 1);
}

Transform.sync = {
  position: { type: 'vec3' },
  rotation: { type: 'quat' },
  scale: { type: 'vec3' }
};

export default Transform;
