import EntityManager from './entity/EntityManager.js';

class WorldState
{
  constructor()
  {
    this.players = [];
    this.entities = [];
  }

  update()
  {
    //Same...
    for(const player of this.players)
    {
      player.onUpdate();
    }

    for(const entity of this.entities)
    {
      entity.onUpdate();
    }
  }

  update(newWorldState)
  {
    //Same... but it is only called by client...
  }
}

class World
{
  constructor()
  {
    this.worldState = new WorldState();
    this.timestamp = 0;
  }

  onStart()
  {
    //Different...
  }

  onUpdate()
  {
    this.onProcessInput();

    //Update worldState
    this.worldState.update();
  }

  onProcessInput()
  {
    //Here it is different...
  }
}

export default World;
