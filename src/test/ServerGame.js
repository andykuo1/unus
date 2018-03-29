import { vec3 } from 'gl-matrix';
import PriorityQueue from 'util/PriorityQueue.js';
import Console from 'server/console/Console.js';

import Application from 'Application.js';

import World from 'test/World.js';
import RemotePlayer from 'test/RemotePlayer.js';

import GameWorld from 'test/GameWorld.js';

class ServerGame
{
  constructor()
  {
    this.world = new World();
    this.inputStates = new PriorityQueue((a, b) => {
      return a.ticks - b.ticks;
    });

    this.players = [];
  }

  async load()
  {
    console.log("Loading server...");
    GameWorld.init(this);

    //Setup console...
    this.onCommandSetup();

    //Setup world...
    this.onWorldSetup();

    await this.connect();
  }

  async connect()
  {
    console.log("Connecting server...");

    Application.network.events.on('clientConnect', (client, data) => {
      //Insert new player...
      const playerEntity = this.world.entityManager.spawnEntity('player');
      data.playerID = playerEntity.id;
      data.clientID = client.id;
      //TODO: Load and send player data...
      const player = new RemotePlayer(playerEntity, client.id);
      this.players.push(player);

      //Send previous game state...
      data.initialState = this.world.saveState();

      //Listening to the client...
      client.on('client.inputstate', (data) => {
        this.onClientUpdate(client, data);
      });
    });

    Application.network.events.on('clientDisconnect', (client) => {
      const player = this.getPlayerByClientID(client.id);
      this.world.entityManager.destroyEntity(player.entity);
      this.players.splice(this.players.indexOf(player), 1);
    });

    await Application.network.initServer();
  }

  onCommandSetup()
  {
    Console.addCommand("stop", "stop", (args) => {
      console.log("Stopping server...");
      //TODO: ADD state-preservation features...
      const gameState = this.world.saveState();
      //TODO: Write game state to file...
      //TODO: Load game state from file...
      //this.world.loadState(gameState);
      console.log("Server stopped.");
      process.exit(0);
    });
  }

  onWorldSetup()
  {
    GameWorld.create(this);
  }

  update(delta)
  {
    //SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
    while(this.inputStates.length > 0)
    {
      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const inputState = this.inputStates.dequeue();
      const player = this.getPlayerByClientID(inputState.clientID);
      if (!player) throw new Error("cannot find player with id \'" + inputState.clientID + "\'");

      //Update world to just before input...
      const dt = inputState.ticks - this.world.worldTicks;
      player.onInputUpdate(inputState);
      //TODO: What is delta?
      if (dt > 0)
      {
        player.onUpdate(delta);
      }
    }

    //SERVER sends CURRENT_GAME_STATE to all CLIENTS.
    this.sendServerUpdate();
  }

  onClientUpdate(client, inputState)
  {
    //SERVER stores CURRENT_INPUT_STATE.
    inputState.clientID = client.id;
    this.inputStates.queue(inputState);
  }

  sendServerUpdate()
  {
    const gameState = this.world.captureState();
    Application.network.clients.forEach((client, id) => {
      const player = this.getPlayerByClientID(id);
      gameState.playerTicks = player.playerTicks;
      Application.network.sendTo('server.gamestate', gameState, client);
    });
  }

  getPlayerByClientID(clientID)
  {
    for(const player of this.players)
    {
      if (player.clientID === clientID)
      {
        return player;
      }
    }

    return null;
  }
}

export default ServerGame;
