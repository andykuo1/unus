import Eventable from 'util/Eventable.js';
import NetworkClient from 'server/NetworkClient.js';

class ServerEngine
{
  constructor(app, socket)
  {
    this._socket = socket;

    this._clients = new Map();

    app.on('applicationStart', this.onApplicationStart.bind(this));
    app.on('applicationUpdate', this.onApplicationUpdate.bind(this));
  }

  async initialize()
  {
    this._socket.on('connection', socket => {
      //TODO: Validate client before continuing...
      const client = new NetworkClient(socket);
      this._clients.set(socket.id, client);
      client.onConnect();

      socket.on('disconnect', () => {
        client.onDisconnect();
        this._clients.delete(socket.id);
      });
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

  getClientByID(clientID)
  {
    return this._clients.get(clientID);
  }
}

Object.assign(ServerEngine.prototype, Eventable);

export default ServerEngine;
