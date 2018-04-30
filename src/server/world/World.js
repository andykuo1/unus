import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import Application from 'Application.js';
import * as MathHelper from 'util/MathHelper.js';

import * as Components from 'shared/entity/component/Components.js';

class World
{
  constructor(serverEngine)
  {
    this.entityManager = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entityManager);
    this.entitySyncTimer = 20;

    this.forceUpdateRestart = true;
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

    this.forceUpdateRestart = true;
    client._player = entity;
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

    //Send full update every few ticks
    if (this.forceUpdateRestart || --this.entitySyncTimer <= 0)
    {
      console.log("Sending complete world state...");

      const payload = {};
      payload.worldData = this.synchronizer.serialize(true);

      for(const client of Application.server._clients.values())
      {
        payload.playerData = {
          entity: client.player.id
        };

        client._socket.emit(this.forceUpdateRestart ? 'serverRestart' : 'serverUpdate', payload);
      }

      this.entitySyncTimer = 20;
      this.forceUpdateRestart = false;
    }
    else
    {
      //console.log("Sending differential world state...");

      const payload = {};
      payload.worldData = this.synchronizer.serialize(false);

      for(const client of Application.server._clients.values())
      {
        payload.playerData = {
          entity: client.player.id
        };

        //Send server update
        Application.network.sendTo(client._socket, 'serverUpdate', payload);
      }
    }
  }
}

export default World;
