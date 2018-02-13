import Game from '../integrated/Game.js';
import GameState from '../integrated/GameState.js';
import Player from '../integrated/Player.js';

import Renderer from './Renderer.js';
import Mouse from './Mouse.js';

class ClientGame extends Game
{
  constructor(socket, canvas)
  {
    super();

    this.socket = socket;
    this.canvas = canvas;

    this.input = new Mouse(document);
    this.renderer = new Renderer(canvas);

    this.thePlayer = new Player();
    //TODO: figure out a way to only apply changes and to only certain attribs.
    //this.thePlayer.remote = false;

    this.gameState = {};
  }

  load(callback)
  {
    console.log("Connecting client...");
    this.socket.emit('client-handshake');
  	this.socket.on('server-handshake', () => {
  		console.log("Connected to server...");

      //Add this EntityPlayer...
      this.gameState[this.socket.id] = this.thePlayer;

      callback();
  	});
    this.socket.on('server-update', (data) => {
      this.onServerUpdate(this.socket, data);
    });
    this.socket.on('server-extclient', (data) => {
      for(var i in data)
      {
        //Create EntityPlayer...
        this.gameState[data[i]] = new Player();
      }
    });
    this.socket.on('server-addclient', (data) => {
      //Create EntityPlayer...
      this.gameState[data] = new Player();
    })
    this.socket.on('server-delclient', (data) => {
        //Delete EntityPlayer...
        delete this.gameState[data];
    });
    this.socket.on('disconnect', () => {
      window.close();
    });
  }

  update(frame)
  {
    let input = this.input.poll();

    //Do Predictive GameLoop (based on current gameState)
    
    this.renderer.render(this.gameState);

    //Send GameState to Server
    //FIXME: Send only changed data...
    if (input.dx != 0.0 || input.dy != 0.0)
    {
      sendToServer('client-input', input, this.socket);
    }
  }

  onServerUpdate(socket, data)
  {
    this.gameState = data;
  }
}

function sendToServer(id, data, socket)
{
  socket.emit(id, data);
}

export default ClientGame;
