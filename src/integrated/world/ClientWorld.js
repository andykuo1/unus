import World from './World.js';

class ClientWorld extends World
{
  constructor(client, server, player)
  {
    super();
    this.client = client;
    this.server = server;
    this.player = player;
    this.inputs = [];
  }

  onStart()
  {
    //TODO: IF server-update only sends changes, then request a full world copy
    this.server.on('server-update', (data) => this.applyServerUpdate(data));

    //TODO: How do we handle entity creation?
    //TODO: Create player and add to world state here...
  }

  onProcessInput()
  {
    //Get client input
    let inputState = this.client.input.poll();
    inputState.timestamp = Date.now();

    //Store it to a queue
    this.inputs.push(inputState);

    //Apply to player
    //TODO: How to get current player?
    this.player.onInputUpdate(inputState);

    //Send it to the server
    PacketHandler.sendToServer('client-input', inputState, this.server);
  }

  //Called whenever...
  applyServerUpdate(newWorldState)
  {
    //Remove all inputs BEFORE newWorldState
    var input = this.inputs.shift();
    while(input.timestamp < newWorldState.timestamp)
    {
      input = this.inputs.shift();
    }

    //Set worldState to newWorldState
    this.worldState.update(newWorldState);

    //Re-apply all inputs AFTER newWorldState
    let len = this.inputs.length;
    for(let i = 0; i < len; ++i)
    {
      input = this.inputs[i];

      //Apply to player
      //TODO: How to get current player?
      this.player.onInputUpdate(inputState);

      //TODO: should be able to handle all the inputs applied...
      //TODO: should be passed the time between each input
      this.worldState.update();
    }
  }
}

export default ClientWorld;
