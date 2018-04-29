import Application from 'Application.js';
import Reflection from 'util/Reflection.js';

import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import * as Serializables from 'shared/serializable/Serializables.js';
import * as MathHelper from 'util/MathHelper.js';

class ClientWorld
{
  constructor()
  {
    this.entityManager = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entityManager);

    this.player = null;
    this.interpolationTime = 0;
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

      //Interpolation here...
      this.interpolationTime = 0;

      //TODO: how to store this so i can interpolate?
      this.synchronizer.deserialize(data.worldData);

      const entityPlayer = this.entityManager.getEntityByID(data.playerData.entity);
      if (entityPlayer === null) throw new Error("unable to find player entity");

      this.player.onPlayerCreate(entityPlayer);
    });

    client._socket.on('serverUpdate', data => {
      if (data.worldData.isComplete)
      {
        console.log("Receiving complete world state...");
      }
      else {
        console.log("Receiving world state...");
      }

      //Interpolation here...
      this.interpolationTime = 0;

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
    this.interpolationTime += delta;
    for(const [componentClass, entityList] of this.entityManager.components)
    {
      if (!componentClass.hasOwnProperty('sync')) continue;
      const sync = componentClass.sync;

      for(const entity of entityList)
      {
        const component = entity[Reflection.getClassName(componentClass)];
        for(const propertyName of Object.keys(sync))
        {
          const syncOpts = sync[propertyName];
          if (syncOpts.hasOwnProperty('blend'))
          {
            const propertyType = syncOpts.type;
            const serializer = this.synchronizer.serializers.getSerializerForType(propertyType);
            if (!serializer.interpolate)
            {
              throw new Error("serializer \'" + propertyType + "\' does not support interpolation");
            }
            serializer.interpolate(propertyName, syncOpts, this.interpolationTime * 10, component);
          }
        }
      }
    }

    //Continue to extrapolate here...
    this.player.onUpdate(delta);

    Application.client._render.requestRender(this.entityManager);
  }
}

export default ClientWorld;
