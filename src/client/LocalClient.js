import Application from 'Application.js';
import { vec3 } from 'gl-matrix';

import Mouse from 'client/input/Mouse.js';
import ViewPort from 'client/render/camera/ViewPort.js';

class LocalClient
{
  constructor(socket, canvas)
  {
    this._socket = socket;
    this._player = null;

    this._input = new Mouse(canvas, document);

    this.nextX = 0;
    this.nextY = 0;
  }

  onPlayerCreate(entityPlayer)
  {
    console.log("Creating player...");

    this._player = entityPlayer;

    this._input.on('mousedown', this.onMouseDown.bind(this));
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
    if (this._player)
    {
      const dampingFactor = 0.3;
      const playerTransform = this._player.Transform;
      //TODO: Get camera some other way...
      const cameraTransform = Application.client._render._renderer.camera.transform;
      const dx = playerTransform.position[0] - cameraTransform.position[0];
      const dy = playerTransform.position[1] - cameraTransform.position[1];
      cameraTransform.position[0] += dx * dampingFactor;
      cameraTransform.position[1] += dy * dampingFactor;
    }
  }

  onMouseDown(mouse, button)
  {
    const vec = ViewPort.getPointFromScreen(vec3.create(),
      Application.client._render._renderer.camera,
      Application.client._render._renderer.viewport,
      mouse.x, mouse.y);
    this.nextX = vec[0];
    this.nextY = vec[1];
  }

  get player()
  {
    return this._player;
  }
}

export default LocalClient;
