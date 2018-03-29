import EntityManager from 'test/EntityManager.js';

import Application from 'Application.js';

class World
{
  constructor()
  {
    this.worldTicks = 0;
    this.prevWorldTicks = 0;

    this.eventCache = [];
    this.entityManager = new EntityManager();
    this.entityManager.events.on('entityCreate', (entity, name) => {
      this.eventCache.push({
        name: 'entityCreate',
        target: entity.id,
        targetName: name
      });
    });
    this.entityManager.events.on('entityDestroy', (entity) => {
      this.eventCache.push({
        name: 'entityDestroy',
        target: entity.id
      });
    });
  }

  update(delta)
  {
    this.worldTicks += delta;
    this.entityManager.update(this.worldTicks - this.prevWorldTicks);
  }

  saveState()
  {
    const gameState = {
      ticks: this.worldTicks,
      entities: {},
      players: {}
    };

    for(const system of this.entityManager.systems)
    {
      system.saveToGameState(this.entityManager, gameState);
    }

    for(const entity of this.entityManager.entities)
    {
      let entityData = gameState.entities[entity.id];
      if (!entityData) entityData = gameState.entities[entity.id] = {};
      entityData.name = entity._name;
    }

    return gameState;
  }

  loadState(gameState)
  {
    this.prevWorldTicks = this.worldTicks = gameState.ticks;
    for(const entityID in gameState.entities)
    {
      const entityData = gameState.entities[entityID];
      let entity = this.entityManager.getEntityByID(entityID);
      if (!entity)
      {
        entity = this.entityManager.spawnEntity(entityData.name);
        entity._id = entityID;
      }
    }

    for(const system of this.entityManager.systems)
    {
      system.loadFromGameState(this.entityManager, gameState);
    }
  }

  captureState()
  {
    const gameState = {
      ticks: this.worldTicks,
      events: [],
      entities: {}
    };

    gameState.events = [];
    for(const event of this.eventCache)
    {
      gameState.events.push(event);
    }
    this.eventCache.length = 0;

    for(const system of this.entityManager.systems)
    {
      system.writeToGameState(this.entityManager, gameState);
    }

    return gameState;
  }

  resetState(gameState)
  {
    this.prevWorldTicks = this.worldTicks = gameState.ticks;

    for(const event of gameState.events)
    {
      if (event.name == 'entityCreate')
      {
        console.log("Created entity \'" + event.targetName + "\'...");
        if (this.entityManager.getEntityByID(event.target)) continue;
        const entity = this.entityManager.spawnEntity(event.targetName);
        entity._id = event.target;
      }
      else if (event.name == 'entityDestroy')
      {
        console.log("Destroyed entity \'" + event.target + "\'...");
        const entity = this.entityManager.getEntityByID(event.target);
        if (!entity) throw new Error("Cannot find entity by id \'" + event.taraget + "\' for removal");
        this.entityManager.destroyEntity(entity);
      }
      else
      {
        throw new Error("Unknown event type for entity");
      }
    }
    this.eventCache.length = 0;

    for(const system of this.entityManager.systems)
    {
      system.readFromGameState(this.entityManager, gameState);
    }
  }

  get entities() { return this.entityManager.entities; }
}

export default World;
