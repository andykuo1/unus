import PriorityQueue from '../util/PriorityQueue.js';

import Console from './console/Console.js';

import Player from '../integrated/entity/PlayerComponent.js';

/*

SERVER stores CURRENT_INPUT_STATE.
SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
SERVER sends CURRENT_GAME_STATE to all CLIENTS.

*/

class ServerGame// extends Game
{
  constructor(world, networkHandler)
  {
    this.world = world;
    this.networkHandler = networkHandler;

    this.inputStates = new PriorityQueue();
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

    this.networkHandler.initServer(callback);
    this.networkHandler.onClientConnect = (client) => {
      const clientEntity = this.world.entityManager.createEntity().addComponent(Player);
      clientEntity.player.socketID = client.id;
      client.on('client.inputstate', (data) => {
        this.onClientUpdate(client, data);
      });
    };
    this.networkHandler.onClientDisconnect = (client) => {
      const clientEntity = this.world.getEntityByClientID(client.id);
      if (clientEntity == null) return;
      this.world.entityManager.destroyEntity(clientEntity);
    };

    callback();
  }

  update(frame)
  {
    this.onUpdate(frame);
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
