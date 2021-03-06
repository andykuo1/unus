class SystemManager
{
  constructor()
  {
    this.systems = [];
    this.predictiveEntities = {};
  }

  update(entityManager, frame, predictive)
  {
    this.makePredictiveState(frame, predictive);

    for(const system of this.systems)
    {
      system.onUpdate(entityManager, frame.delta);
    }
  }

  updateInput(inputState, targetEntity, predictive)
  {
    this.makePredictiveState(inputState, predictive);

    for(const system of this.systems)
    {
      system.onInputUpdate(targetEntity, inputState);
    }
  }

  resetSystemStates(entityManager, gameState)
  {
    this.resetEntityList(entityManager, gameState);

    for(const system of this.systems)
    {
      system.readFromGameState(entityManager, gameState);
    }
  }

  resetEntityList(entityManager, gameState)
  {
    //HACK: This is to correct any dead / alive entities left...
    const entities = gameState['entitylist'] || {};
    for(const entity of entityManager.entities)
    {
      if (!entities[entity._id] && !entity.tracker)
      {
        //Maybe missed destruction event from server...
        entityManager.destroyEntity(entity);
      }
    }
    for(const entityID in entities)
    {
      let entity = entityManager.getEntityByID(entityID);
      if (!entity)
      {
        //Maybe missed creation event from server...
        entity = entityManager.spawnEntity(entities[entityID].name);
        entity._id = entityID;
      }
    }
  }

  makePredictiveState(state, predictive)
  {
    if (predictive || state.hasOwnProperty('predictive'))
    {
      state.predictiveFirst = (predictive && !state.predictive);
      state.predictive = predictive;
    }

    return state;
  }
}

export default SystemManager;
