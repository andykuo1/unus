class SystemManager
{
  constructor()
  {
    this.systems = [];
  }

  update(entityManager, frame, predictive)
  {
  }

  updateInput(inputState, targetEntity, predictive)
  {
    for(const system of this.systems)
    {
      if (system.onInputUpdate) system.onInputUpdate(targetEntity, inputState);
    }
  }
}

export default SystemManager;
