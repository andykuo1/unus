import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import Application from 'Application.js';

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
    //DEBUG: Randomly update position...
    for(const entity of this.entityManager.entities)
    {
      if (typeof entity.Transform != 'undefined')
      {
        entity.Transform.position[0] += -0.1 + Math.random() * 0.2;
        entity.Transform.position[1] += -0.1 + Math.random() * 0.2;
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

        client._socket.emit('serverUpdate', payload);
      }
    }
  }
}

export default World;
