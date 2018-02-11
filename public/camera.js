import { Transform } from './transform.js';
import { gl } from './mogli.js';

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

class Viewport
{
  constructor()
  {
    this.width = 1;
    this.height = 1;
  }

  applyView()
  {
    this.width = gl.canvas.clientWidth;
    this.height = gl.canvas.clientHeight;
    gl.viewport(0, 0, this.width, this.height);
  }

  static getPointFromScreen(dst, camera, viewport, screenX, screenY)
  {
    let invViewProj = getInvertedViewProjection(mat4.create(), camera);
    let x = screenX;
    let y = viewport.height - screenY;

    //TODO: The depth should be 0 if perspective...
    let near = unproject(vec3.create(), invViewProj, viewport, x, y, -1.0);
    let far = unproject(vec3.create(), invViewProj, viewport, x, y, 1.0);

    let f = (0 - near[2]) / (far[2] - near[2]);
    dst[0] = (near[0] + f * (far[0] - near[0]));
    dst[1] = (near[1] + f * (far[1] - near[1]));
    dst[2] = 0;
    return dst;
  }
}

function getInvertedViewProjection(dst, camera)
{
  mat4.mul(dst, camera.projection, camera.view);
  mat4.invert(dst, dst);
  return dst;
}

function unproject(dst, invertedViewProjection, viewport, screenX, screenY, screenZ)
{
  let normalizedDeviceCoords = vec4.create();
  normalizedDeviceCoords[0] = screenX / viewport.width * 2.0 - 1.0;
  normalizedDeviceCoords[1] = screenY / viewport.height * 2.0 - 1.0;
  normalizedDeviceCoords[2] = screenZ * 2.0 - 1.0;
  normalizedDeviceCoords[3] = 1.0;

  let objectCoords = vec4.transformMat4(normalizedDeviceCoords, normalizedDeviceCoords, invertedViewProjection);
  if (objectCoords[3] != 0) objectCoords[3] = 1.0 / objectCoords[3];
  dst[0] = objectCoords[0] * objectCoords[3];
  dst[1] = objectCoords[1] * objectCoords[3];
  dst[2] = objectCoords[2] * objectCoords[3];
  return dst;
}

export {
  PerspectiveCamera,
  OrthographicCamera,
  Viewport
}
