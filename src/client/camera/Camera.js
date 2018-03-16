import { vec3, quat, mat4 } from 'gl-matrix';

class Camera
{
  constructor(viewport)
  {
    this.transform = {
      position: vec3.create(),
      rotation: quat.create(),
      scale: vec3.fromValues(1, 1, 1)
    };

    this.viewport = viewport;
    this._view = mat4.create();
    this._orientation = mat4.create();
    this._projection = mat4.create();
  }

  get view()
  {
    return mat4.fromRotationTranslationScale(this._view,
      this.transform.rotation,
      [-this.transform.position[0], -this.transform.position[1], -this.transform.position[2]],
      this.transform.scale);
  }

  get orientation()
  {
    return mat4.fromQuat(this._orientation, this.transform.rotation);
  }

  get projection()
  {
    throw new Error("undefined camera type - must be perspective or orthographic");
  }
}

export default Camera;
