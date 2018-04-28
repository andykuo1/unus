import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import Application from 'Application.js';

import * as Components from 'shared/entity/component/Components.js';

class World
{
  constructor(serverEngine)
  {
    this.entities = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entities);
    this.entitySyncTimer = 20;
  }

  async initialize()
  {
    this.entity = this.entities.spawnEntity();
    this.entity.addComponent(Components.Transform);
    this.entity.addComponent(Components.Renderable);
  }

  onClientConnect(client)
  {

  }

  onClientDisconnect(client)
  {

  }

  onUpdate(delta)
  {
    this.entity.Transform.position[0] += -0.1 + Math.random() * 0.2;
    this.entity.Transform.position[1] += -0.1 + Math.random() * 0.2;

    if (--this.entitySyncTimer <= 0)
    {
      console.log("Sending full world state...");

      const worldData = this.synchronizer.serialize();
      for(const client of Application.server._clients.values())
      {
        client._socket.emit('serverUpdate', worldData);
      }

      this.entitySyncTimer = 20;
    }
  }
}

export default World;
