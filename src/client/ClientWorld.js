import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import Application from 'Application.js';

import Renderable from 'server/world/ComponentRenderable.js';

class ClientWorld
{
  constructor()
  {
    this.entities = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entities);
  }

  async initialize()
  {
    const entity = this.entities.spawnEntity(null);
    entity.addComponent(Renderable);
    entity.renderable.x = -10;
    entity.renderable.y = -10;
  }

  onClientConnect(client)
  {
    client._socket.on('serverUpdate', data => {
      console.log("Receiving full world state...");

      this.synchronizer.deserialize(data);
    });
  }

  onClientDisconnect(client)
  {

  }

  onUpdate(delta)
  {
    Application.client._render.requestRender(this.entities);
  }
}

export default ClientWorld;
