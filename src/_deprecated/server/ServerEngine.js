import Application from 'Application.js';
import World from 'integrated/World.js';
import Console from 'server/console/Console.js';
import GameFactory from 'game/GameFactory.js';
import PriorityQueue from 'util/PriorityQueue.js';
import GameEngine from 'integrated/GameEngine.js';

/*
SERVER stores CURRENT_INPUT_STATE.
SERVER updates CURRENT_GAME_STATE with all gathered CURRENT_INPUT_STATE.
SERVER sends CURRENT_GAME_STATE to all CLIENTS.
*/

//EVENT: serverResponse(data) - called before sending data to client
//EVENT: clientData(data) - called on receiving data from client

class ServerEngine
{
  constructor(gameEngine)
  {
    this.world = new World();

    this.gameEngine = new GameEngine(this.world);
    this.clientPlayers = new Map();
    this.clientStates = new PriorityQueue((a, b) => {
      return a.worldTicks - b.worldTicks;
    });
    this.shouldFullWorldUpdate = false;
    this.worldUpdateTicks = 0;
  }

  async start()
  {
    console.log("Loading server...");

    this.world.init();

    //Setup console...
    this.onCommandSetup();

    //Setup world...
    this.onWorldSetup();

    console.log("Connecting server...");

    Application.network.events.on('clientConnect', this.onClientConnect.bind(this));
    Application.network.events.on('clientDisconnect', this.onClientDisconnect.bind(this));
    Application.network.events.on('handshakeResponse', this.onHandshakeResponse.bind(this));

    await Application.network.initServer();
  }

  onClientConnect(client)
  {
    const clientID = client.id;

    //Create player...
    const entityPlayer = this.world.entityManager.spawnEntity('player');
    entityPlayer.player.clientID = clientID;
    this.clientPlayers.set(clientID, entityPlayer);
    this.gameEngine.events.emit('playerJoined', entityPlayer);

    //Listen for incoming client data...
    client.on('clientData', data => {
      data.target = clientID;
      this.clientStates.queue(data);
      Application.events.emit('clientData', client, data);
    });
  }

  onClientDisconnect(client)
  {
    const clientID = client.id;

    //Destroy player...
    const entityPlayer = this.clientPlayers.get(clientID);
    this.gameEngine.events.emit('playerLeft', entityPlayer);
    this.world.entityManager.destroyEntity(entityPlayer);
    this.clientPlayers.delete(clientID);
  }

  onHandshakeResponse(client, data)
  {
    const clientEntity = this.getPlayerByClientID(client.id);
    if (!clientEntity) throw new Error("trying to handshake with an unknown client");
    data.entityID = clientEntity._id;

    //Send previous game state...
    data.initialState = this.world.captureState();
  }

  update(frame)
  {
    //For every player, process each input until up to date...
    while(this.clientStates.length > 0)
    {
      //Make sure we have reached these inputs in time...
      if (this.clientStates.peek().worldTicks > this.gameEngine.worldTicks) break;

      //Get oldest input state (ASSUMES INPUT STATES IS SORTED BY TIME!)
      const clientState = this.clientStates.dequeue();
      const entityPlayer = this.getPlayerByClientID(clientState.target);
      if (!entityPlayer) continue;

      //Process input
      this.gameEngine.processInput(clientState, entityPlayer);
    }

    //Run the game
    this.gameEngine.step(false, frame.then, frame.delta);

    //Update the players...
    const worldState = {};
    if (this.shouldFullWorldUpdate)
    {
      worldState.isfull = true;
      this.shouldFullWorldUpdate = false;
    }
    worldState.isfull = this.worldUpdateTicks++ % 20 === 0;
    Application.events.emit('serverResponse', worldState);

    //Send to the players...
    Application.network.sendToAll('serverData', worldState);
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

  getPlayerByClientID(socketID)
  {
    return this.clientPlayers.get(socketID);
  }
}

export default ServerEngine;