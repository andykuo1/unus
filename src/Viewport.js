import { gl } from './lib/mogli.js';

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

export default Viewport;
