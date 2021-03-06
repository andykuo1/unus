import EventHandler from 'util/EventHandler.js';

class NetworkHandler
{
  constructor(socket, remote=true)
  {
    this.events = new EventHandler();
    this.socket = socket;
    this.remote = remote;

    if (!this.remote)
    {
      //Server-side init
      this.clients = new Map();
    }
    else
    {
      //Client-side init
      this.socketID = -1;
    }
  }

  async initClient()
  {
    if (!this.remote) throw new Error("Initializing wrong network side");

    this.socket.on('disconnect', () => {
      console.log("Disconnected from server...");
      this.socketID = -1;
      this.events.emit('serverDisconnect', this.socket);

      window.close();
    });

    return new Promise((resolve, reject) => {
      this.socket.emit('client-handshake');
      this.socket.on('server-handshake', (data) => {
        console.log("Connected to server...");
        this.socketID = data.socketID;
        this.events.emit('serverConnect', this.socket, data);

        //Start game...
        resolve();
      });
    });
  }

  async initServer()
  {
    if (this.remote) throw new Error("Initializing wrong network side");

    this.socket.on('connection', (socket) => {
      socket.on('client-handshake', () => {
        console.log("Added client: " + socket.id);
        this.clients.set(socket.id, socket);
        const data = { socketID: socket.id };
        this.events.emit('clientConnect', socket, data);

        socket.emit('server-handshake', data);

        socket.on('disconnect', () => {
          this.events.emit('clientDisconnect', socket);
          console.log("Removed client: " + socket.id);
          this.clients.delete(socket.id);
        });
      });
    });
  }

  sendTo(id, data, dst)
  {
    dst.emit(id, data);
  }

  sendToServer(id, data)
  {
    if (!this.remote) throw new Error("Unable to send packet to self");

    this.sendTo(id, data, this.socket);
  }

  sendToAll(id, data)
  {
    if (this.remote) throw new Error("Unable to send packet to all from client");

    this.clients.forEach((client, key) => {
      this.sendTo(id, data, client);
    });
  }
}

export default NetworkHandler;
