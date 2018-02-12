import Game from '../integrated/Game.js';
import GameState from '../integrated/GameState.js';

import Mouse from './Mouse.js';

class ClientGame extends Game
{
  constructor(socket, canvas)
  {
    super();

    this.socket = socket;
    this.canvas = canvas;

    this.input = new Mouse(document);

    this.gameState = new GameState();
    this.nextState = new GameState();
  }

  load(callback)
  {
    console.log("Connecting client...");
    this.socket.emit('client-handshake');
  	this.socket.on('server-handshake', () => {
  		console.log("Connected to server...");
      callback();
  	});
    this.socket.on('server-update', (data) => {
      this.onServerUpdate(this.socket, data);
    });
    this.socket.on('disconnect', () => {
      window.close();
    });
  }

  update(frame)
  {
    //Poll nextState from Server
    //---

    //Update from nextState
    //---

    //Poll gameState from Input
    //---

    //Do Predictive GameLoop (based on current gameState)
    //---

    //RENDER!

    //Send GameState to Server
    sendToServer('client-update', this.input, this.socket);
  }

  onServerUpdate(socket, data)
  {
    console.log("SERVER: " + data);
  }
}

function sendToServer(id, data, socket)
{
  socket.emit(id, data);
}

export default ClientGame;
