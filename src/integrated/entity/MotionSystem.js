class MotionSystem
{
  constructor()
  {

  }

  writeEntitiesToState(entityManager, gameState)
  {
    let entities = gameState['entities'];
    if (!entities) entities = gameState['entities'] = [];
    for(const entity of entityManager.getEntities())
    {
      let entityData = entities[entity._id];
      if (!entityData) entityData = entities[entity._id] = {};
      for(const component of entityManager.getComponentsByEntity(entity))
      {
        var componentName = EntityManager.getComponentName(component);
        entityData[componentName] = entity[componentName];
      }
    }
    return gameState;
  }

  readEntitiesFromState(entityManager, gameState)
  {
    let entities = gameState['entities'] || [];
    for(const entityID in entities)
    {
      var entity = entityManager.getEntityByID();
    }
  }
}

export default MotionSystem;
