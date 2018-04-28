import Application from 'Application.js';

import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import PlayerController from 'client/world/PlayerController.js';

class ClientWorld
{
  constructor()
  {
    this.entityManager = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entityManager);
    this.player = new PlayerController(canvas);
  }

  async initialize()
  {
    await this.player.initialize();
  }

  onClientConnect(client)
  {
    client._socket.on('serverRestart', data => {
      console.log("Getting world start state...");

      this.synchronizer.deserialize(data.worldData);

      const entityPlayer = this.entityManager.getEntityByID(data.playerData.entity);
      if (entityPlayer === null) throw new Error("unable to find player entity");

      this.player.entityPlayer = entityPlayer;
    });

    client._socket.on('serverUpdate', data => {
      console.log("Receiving full world state...");

      this.synchronizer.deserialize(data.worldData);
    });
  }

  onClientDisconnect(client)
  {

  }

  onUpdate(delta)
  {
    this.player.onUpdate(delta);
    Application.client._render.requestRender(this.entityManager);
  }
}

export default ClientWorld;
