import Application from 'Application.js';

import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

class ClientWorld
{
  constructor()
  {
    this.entityManager = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entityManager);

    this.player = null;
  }

  async initialize()
  {

  }

  onClientConnect(client)
  {
    console.log("Preparing environment for client...");

    this.player = client;

    client._socket.on('serverRestart', data => {
      console.log("Getting world start state...");
      console.log(data);

      //TODO: how to store this so i can interpolate?
      this.synchronizer.deserialize(data.worldData);

      const entityPlayer = this.entityManager.getEntityByID(data.playerData.entity);
      if (entityPlayer === null) throw new Error("unable to find player entity");

      this.player.onPlayerCreate(entityPlayer);
    });

    client._socket.on('serverUpdate', data => {
      console.log("Receiving full world state...");

      this.synchronizer.deserialize(data.worldData);
    });
  }

  onClientDisconnect(client)
  {
    console.log("Resetting environment for client...");

    const entityPlayer = client.player;
    this.player.onPlayerDestroy();
  }

  onUpdate(delta)
  {
    //Interpolate here...

    //Continue to extrapolate here...
    this.player.onUpdate(delta);

    Application.client._render.requestRender(this.entityManager);
  }
}

export default ClientWorld;
