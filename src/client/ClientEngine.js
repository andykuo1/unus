import Application from 'Application.js';

import World from 'integrated/World.js';

import Mouse from 'client/input/Mouse.js';
import Renderer from 'client/Renderer.js';

import GameFactory from 'game/GameFactory.js';

import ClientSyncer from 'client/ClientSyncer.js';
import GameEngine from 'integrated/GameEngine.js';

import { vec3 } from 'gl-matrix';
import Frame from 'util/Frame.js';
import PriorityQueue from 'util/PriorityQueue.js';
import ViewPort from 'client/camera/ViewPort.js';

/*
CLIENT gets CURRENT_GAME_STATE.
CLIENT sets CLIENT_GAME_STATE to CURRENT_GAME_STATE.
CLIENT removes all INPUT_STATE older than CURRENT_GAME_STATE.
CLIENT updates CLIENT_GAME_STATE with all remaining INPUT_STATE.
. . .
CLIENT stores CURRENT_INPUT_STATE.
CLIENT updates CLIENT_GAME_STATE with CURRENT_INPUT_STATE.
CLIENT sends CURRENT_INPUT_STATE.
*/

//EVENT: 'clientResponse' (in ClientSyncer) - called before sending data to server
//EVENT: 'serverData' - called on receiving data from server
//EVENT: 'inputUpdate' - called after polling input

class ClientEngine
{
  constructor(canvas)
  {
    this.world = new World();
    this.renderer = new Renderer(canvas);
    this.input = new Mouse(document);
    this.syncer = new ClientSyncer(this.world, this.input, this.renderer);

    this.gameEngine = new GameEngine(this.world);
    this.inboundMessages = [];
    this.outboundMessages = [];
    this.clientInputDelay = 0;
    this.clientStates = new PriorityQueue((a, b) => {
      return a.worldTicks - b.worldTicks;
    });
  }

  async start()
  {
    console.log("Loading client...");
    await this.renderer.load();

    console.log("Connecting to server...");
    Application.network.events.on('serverConnect', this.onServerConnect.bind(this));

    this.world.init();
    this.syncer.init();

    await Application.network.initClient();
  }

  onServerConnect(server)
  {
    server.on('serverData', data => {
      this.inboundMessages.push(data);
      Application.events.emit('serverData', server, data)
    });
  }

  update(frame)
  {
    //Grab all input this frame...
    this.checkInput();

    //Process messages from and to server...
    this.handleInboundMessages();
    this.handleOutboundMessages();

    //Process inputs with delay...
    this.applyClientStates();

    //Update the game...
    this.syncer.onUpdate(frame);
    this.gameEngine.step(false, frame.then, frame.delta);

    //Render the game...
    this.renderer.render(this.world);
  }

  handleInboundMessages()
  {
    while(this.inboundMessages.length > 0)
    {
      const message = this.inboundMessages.pop();
      //TODO: do something with this message...
    }
  }

  handleOutboundMessages()
  {
    while(this.outboundMessages.length > 0)
    {
      const message = this.outboundMessages.pop();
      //FIXME: Force 200ms lag...
      setTimeout(() => Application.network.sendToServer('clientData', message), 200);
      //Application.network.sendToServer('clientData', data);
    }
  }

  applyClientStates()
  {
    while(this.clientStates.length > 0)
    {
      //FIXME: this.world should be this.gameEngine...
      if (this.clientStates.peek().worldTicks + this.clientInputDelay > this.world.worldTicks) break;
      const clientState = this.clientStates.dequeue();
      this.gameEngine.processInput(clientState, this.syncer.playerController.clientPlayer);
    }
  }

  checkInput()
  {
    const inputState = this.input.poll();
    const vec = ViewPort.getPointFromScreen(vec3.create(),
      this.renderer.camera, this.renderer.viewport,
      inputState.x, inputState.y);
    inputState.x = vec[0];
    inputState.y = vec[1];
    inputState.worldTicks = this.world.worldTicks;
    this.clientStates.queue(inputState);
    this.outboundMessages.push(inputState);
  }
}

export default ClientEngine;
