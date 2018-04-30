import Application from 'Application.js';
import { vec3 } from 'gl-matrix';

import Mouse from 'client/input/Mouse.js';
import ViewPort from 'client/render/camera/ViewPort.js';

const CAMERA_FOLLOW = false;
const CAMERA_DAMPING_FACTOR = 0.1;

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
    this.fireBullet = false;
  }

  onPlayerCreate(entityPlayer)
  {
    console.log("Creating player...");

    this._player = entityPlayer;

    this._input.on('mousedown', this.onMouseDown.bind(this));
    this._input.on('mouseup', this.onMouseUp.bind(this));
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

    //Send client input...
    Application.network.sendTo(this._socket,
      'clientInput', {
        targetX: this.targetX,
        targetY: this.targetY,
        fireBullet: this.fireBullet
      });

    this.fireBullet = false;
  }

  onMouseDown(mouse, button)
  {
    const vec = ViewPort.getPointFromScreen(vec3.create(),
      Application.client._render._renderer.camera,
      Application.client._render._renderer.viewport,
      mouse.x, mouse.y);
    this.targetX = vec[0];
    this.targetY = vec[1];
  }

  onMouseUp(mouse, button)
  {
    this.fireBullet = true;
  }

  get player()
  {
    return this._player;
  }
}

export default LocalClient;
