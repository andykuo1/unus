import Application from 'Application.js';

import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import * as MathHelper from 'util/MathHelper.js';
import * as Components from 'shared/entity/component/Components.js';

const ENTITY_SYNC_TICKS = 20;

class World
{
  constructor(serverEngine)
  {
    this.entityManager = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entityManager);
    this.entitySyncTimer = ENTITY_SYNC_TICKS;

    this.forceFullUpdate = true;
    this.worldTicks = 0;
  }

  async initialize()
  {
    this.entityManager.registerEntity('player', function() {
      this.addComponent(Components.Transform);
      this.addComponent(Components.Renderable);
      this.addComponent(Components.Motion);
    });

    this.entityManager.registerEntity('bullet', function() {
      this.addComponent(Components.Transform);
      this.addComponent(Components.Renderable);
      this.addComponent(Components.Motion);
      this.addComponent(Components.DecayOverTime);
    });
  }

  onClientConnect(client)
  {
    console.log("Preparing environment for client...");

    const entity = this.entityManager.spawnEntity('player');
    client.onPlayerCreate(entity);

    this.forceFullUpdate = true;
  }

  onClientDisconnect(client)
  {
    console.log("Resetting environment for client...");

    const entityPlayer = client.player;
    client.onPlayerDestroy();
    this.entityManager.destroyEntity(entityPlayer);
  }

  onUpdate(delta)
  {
    //Do regular logic here...
    ++this.worldTicks;

    //Update motion logic
    let entities = this.entityManager.getEntitiesByComponent(Components.Motion);
    for(const entity of entities)
    {
      entity.Transform.position[0] += entity.Motion.motionX;
      entity.Transform.position[1] += entity.Motion.motionY;
      entity.Motion.motionX *= 1 - entity.Motion.friction;
      entity.Motion.motionY *= 1 - entity.Motion.friction;
    }

    //Update decay over time logic
    entities = this.entityManager.getEntitiesByComponent(Components.DecayOverTime);
    let i = entities.length;
    while(i--)
    {
      const entity = entities[i];
      if (entity.DecayOverTime.age-- <= 0)
      {
        this.entityManager.destroyEntity(entity);
        continue;
      }
    }

    //Send world state update to clients and full updates every few ticks
    const payload = {};
    const fullUpdate = this.forceFullUpdate || --this.entitySyncTimer <= 0;
    if (fullUpdate)
    {
      console.log("Sending complete world state...");
      this.entitySyncTimer = ENTITY_SYNC_TICKS;
      this.forceFullUpdate = false;
    }
    payload.worldData = this.synchronizer.serialize(fullUpdate);
    payload.worldTicks = this.worldTicks;

    //Send to all clients
    for(const client of Application.server._clients.values())
    {
      payload.playerData = {
        entity: client.player.id
      };

      //Send server update
      if (client._restart)
      {
        client._socket.emit('serverRestart', payload);
        client._restart = false;
      }
      else
      {
        client._socket.emit('serverUpdate', payload);
      }
    }
  }
}

export default World;
