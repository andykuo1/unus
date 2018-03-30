import { vec3, quat } from 'gl-matrix';

class Transform
{
  constructor()
  {
    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.create();
  }

  reset()
  {
    this.position[0] = 0;
    this.position[1] = 0;
    this.position[2] = 0;
    this.rotation[0] = 0;
    this.rotation[1] = 0;
    this.rotation[2] = 0;
    this.rotation[3] = 0;
    this.scale[0] = 0;
    this.scale[1] = 0;
    this.scale[2] = 0;
  }

  get x() { return this.position[0]; }

  get y() { return this.position[1]; }

  set x(rhs) { this.position[0] = rhs; }

  set y(rhs) { this.position[1] = rhs; }
}

export default Transfom;
