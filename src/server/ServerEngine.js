import Application from 'Application.js';

import World from 'integrated/World.js';

import Console from 'server/console/Console.js';

import ServerSynchronizer from 'server/ServerSynchronizer.js';

import GameFactory from 'game/GameFactory.js';

/*
SERVER stores CURRENT_INPUT_STATE.
SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
SERVER sends CURRENT_GAME_STATE to all CLIENTS.
*/

class ServerEngine
{
  constructor()
  {
    this.world = new World();
    this.syncer = new ServerSynchronizer(this.world);
  }

  async start()
  {
    console.log("Loading server...");

    //Setup console...
    this.onCommandSetup();

    //Setup world...
    this.onWorldSetup();

    console.log("Connecting server...");

    Application.network.events.on('clientConnect', (client, data) => {
      client.on('clientData',
        data => Application.events.emit('clientData', client, data));
    });

    this.syncer.init();

    await Application.network.initServer();
  }

  update(frame)
  {
    this.syncer.onUpdate(frame);
  }

  /************* Game Implementation *************/

  onCommandSetup()
  {
    Console.addCommand("stop", "stop", (args) => {
      console.log("Stopping server...");
      //TODO: ADD state-preservation features...
      console.log("Server stopped.");
      process.exit(0);
    });
  }

  onWorldSetup()
  {
    //TODO: ADD initial world state / loading
    GameFactory.createWorld(this);
  }
}

export default ServerEngine;
