import Application from 'Application.js';
import Reflection from 'util/Reflection.js';

import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import * as Serializables from 'shared/serializable/Serializables.js';
import * as MathHelper from 'util/MathHelper.js';

const INTERPOLATION_DELTA_FACTOR = 10;

class ClientWorld
{
  constructor()
  {
    this.entityManager = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entityManager);

    this.serverWorldTicks = 0;
    this.worldTicks = 0;
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
      if (this.serverWorldTicks >= data.worldTicks)
      {
        console.log("Received outdated world state, skipping...");
        return;
      }
      this.serverWorldTicks = data.worldTicks;

      console.log("Getting world start state...");

      this.synchronizer.deserialize(data.worldData);

      const entityPlayer = this.entityManager.getEntityByID(data.playerData.entity);
      if (entityPlayer === null) throw new Error("unable to find player entity");

      this.player.onPlayerCreate(entityPlayer);
    });

    client._socket.on('serverUpdate', data => {
      if (this.serverWorldTicks >= data.worldTicks)
      {
        console.log("Received outdated world state, skipping...");
        return;
      }
      this.serverWorldTicks = data.worldTicks;

      if (data.worldData.isComplete)
      {
        console.log("Receiving complete world state...");
      }
      else
      {
        console.log("Receiving world state...");
      }

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
    //TODO: world ticks should match server world ticks, unless extrapolating...
    this.worldTicks++;

    //Interpolate properties...
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
            serializer.interpolate(propertyName, syncOpts, delta * INTERPOLATION_DELTA_FACTOR, component);
          }
        }
      }
    }

    //Send client input...
    Application.network.sendTo(this.player._socket,
      'clientInput', {
        targetX: this.player.targetX,
        targetY: this.player.targetY
      });

    //Continue to extrapolate here...
    this.player.onUpdate(delta);

    Application.client._render.requestRender(this.entityManager);
  }
}

export default ClientWorld;
