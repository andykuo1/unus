import Game from '../integrated/Game.js';
import GameState from '../integrated/GameState.js';

class ServerGame extends Game
{
  constructor(io)
  {
    super();

    this.io = io;

    this.clients = new Map();
  }

  load(callback)
  {
    this.io.on('connection', (socket) => {
      socket.on('client-handshake', () => {
        this.addClient(socket);
        socket.emit('server-handshake');
      });
      socket.on('client-update', (data) => {
        this.onClientUpdate(socket, data);
      });
      socket.on('disconnect', () => {
        this.removeClient(socket);
      });
    });

    callback();
  }

  update(frame)
  {
    //Poll client states
    //---

    //Update game to nextState

    //Do GameLoop to update GameState
    //---

    //Send GameState to clients
    sendToAll('server-update', Date.now(), this.clients);
  }

  onClientUpdate(socket, data)
  {
    if (data.click)
    {
      console.log(socket.id + ": " + data);
    }
  }

  addClient(socket)
  {
    console.log("Added client: " + socket.id);
    this.clients.set(socket.id, socket);
  }

  removeClient(socket)
  {
    console.log("Removed client: " + socket.id);
    this.clients.delete(socket.id);
  }
}

function sendToClient(id, data, client)
{
  client.emit(id, data);
}

function sendToAll(id, data, clients)
{
  clients.forEach((value, key) => {
    sendToClient(id, data, value);
  });
}

export default ServerGame;
