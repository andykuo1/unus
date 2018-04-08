import Application from 'Application.js';

import World from 'integrated/World.js';

import Mouse from 'client/input/Mouse.js';
import Renderer from 'client/Renderer.js';

import GameFactory from 'game/GameFactory.js';

import ClientSyncer from 'client/ClientSyncer.js';
import GameEngine from 'integrated/GameEngine.js';

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
    //Pre-step

    while(this.inboundMessages.length > 0)
    {
      //Process incoming messages from server...
      this.gameEngine.handleMessage(this.inboundMessages.pop());
    }

    //FIXME: Where should this be?
    const inputState = this.input.poll();
    Application.events.emit('inputUpdate', inputState);
    //this.applyDelayedInputs(); <- artificial delay on user inputs...
    this.syncer.onUpdate(frame);
    this.gameEngine.step(false, frame.then, frame.delta);

    //Post-step
    this.renderer.render(this.world);
  }
}

export default ClientEngine;
