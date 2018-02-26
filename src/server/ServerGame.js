import Game from '../integrated/Game.js';
import Player from '../integrated/Player.js';
import PacketHandler from '../integrated/packet/PacketHandler.js';

import PriorityQueue from '../util/PriorityQueue.js';

import Console from './console/Console.js';

class ServerGame extends Game
{
  constructor(io)
  {
    super();

    this.io = io;

    this.clients = new Map();
    this.inputs = new PriorityQueue((a, b) => {
      return (a.timestamp || 0) - (b.timestamp || 0);
    });

    this.gameState = {};
  }

  load(callback)
  {
    console.log("Loading server...");

    //Setup console...
    Console.addCommand("stop", "stop", (args) => {
      console.log("Stopping server...");
      //TODO: ADD state-preservation features...
      console.log("Server stopped.");
      process.exit(0);
    });

    callback();
  }

  connect(callback)
  {
    console.log("Connecting server...");

    //Setup server..
    this.io.on('connection', (socket) => {
      socket.on('client-handshake', () => {
        this.addClient(socket);
        socket.emit('server-handshake');
        socket.on('client-input', (data) => {
          this.onClientInput(socket, data);
        });
        socket.on('disconnect', () => {
          this.removeClient(socket);
        });
      });
    });

    callback();
  }

  update(frame)
  {
    //Poll clients to GameState
    while(this.inputs.length > 0)
    {
      let input = this.inputs.dequeue();

      //TODO: Apply input to game state...

      //Game Logic...
      let entity = this.gameState[input.id];
      entity.x = input.x;
      entity.y = input.y;
    }

    //Send final game state to all
    PacketHandler.sendToAll('server-update', this.gameState, this.clients);
  }

  onClientInput(socket, data)
  {
    data.id = socket.id;
    this.inputs.queue(data);
  }

  addClient(socket)
  {
    PacketHandler.sendToAll('server-addclient', socket.id, this.clients);
    PacketHandler.sendToClient('server-extclient', this.clients.keys(), socket);

    console.log("Added client: " + socket.id);
    this.clients.set(socket.id, socket);

    //Create EntityPlayer here...
    this.gameState[socket.id] = new Player();
  }

  removeClient(socket)
  {
    PacketHandler.sendToAll('server-delclient', socket.id, this.clients);

    console.log("Removed client: " + socket.id);
    this.clients.delete(socket.id);

    //Delete EntityPlayer here...
    delete this.gameState[socket.id];
  }
}

export default ServerGame;
