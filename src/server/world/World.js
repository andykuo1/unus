import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import Application from 'Application.js';
import Renderable from 'server/world/ComponentRenderable.js';

class World
{
  constructor(serverEngine)
  {
    this.entities = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entities);
    this.entitySyncTimer = 10;
  }

  async initialize()
  {

  }

  onClientConnect(client)
  {

  }

  onClientDisconnect(client)
  {

  }

  onUpdate(delta)
  {
    if (--this.entitySyncTimer <= 0)
    {
      console.log("Sending full world state...");

      const worldData = this.synchronizer.serialize();
      for(const client of Application.server._clients.values())
      {
        client._socket.emit('serverUpdate', worldData);
      }

      this.entitySyncTimer = 10;
    }
  }
}

export default World;
