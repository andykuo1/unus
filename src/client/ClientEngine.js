import Eventable from 'util/Eventable.js';

import LocalClient from 'client/LocalClient.js';

class ClientEngine
{
  constructor(app, canvas, socket)
  {
    this._app = app;
    this._canvas = canvas;
    this._socket = socket;

    this._client = new LocalClient(this._socket);

    app.on('applicationStart', this.onApplicationStart.bind(this));
    app.on('applicationUpdate', this.onApplicationUpdate.bind(this));
  }

  async initialize()
  {
    this._client.onConnect();
    this._socket.on('disconnect', () => {
      this._client.onDisconnect();
      this._app.stop();
    });

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
