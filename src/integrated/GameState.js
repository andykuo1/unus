import EntityManager from './entity/EntityManager.js';

class GameState
{
  constructor()
  {
    this.entities = {};
    this.entityManager = new EntityManager();
    this.lastUpdateTime = 0;
  }

  /**
   * Prepare game state to be sent over network
   */
  encode()
  {
    let packet = {};
    packet.entities = [];
    packet.systems = {};
    for(const id in this.entityManager.systems)
    {
      const system = this.entityManager.systems[id];
      let entities = [];
      packet.systems[id] = entities;
      for(const entity of system.entities)
      {
        entities.push(entity.id);

        let dst = packet.entities[entity.id];
        if (dst == null)
        {
          dst = {};
          packet.entities[entity.id] = dst;
        }
        system.encodeEntityData(entity, dst);
      }
    }
    //return packet;
    return this.entities;
  }

  /**
   * Parse game state from received data
   */
  decode(data)
  {
    for(const id in data.systems)
    {
      const system = this.entityManager.systems[id];
      let entities = packet.systems[id];
      for(const entity of entities)
      {
        var dst = system.getEntityByID(entity.id);
        if (dst == null)
        {
          //Missing component
          dst = this.entityManager.getEntityByID(entity.id);
          if (dst == null)
          {
            //Missing entity
            dst = this.entityManager.createEntity();
            dst.id = entity.id;
          }
          this.entityManager.addComponent(id);
        }
        system.decodeEntityData(entity, dst);
      }
    }

    this.entities = data;
  }

  getEntity(id)
  {
    return this.entities[id];
  }

  addEntity(id, entity)
  {
    this.entities[id] = entity;
  }

  removeEntity(id)
  {
    delete this.entities[id];
  }

  update(frame)
  {
    this.entityManager.update();
    for(const entity of this.entities)
    {
      entity.onUpdate(frame);
    }

    this.entityManager.update(frame);
    this.lastUpdateTime = frame.then;
  }
}

export default GameState;
