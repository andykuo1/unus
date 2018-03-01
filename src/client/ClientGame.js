import Game from '../integrated/Game.js';
import Player from '../integrated/Player.js';
import PacketHandler from '../integrated/packet/PacketHandler.js';

import ViewPort from './camera/ViewPort.js';
import Mouse from './input/Mouse.js';
import Renderer from './Renderer.js';

import GameState from '../integrated/GameState.js';

class ClientGame extends Game
{
  constructor(socket, canvas)
  {
    super(true);

    this.socket = socket;
    this.canvas = canvas;

    this.input = new Mouse(document);
    this.renderer = new Renderer(this.canvas);

    this.thePlayer = new Player(-1);

    this.gameState = new GameState();
  }

  load(callback)
  {
  	console.log("Loading client...");

    this.renderer.load(callback);
  }

  connect(callback)
  {
    console.log("Connecting client...");

    this.socket.emit('client-handshake');

    this.socket.on('server-handshake', () => {
      console.log("Connected to server...");
      //Add this EntityPlayer...
      this.thePlayer.id = this.socket.id;
      this.gameState.addEntity(this.thePlayer.id, this.thePlayer);
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
        let player = new Player(data[i]);
        this.gameState.addEntity(player.id, player);
      }
    });
    this.socket.on('server-addclient', (data) => {
      //Create EntityPlayer...
      let player = new Player(data);
      this.gameState.addEntity(player.id, player);
    })
    this.socket.on('server-delclient', (data) => {
      //Delete EntityPlayer...
      this.gameState.removeEntity(data);
    });

    this.socket.on('disconnect', () => {
      window.close();
    });
  }

  update(frame)
  {
    let input = this.input.poll();
    let vec = ViewPort.getPointFromScreen(vec3.create(), this.renderer.camera, this.renderer.viewport, input.x, input.y);
    input.x = vec[0];
    input.y = vec[1];

    //TODO: Apply input to game state... PREDICTIVE!
    let entity = this.gameState.getEntity(this.socket.id);
    entity.x = input.x;
    entity.y = input.y;

    //Render state...
    this.renderer.render(this.gameState.entities);

    if (input.dx != 0 || input.dy != 0)
    {
      //Force 200ms lag...
      setTimeout(() => PacketHandler.sendToServer('client-input', input, this.socket), 200);
    }
  }

  onServerUpdate(socket, data)
  {
    //Update state to authoritative state...
    this.gameState.decode(data);
  }
}

export default ClientGame;
