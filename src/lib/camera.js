import { gl } from './mogli.js';

import Transform from '../Transform.js';

class Camera
{
  constructor()
  {
    this.transform = new Transform();

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

class OrthographicCamera extends Camera
{
  constructor(left = -10, right = 10, top = -10, bottom = 10, near = -10, far = 10)
  {
    super();
    //near plane must be > 0
    //far plane must be > near
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
  }

  get projection()
  {
    //TODO: maybe cache this?
    let width = this.right - this.left;
    let height = this.bottom - this.top;
    let a = width / height;
    let v = gl.canvas.clientWidth / gl.canvas.clientHeight;
    if (v >= a)
    {
      return mat4.ortho(this._projection,
        -(v / a) * width / 2.0, (v / a) * width / 2.0,
        -height / 2.0, height / 2.0,
        this.near, this.far);
    }
    else
    {
      return mat4.ortho(this._projection,
        -width / 2.0, width / 2.0,
        -(a / v) * height / 2.0, (a / v) * height / 2.0,
        this.near, this.far);
    }
  }
}

class PerspectiveCamera extends Camera
{
  constructor(fieldOfView = 70.0, clippingNear = 0.01, clippingFar = 100)
  {
    super();
    //near plane must be > 0
    //far plane must be > near
    //Field of view must be within 0 to 180 degrees
    this.fieldOfView = fieldOfView;
    this.clippingNear = clippingNear;
    this.clippingFar = clippingFar;
  }

  get projection()
  {
    //TODO: maybe cache this?
    let v = gl.canvas.clientWidth / gl.canvas.clientHeight;
    return mat4.perspective(this._projection, this.fieldOfView, v, this.clippingNear, this.clippingFar);
  }
}

export {
  Camera,
  OrthographicCamera,
  PerspectiveCamera
};
