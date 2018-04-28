import { mat4 } from 'gl-matrix';

import Camera from './Camera.js';

class PerspectiveCamera extends Camera
{
  constructor(viewport, fieldOfView = 70.0, clippingNear = 0.01, clippingFar = 100)
  {
    super(viewport);
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
    let v = this.viewport.width / this.viewport.height;
    return mat4.perspective(this._projection, this.fieldOfView, v, this.clippingNear, this.clippingFar);
  }
}

export default PerspectiveCamera;
