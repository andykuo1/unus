class RemotePlayer
{
  constructor(entity, clientID)
  {
    this.entity = entity;
    this.clientID = clientID;
    this.playerTicks = 0;
  }

  onUpdate(delta)
  {

  }

  onInputUpdate(inputState)
  {
    this.entity.transform.x = inputState.x;
    this.entity.transform.y = inputState.y;
    this.playerTicks = inputState.ticks;
  }

  saveToGameState(gameState)
  {
  }

  loadFromGameState(gameState)
  {
  }

  writeToGameState(gameState)
  {

  }

  readFromGameState(gameState)
  {

  }
}

export default RemotePlayer;
