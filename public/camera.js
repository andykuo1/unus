class Camera
{
  constructor()
  {
    this.transform = new Transform();

    this.view = mat4.create();
    this.orientation = mat4.create();
    this.projection = mat4.create();
  }

  getView()
  {
    mat4.fromRotationTranslationScale(this.view, this.transform.rotation,
      vec3.negate(vec3.create(), this.transform.position), this.transform.scale);
    return this.view;
  }

  getOrientation()
  {
    mat4.fromQuat(this.orientation, this.transform.rotation);
    return this.orientation;
  }

  getProjection()
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

  getProjection()
  {
    //TODO: maybe cache this?
    /*
    let width = this.right - this.left;
    let height = this.bottom - this.top;
    let a = width / height;
    let v = gl.canvas.clientWidth / gl.canvas.clientHeight;
    if (v >= a)
    {
      mat4.ortho(this.projection,
        -(v / a) * width / 2.0, (v / a) * width / 2.0,
        -height / 2.0, height / 2.0,
        this.near, this.far);
    }
    else
    {
      mat4.ortho(this.projection,
        -width / 2.0, width / 2.0,
        -(a / v) * height / 2.0, (a / v) * height / 2.0,
        this.near, this.far);
    }
    */
    mat4.ortho(this.projection, this.left, this.right, this.top, this.bottom, this.near, this.far);
    return this.projection;
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

  getProjection()
  {
    //TODO: maybe cache this?
    let v = gl.canvas.clientWidth / gl.canvas.clientHeight;
    mat4.perspective(this.projection, this.fieldOfView, v, this.clippingNear, this.clippingFar);
    return this.projection;
  }
}

class Viewport
{
  constructor(x = 0, y = 0, width = 1, height = 1)
  {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  applyView()
  {
    gl.viewport(this.x, this.y, this.width, this.height);
  }
}

function getPointFromScreen(dst, camera, viewport, screenX, screenY)
{
  let invViewProj = getInvertedViewProjection(mat4.create(), camera);
  let x = screenX;
  let y = viewport.height - screenY;

  let near = unproject(vec3.create(), invViewProj, viewport, x, y, 0.0);
  let far = unproject(vec3.create(), invViewProj, viewport, x, y, 1.0);

  let f = (0 - near.z) / (far.z - near.z);
  dst.x = (near.x + f * (far.x - near.x));
  dst.y = (near.y + f * (far.y - near.y));
  dst.z = 0;
  return dst;
}

function getInvertedViewProjection(dst, camera)
{
  mat4.mul(dst, camera.getProjection(), camera.getView());
  mat4.invert(dst, dst);
  return dst;
}

function unproject(dst, invertedViewProjection, viewport, screenX, screenY, z)
{
  let normalizedDeviceCoords = vec4.create();
  normalizedDeviceCoords.x = (screenX - viewport.x) / viewport.width * 2.0 - 1.0;
  normalizedDeviceCoords.y = (screenY - viewport.y) / viewport.height * 2.0 - 1.0;
  normalizedDeviceCoords.z = 2.0 * z - 1.0;
  normalizedDeviceCoords.w = 1.0;

  let objectCoords = vec4.transformMat4(normalizedDeviceCoords, normalizedDeviceCoords, invertedViewProjection);
  if (objectCoords.w != 0) objectCoords.w = 1.0 / objectCoords.w;
  dst.x = objectCoords.x * objectCoords.w;
  dst.y = objectCoords.y * objectCoords.w;
  dst.z = objectCoords.z * objectCoords.w;
  return dst;
}
