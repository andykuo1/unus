import Eventable from 'util/Eventable.js';

import RenderEngine from 'client/render/RenderEngine.js';

import LocalClient from 'client/LocalClient.js';

class ClientEngine
{
  constructor(app, canvas, socket)
  {
    this._app = app;
    this._canvas = canvas;
    this._socket = socket;

    this._render = new RenderEngine(app, canvas);

    this._client = new LocalClient(socket);
  }

  async initialize()
  {
    this._app.on('applicationStart', this.onApplicationStart.bind(this));
    this._app.on('applicationUpdate', this.onApplicationUpdate.bind(this));

    this._client.onConnect();
    this._socket.on('disconnect', () => {
      this._client.onDisconnect();
      this._app.stop();
    });

    await this._render.initialize();

    console.log("Game initialized!");
  }

  onApplicationStart()
  {
    console.log("Application started!");
  }

  onApplicationUpdate(delta)
  {

  }
}

Object.assign(ClientEngine.prototype, Eventable);

export default ClientEngine;
