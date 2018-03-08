class EntitySystem
{
  constructor(entityManager)
  {
    this.createCache = [];
    this.destroyCache = [];

    entityManager.addCallback((entity, state) => {
      switch(state)
      {
        case 'create':
          if (this.destroyCache.includes(entity._id))
          {
            this.destroyCache.splice(this.destroyCache.indexOf(entity._id), 1);
          }
          this.createCache.push(entity._id);
          break;
        case 'destroy':
          if (this.createCache.includes(entity._id))
          {
            this.createCache.splice(this.createCache.indexOf(entity._id), 1);
          }
          this.destroyCache.push(entity._id);
          break;
      }
    });
  }

  onUpdate(entityManager, frame)
  {
  }

  onInputUpdate(entity, inputState)
  {
  }

  writeToGameState(entityManager, gameState)
  {
    let entities = gameState['entities.create'];
    if (!entities) entities = gameState['entities.create'] = [];
    for(const entityID of this.createCache)
    {
      entities.push(entityID);
    }
    this.createCache.length = 0;

    entities = gameState['entities.destroy'];
    if (!entities) entities = gameState['entities.destroy'] = [];
    for(const entityID of entities)
    {
      entities.push(entityID);
    }
    this.destroyCache.length = 0;
  }

  readFromGameState(entityManager, gameState)
  {
    let entities = gameState['entities.create'] || [];
    for(const entityID of entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (entity) continue;

      console.log("CREATE ENTITY!");
      entityManager.createEntity(entityID);
    }

    entities = gameState['entities.destroy'] || [];
    for(const entityID of entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (!entity) continue;
      console.log("DESTROY ENTITY!");
      entityManager.destroyEntity(entity);
    }

    entities = gameState['entities'] || {};
    for(const entity of entityManager.getEntities())
    {
      if (!entities[entity._id])
      {
        //Maybe missed destruction event from server...
        entityManager.destroyEntity(entity);
      }
    }
    for(const entityID in entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (!entity)
      {
        //Maybe missed creation event from server...
        entityManager.createEntity(entityID);
      }
    }
  }
}

export default EntitySystem;
