import World from './World.js';

class ServerWorld extends World
{
  constructor(server, clients)
  {
    super();
    this.server = server;
    this.clients = clients;
    this.inputs = [];
  }

  onStart()
  {
    //Load world from file...
  }

  onUpdate()
  {
    super.onUpdate()
    world.broadcastServerUpdate();
  }

  onProcessInput()
  {
    //Get all client inputs
    //For each player, apply the input
    let newTimeStamp = 0;
    for(const input of this.inputs)
    {
      //TODO: Get player by inputstate
      //TODO: Apply input state
      newTimeStamp = input.timestamp;

      //TODO: should pass frame, which is the time between each input
      //TODO: if no time has elapsed between these inputs, then UPDATE AFTER
      this.worldState.update();
    }

    //TODO: if it did not update the last input due to being the same TIMESTAMP

    //set latest timestamp
    this.worldState.timestamp = newTimeStamp;
  }

  addInputState(inputState)
  {
    //TODO: add player id to inputstate
    this.inputs.push(inputState);
  }

  broadcastServerUpdate()
  {
    //Send worldState to all
    PacketHandler.sendToAll('server-update', this.worldState, this.clients);
  }
}

export default ServerWorld;
