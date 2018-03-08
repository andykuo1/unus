import Game from '../integrated/Game.js';
import World from '../integrated/World.js';

import PriorityQueue from '../util/PriorityQueue.js';
import Console from './console/Console.js';
import PlayerSystem from '../integrated/world/PlayerSystem.js';

/*
SERVER stores CURRENT_INPUT_STATE.
SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
SERVER sends CURRENT_GAME_STATE to all CLIENTS.
*/

class ServerGame extends Game
{
  constructor(networkHandler)
  {
    super(networkHandler);

    this.world = new World({delta: 0, then: Date.now(), count: 0}, false);
    this.inputStates = new PriorityQueue();
  }

  load(callback)
  {
    console.log("Loading server...");

    //Setup console...
    this.onCommandSetup();

    callback();
  }

  connect(callback)
  {
    console.log("Connecting server...");

    this.networkHandler.initServer(callback);
    this.networkHandler.onClientConnect = (client) => {
      const clientEntity = PlayerSystem.createPlayerEntity(this.world.entityManager, client.id);
      client.on('client.inputstate', (data) => {
        this.onClientUpdate(client, data);
      });
    };
    this.networkHandler.onClientDisconnect = (client) => {
      const clientEntity = PlayerSystem.getPlayerByClientID(this.world.entityManager, client.id);
      if (clientEntity == null) return;
      this.world.entityManager.destroyEntity(clientEntity);
    };

    callback();
  }

  update(frame)
  {
    this.onUpdate(frame);
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

  onUpdate(frame)
  {
    //SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
    while(this.inputStates.length > 0)
    {
      let inputState = this.inputStates.dequeue();
      this.world.step(inputState, inputState.frame, inputState.target);
    }

    //SERVER sends CURRENT_GAME_STATE to all CLIENTS.
    this.sendServerUpdate(frame);
  }

  onClientUpdate(client, inputState)
  {
    //SERVER stores CURRENT_INPUT_STATE.
    inputState.target = client.id;
    this.inputStates.queue(inputState);
  }

  sendServerUpdate(frame)
  {
    let gameState = this.world.captureState(frame);
    this.networkHandler.sendToAll('server.gamestate', gameState);
  }
}

export default ServerGame;
