import Application from 'Application.js';
import Eventable from 'util/Eventable.js';

class ClientEngine
{
  constructor(app, canvas, socket)
  {
    this._canvas = canvas;
    this._socket = socket;

    this._clientID = -1;

    app.on('applicationStart', this.onApplicationStart.bind(this));
    app.on('applicationUpdate', this.onApplicationUpdate.bind(this));
  }

  async initialize()
  {
    this.emit('serverConnect', this._socket);

    this._socket.on('disconnect', () => {
      console.log("Disconnected from server...");
      this._clientID = -1;
      this.emit('serverDisconnect', this._socket);
      Application.stop();
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
