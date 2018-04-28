import Eventable from 'util/Eventable.js';

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
      console.log("Connection established: " + socket.id);
      const socketID = socket.id;
      this._clients.set(socketID, socket);
      this.emit('clientConnect', socket);

      socket.on('disconnect', () => {
        console.log("Connection lost: " + socket.id);
        this._clients.delete(socketID);
        this.emit('clientDisconnect', socket);
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
}

Object.assign(ServerEngine.prototype, Eventable);

export default ServerEngine;
