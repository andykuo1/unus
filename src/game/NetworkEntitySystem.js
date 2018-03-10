import System from '../integrated/entity/System.js';

class NetworkEntitySystem extends System
{
  constructor(entityManager)
  {
    super();

    this.createCache = [];
    this.destroyCache = [];

    entityManager.onEntityCreate = (entity) => {
      if (this.destroyCache.includes(entity._id))
      {
        this.destroyCache.splice(this.destroyCache.indexOf(entity._id), 1);
      }
      this.createCache.push(entity._id);
    };

    entityManager.onEntityDestroy = (entity) => {
      if (this.createCache.includes(entity._id))
      {
        this.createCache.splice(this.createCache.indexOf(entity._id), 1);
      }
      this.destroyCache.push(entity._id);
    };
  }

  onUpdate(entityManager, frame)
  {
    super.onUpdate(entityManager, frame);
  }

  onInputUpdate(entity, inputState)
  {
    super.onInputUpdate(entity, inputState)
  }

  writeToGameState(entityManager, gameState)
  {
    super.writeToGameState(entityManager, gameState);

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
    super.readFromGameState(entityManager, gameState);

    //BUG: This is not actually running...
    let entities = gameState['entities.create'] || [];
    for(const entityID of entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (entity) continue;

      entityManager.createEntity(entityID);
    }

    //BUG: This is not actually running...
    entities = gameState['entities.destroy'] || [];
    for(const entityID of entities)
    {
      const entity = entityManager.getEntityByID(entityID);
      if (!entity) continue;

      entityManager.destroyEntity(entity);
    }

    //HACK: This is to correct any dead / alive entities left...
    entities = gameState['entitylist'] || {};
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

export default NetworkEntitySystem;
