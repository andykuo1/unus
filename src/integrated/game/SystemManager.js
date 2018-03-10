class SystemManager
{
  constructor()
  {
    this.systems = [];
  }

  update(entityManager, frame)
  {
    for(const system of this.systems)
    {
      system.onUpdate(entityManager, frame);
    }
  }

  updateInput(inputState, targetEntity)
  {
    for(const system of this.systems)
    {
      system.onInputUpdate(targetEntity, inputState);
    }
  }

  captureSystemStates(entityManager, dst)
  {
    for(const system of this.systems)
    {
      system.writeToGameState(entityManager, dst);
    }
  }

  resetSystemStates(entityManager, gameState)
  {
    for(const system of this.systems)
    {
      system.readFromGameState(entityManager, gameState);
    }
  }
}

export default SystemManager;
