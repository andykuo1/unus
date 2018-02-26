import Game from '../integrated/Game.js';
import Player from '../integrated/Player.js';
import PacketHandler from '../integrated/packet/PacketHandler.js';

import Mouse from './input/Mouse.js';
import Renderer from './Renderer.js';

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
      //Start game...
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
    input.timestamp = frame.then;

    //Predict state...
    //Simulating changes in state...
    this.gameState[this.socket.id].x += input.dx;
    this.gameState[this.socket.id].y += input.dy;

    //Render state...
    this.renderer.render(this.gameState);

    if (input.dx != 0 || input.dy != 0)
    {
      //Force 200ms lag...
      setTimeout(() => PacketHandler.sendToServer('client-input', input, this.socket), 200);
    }
  }

  onServerUpdate(socket, data)
  {
    //Update state to authoritative state...
    this.gameState = data;
  }
}

export default ClientGame;
