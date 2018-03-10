import Frame from '../util/Frame.js';
import PriorityQueue from '../util/PriorityQueue.js';

import Game from '../integrated/Game.js';
import World from '../integrated/World.js';
import PlayerManager from './PlayerManager.js';

import Console from './console/Console.js';

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

    this.world = new World(false);
    this.inputStates = new PriorityQueue((a, b) => {
      return a.worldTicks - b.worldTicks;
    });

    this.playerManager = new PlayerManager(this.world.entityManager);
  }

  load(callback)
  {
    console.log("Loading server...");

    //Setup console...
    this.onCommandSetup();

    //Setup world...
    this.onWorldSetup();

    callback();
  }

  connect(callback)
  {
    console.log("Connecting server...");

    this.networkHandler.initServer(callback);
    this.networkHandler.onClientConnect = (client, data) => {
      //Insert new player...
      const clientEntity = this.playerManager.createPlayer(client.id);
      data.entityID = clientEntity._id;

      //Send previous game state...
      const gameState = this.world.captureState(this.world.frame);
      data.gameState = gameState;

      //Listening to the client...
      client.on('client.inputstate', (data) => {
        this.onClientUpdate(client, data);
      });
    };
    this.networkHandler.onClientDisconnect = (client) => {
      this.playerManager.destroyPlayer(client.id);
    };
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

  onWorldSetup()
  {
    //TODO: ADD initial world state / loading
  }

  onUpdate(frame)
  {
    const dFrame = new Frame();
    var prevTicks = this.world.ticks;

    //SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
    while(this.inputStates.length > 0)
    {
      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const inputState = this.inputStates.dequeue();
      const targetEntity = this.playerManager.getPlayerByClientID(inputState.target);

      var nextFrame = inputState.frame;
      var nextTicks = inputState.worldTicks;

      //If the next state is over current timestep...
      if (nextFrame.then > frame.then)
      {
        console.log("CAUTION: Found future input event!");
        nextFrame = inputState.frame = prevFrame;
      }

      //Update world to just before input...
      /*
      const dt = nextTicks - prevTicks;
      if (dt > 0)
      {
        dFrame.delta = dt;
        this.world.step(dFrame, true);
      }
      */

      //Update world to after this input state...
      this.world.updateInput(inputState, targetEntity);
      this.world.step(nextFrame, true);

      prevTicks = this.world.ticks;
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
    const gameState = this.world.captureState(frame);
    this.networkHandler.sendToAll('server.gamestate', gameState);
  }
}

export default ServerGame;
