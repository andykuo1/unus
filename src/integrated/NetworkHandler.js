class NetworkHandler
{
  constructor(socket, remote=true)
  {
    this.socket = socket;
    this.remote = remote;

    if (!this.remote)
    {
      //Server-side init
      this.clients = new Map();
      this.onClientConnect = (client, data) => {};
      this.onClientDisconnect = (client) => {};
    }
    else
    {
      //Client-side init
      this.socketID = -1;
      this.onServerConnect = (server, data) => {};
      this.onServerDisconnect = (server) => {};
    }
  }

  initClient(callback)
  {
    if (!this.remote) throw new Error("Initializing wrong network side");

    this.socket.emit('client-handshake');

    this.socket.on('server-handshake', (data) => {
      console.log("Connected to server...");
      this.socketID = data.socketID;
      this.onServerConnect(this.socket, data);

      //Start game...
      callback();
    });

    this.socket.on('disconnect', () => {
      console.log("Disconnected from server...");
      this.socketID = -1;
      this.onServerDisconnect(this.socket);

      window.close();
    });
  }

  initServer(callback)
  {
    if (this.remote) throw new Error("Initializing wrong network side");

    this.socket.on('connection', (socket) => {
      socket.on('client-handshake', () => {
        console.log("Added client: " + socket.id);
        this.clients.set(socket.id, socket);
        const data = { socketID: socket.id };
        this.onClientConnect(socket, data);

        socket.emit('server-handshake', data);

        socket.on('disconnect', () => {
          this.onClientDisconnect(socket);
          console.log("Removed client: " + socket.id);
          this.clients.delete(socket.id);
        });
      });
    });

    callback();
  }

  sendToServer(id, data)
  {
    if (!this.remote) throw new Error("Unable to send packet to self");

    this.socket.emit(id, data);
  }

  sendTo(id, data, dst)
  {
    dst.emit(id, data);
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
