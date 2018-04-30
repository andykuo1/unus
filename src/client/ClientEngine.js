import Eventable from 'util/Eventable.js';
import RenderEngine from 'client/render/RenderEngine.js';
import LocalClient from 'client/LocalClient.js';

import ClientWorld from 'client/world/ClientWorld.js';

class ClientEngine
{
  constructor(app, canvas, socket)
  {
    this._app = app;
    this._canvas = canvas;
    this._socket = socket;

    this._render = new RenderEngine(app, canvas);
    this._world = new ClientWorld();

    this._client = new LocalClient(socket, canvas, this._world);
  }

  async initialize()
  {
    this._app.on('applicationStart', this.onApplicationStart.bind(this));
    this._app.on('applicationUpdate', this.onApplicationUpdate.bind(this));

    this._client.onConnect();
    this._world.onClientConnect(this._client);

    this._socket.on('disconnect', () => {
      this._world.onClientDisconnect(this._client);
      this._client.onDisconnect();
      this._app.stop();
    });

    await this._render.initialize();
    await this._world.initialize();

    console.log("Game initialized!");
  }

  onApplicationStart()
  {
    console.log("Application started!");
  }

  onApplicationUpdate(delta)
  {
    this._world.onUpdate(delta);
  }
}

Object.assign(ClientEngine.prototype, Eventable);

export default ClientEngine;
