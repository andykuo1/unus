import Application from 'Application.js';

import World from 'integrated/World.js';

import Mouse from 'client/input/Mouse.js';
import Renderer from 'client/Renderer.js';

import GameFactory from 'game/GameFactory.js';

import ClientSyncer from 'client/ClientSyncer.js';

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

//EVENT: 'clientResponse' - called before sending data to server
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
  }

  async start()
  {
    console.log("Loading client...");
    await this.renderer.load();

    console.log("Connecting client...");
    Application.network.events.on('serverConnect', server => {
      server.on('serverData',
        data => Application.events.emit('serverData', server, data));
    });

    this.syncer.init();

    await Application.network.initClient();
  }

  update(frame)
  {
    const inputState = this.input.poll();
    Application.events.emit('inputUpdate', inputState);

    const data = {};
    Application.events.emit('clientResponse', data);
    this.syncer.onUpdate(frame);
    this.renderer.render(this.world);
  }

  /************* Game Implementation *************/
}

export default ClientEngine;
