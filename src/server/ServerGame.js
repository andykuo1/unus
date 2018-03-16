import Frame from 'util/Frame.js';
import PriorityQueue from 'util/PriorityQueue.js';

import Game from 'integrated/Game.js';
import World from 'integrated/World.js';

import PlayerManager from 'server/PlayerManager.js';
import Console from 'server/console/Console.js';

import GameFactory from 'game/GameFactory.js';

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
      const gameState = this.world.captureState();
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
    this.playerManager.onUpdate(frame);
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

  onUpdate(frame)
  {
    const currentTicks = this.world.ticks + frame.delta;
    const nextFrame = new Frame();

    //SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
    while(this.inputStates.length > 0)
    {
      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const inputState = this.inputStates.dequeue();
      const targetEntity = this.playerManager.getPlayerByClientID(inputState.target);

      //Update world to just before input...
      const dt = inputState.worldTicks - this.world.ticks;
      if (dt > 0)
      {
        nextFrame.delta = dt;
        this.world.step(nextFrame);
      }

      //Update world to after this input state...
      if (targetEntity) this.world.updateInput(inputState, targetEntity);
    }

    //Update world to current tick...
    const dt = currentTicks - this.world.ticks;
    if (dt > 0)
    {
      nextFrame.delta = dt;
      this.world.step(nextFrame);
    }

    //SERVER sends CURRENT_GAME_STATE to all CLIENTS.
    this.sendServerUpdate();
  }

  onClientUpdate(client, inputState)
  {
    //SERVER stores CURRENT_INPUT_STATE.
    inputState.target = client.id;
    this.inputStates.queue(inputState);
  }

  sendServerUpdate()
  {
    const gameState = this.world.captureState();
    this.networkHandler.sendToAll('server.gamestate', gameState);
  }
}

export default ServerGame;
