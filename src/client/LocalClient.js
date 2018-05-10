import Application from 'Application.js';
import { vec3 } from 'gl-matrix';

import Mouse from 'client/input/Mouse.js';
import ViewPort from 'client/render/camera/ViewPort.js';

const CAMERA_FOLLOW = true;
const CAMERA_DAMPING_FACTOR = 0.06;

class LocalClient
{
  constructor(socket, canvas, world)
  {
    this._world = world;
    this._socket = socket;
    this._player = null;

    this._input = new Mouse(canvas, document);

    this.targetX = 0;
    this.targetY = 0;
    this.move = false;

    this._input.on('mousedown', this.onMouseDown.bind(this));
    this._input.on('mouseup', this.onMouseUp.bind(this));
  }

  onPlayerCreate(entityPlayer)
  {
    console.log("Creating player...");

    this._player = entityPlayer;
  }

  onPlayerDestroy()
  {
    console.log("Destroying player...");

    this._player = null;
  }

  onConnect()
  {
    console.log("Connecting client: " + this._socket.id);
  }

  onDisconnect()
  {
    console.log("Disconnecting client: " + this._socket.id);
  }

  onUpdate(delta)
  {
    //Smoothly follow the player
    if (CAMERA_FOLLOW && this._player)
    {
      const playerTransform = this._player.Transform;
      //TODO: Get camera some other way...
      const cameraTransform = Application.client._render._renderer.camera.transform;
      const dx = playerTransform.position[0] - cameraTransform.position[0];
      const dy = playerTransform.position[1] - cameraTransform.position[1];
      cameraTransform.position[0] += dx * CAMERA_DAMPING_FACTOR;
      cameraTransform.position[1] += dy * CAMERA_DAMPING_FACTOR;
    }

    const vec = ViewPort.getPointFromScreen(vec3.create(),
      Application.client._render._renderer.camera,
      Application.client._render._renderer.viewport,
      this._input.x, this._input.y);

    this.targetX = vec[0];
    this.targetY = vec[1];
  }

  onMouseDown(mouse, button)
  {
    this.move = true;
  }

  onMouseUp(mouse, button)
  {
    const dx = this.targetX - this._player.Transform.position[0];
    const dy = this.targetY - this._player.Transform.position[1];
    const angle = Math.atan2(dy, dx);
    Application.network.sendTo(this._socket, 'fireBullet', angle);

    this.move = false;
  }

  get player()
  {
    return this._player;
  }
}

export default LocalClient;
