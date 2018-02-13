import Game from '../integrated/Game.js';
import GameState from '../integrated/GameState.js';
import Player from '../integrated/Player.js';

class ServerGame extends Game
{
  constructor(io)
  {
    super();

    this.io = io;

    this.clients = new Map();
    this.inputs = [];

    this.gameState = {};
  }

  load(callback)
  {
    this.io.on('connection', (socket) => {
      socket.on('client-handshake', () => {
        this.addClient(socket);
        socket.emit('server-handshake');
      });
      socket.on('client-input', (data) => {
        this.onClientInput(socket, data);
      });
      socket.on('disconnect', () => {
        this.removeClient(socket);
      });
    });

    callback();
  }

  update(frame)
  {
    //Poll clients to GameState
    while(this.inputs.length > 0)
    {
      let input = this.inputs.pop();
      //TODO: Do something with this input...

      console.log(input);
      let entity = this.gameState[input.id];
      entity.x = input.x;
      entity.y = input.y;
    }

    //Calculate from client states, and output to server state

    //Do GameLoop to update GameState
    //---

    //Send GameState to clients
    //FIXME: Send only changed data...
    sendToAll('server-update', this.gameState, this.clients);
  }

  onClientInput(socket, data)
  {
    data.id = socket.id;
    this.inputs.push(data);
  }

  addClient(socket)
  {
    sendToAll('server-addclient', socket.id, this.clients);
    sendToClient('server-extclient', Object.keys(this.clients), socket);

    console.log("Added client: " + socket.id);
    this.clients.set(socket.id, socket);

    //Create EntityPlayer here...
    this.gameState[socket.id] = new Player();
  }

  removeClient(socket)
  {
    sendToAll('server-delclient', socket.id, this.clients);

    console.log("Removed client: " + socket.id);
    this.clients.delete(socket.id);

    //Delete EntityPlayer here...
    delete this.gameState[socket.id];
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
