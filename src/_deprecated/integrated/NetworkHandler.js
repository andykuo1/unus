import EventHandler from 'util/EventHandler.js';

class NetworkHandler
{
  constructor(socket, remote=true)
  {
    this.events = new EventHandler();
    this.socket = socket;
    this.remote = remote;

    //Server-side
    this.clients = new Map();
    //Client-side
    this.localSocketID = -1;
  }

  async initClient()
  {
    if (!this.remote) throw new Error("Initializing wrong network side");

    this.events.emit('serverConnect', this.socket);

    this.socket.on('disconnect', () => {
      console.log("Disconnected from server...");
      this.localSocketID = -1;
      this.events.emit('serverDisconnect', this.socket);
      window.close();
    });

    await this.handshake();
  }

  async initServer()
  {
    if (this.remote) throw new Error("Initializing wrong network side");

    this.socket.on('connection', socket => {
      console.log("Connection established: " + socket.id);
      const socketID = socket.id;
      this.clients.set(socketID, socket);
      this.events.emit('clientConnect', socket);

      socket.on('clientHandshake', () => {
        console.log("Handshaking with " + socket.id + "...");
        const data = {};
        data.socketID = socketID;
        //To build the data packet before sending...
        this.events.emit('handshakeResponse', socket, data);
        socket.emit('serverHandshake', data);
      });

      socket.on('disconnect', () => {
        console.log("Connection lost: " + socket.id);
        this.clients.delete(socketID);
        this.events.emit('clientDisconnect', socket);
      });
    });
  }

  async handshake()
  {
    return new Promise((resolve, reject) => {
      this.socket.emit('clientHandshake');
      this.socket.on('serverHandshake', data => {
        this.localSocketID = data.socketID;
        this.events.emit('handshakeResult', this.socket, data);
        resolve();
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
