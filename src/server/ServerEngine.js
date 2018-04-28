import Eventable from 'util/Eventable.js';
import NetworkClient from 'server/NetworkClient.js';

import World from 'server/world/World.js';

class ServerEngine
{
  constructor(app, socket)
  {
    this._app = app;
    this._socket = socket;
    this._clients = new Map();

    this._world = new World();
  }

  async initialize()
  {
    this._app.on('applicationStart', this.onApplicationStart.bind(this));
    this._app.on('applicationUpdate', this.onApplicationUpdate.bind(this));

    this._socket.on('connection', socket => {
      //TODO: Validate client before continuing...
      const client = new NetworkClient(socket);
      this._clients.set(socket.id, client);
      client.onConnect();
      this._world.onClientConnect(client);

      socket.on('disconnect', () => {
        this._world.onClientDisconnect(client);
        client.onDisconnect();
        this._clients.delete(socket.id);
      });
    });

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

  getClientByID(clientID)
  {
    return this._clients.get(clientID);
  }
}

Object.assign(ServerEngine.prototype, Eventable);

export default ServerEngine;
