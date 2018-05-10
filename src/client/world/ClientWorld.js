import Application from 'Application.js';
import { vec3 } from 'gl-matrix';
import Reflection from 'util/Reflection.js';

import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import * as Components from 'shared/entity/component/Components.js';
import * as Serializables from 'shared/serializable/Serializables.js';
import * as MathHelper from 'util/MathHelper.js';

import MotionSystem from 'shared/system/MotionSystem.js';
import RotatorSystem from 'shared/system/RotatorSystem.js';

const INTERPOLATION_DELTA_FACTOR = 10;
const WORLD_TICK_FACTOR = 10;

class ClientWorld
{
  constructor()
  {
    this.entityManager = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entityManager);

    this._serverWorldTicks = 0;
    this._prevWorldTicks = 0;
    this._worldTicks = 0;
    this.player = null;
    this.speed = 1.0;

    this.clientInputDelay = 0;
    this.clientStates = [];

    this.motionSystem = new MotionSystem();
    this.rotatorSystem = new RotatorSystem();
  }

  async initialize()
  {

  }

  onClientConnect(client)
  {
    console.log("Preparing environment for client...");

    this.player = client;

    client._socket.on('serverRestart', data => {
      if (this._serverWorldTicks >= data.worldTicks)
      {
        console.log("Received outdated world state, skipping...");
        return;
      }
      this._serverWorldTicks = data.worldTicks;

      console.log("Getting world start state...");

      this.synchronizer.deserialize(data.worldData);

      const entityPlayer = this.entityManager.getEntityByID(data.playerData.entity);
      if (entityPlayer === null) throw new Error("unable to find player entity");

      this.player.onPlayerCreate(entityPlayer);

      //Extrapolate...
      this.player.onEntityReset(this._serverWorldTicks);
      //this.resetClientStates(this._serverWorldTicks, entityPlayer);
    });

    client._socket.on('serverUpdate', data => {
      if (this._serverWorldTicks >= data.worldTicks)
      {
        console.log("Received outdated world state, skipping...");
        return;
      }
      this._serverWorldTicks = data.worldTicks;

      if (data.worldData.isComplete)
      {
        console.log("Receiving complete world state...");
      }
      else
      {
        console.log("Receiving world state...");
      }

      this.synchronizer.deserialize(data.worldData);

      //Extrapolate...
      this.player.onEntityReset(this._serverWorldTicks);
      //this.resetClientStates(this._serverWorldTicks, this.player._player);
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
    //Update world to server time
    if (this._serverWorldTicks > this._worldTicks)
    {
      let elapsedWorldTicks = this._serverWorldTicks - this._worldTicks;
      if (elapsedWorldTicks > 10)
      {
        --elapsedWorldTicks;
        console.log("WARNING: Skipping ahead " + elapsedWorldTicks + " ticks for client world update...");
        this._worldTicks += Math.trunc(elapsedWorldTicks);
      }
      while (this._serverWorldTicks >= this._worldTicks + 1)
      {
        this.onWorldUpdate();
        ++this._worldTicks;
      }
    }

    //Update world to current time
    this._worldTicks += delta * WORLD_TICK_FACTOR;
    let elapsedWorldTicks = this._worldTicks - this._prevWorldTicks;
    if (elapsedWorldTicks > 10)
    {
      --elapsedWorldTicks;
      console.log("WARNING: Skipping ahead " + elapsedWorldTicks + " ticks for world update...");
      this._prevWorldTicks += Math.trunc(elapsedWorldTicks);
    }

    while (this._worldTicks >= this._prevWorldTicks + 1)
    {
      this.onWorldUpdate();
      ++this._prevWorldTicks;
    }

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

    //Client side logics...
    this.player.onUpdate(1);

    Application.client._render.requestRender(this.entityManager);
  }

  onWorldUpdate()
  {

  }

  /*
  resetClientStates(worldTicks, player)
  {
    //Remove all outdated input states...
    let i = this.clientStates.length;
    while(this.clientStates.length > 0 && this.clientStates[0].worldTicks < worldTicks)
    {
      this.clientStates.shift();
    }
    console.log(i + " => " + this.clientStates.length);
    vec3.copy(player.Transform.position, player.Transform.nextPosition);
    this.applyClientStates(worldTicks, player);
  }

  applyClientStates(worldTicks, player)
  {
    const len = this.clientStates.length;

    let ticks = worldTicks;
    for(let i = 0; i < len; ++i)
    {
      const clientState = this.clientStates[i];
      for(let j = clientState.worldTicks - ticks; j > 0; --j)
      {
        this.applyClientState(player, clientState);
        ticks++;
      }
    }
  }

  applyClientState(player, inputState, delta)
  {
    //NOTE: from client logic
    if (inputState.move)
    {
      let dx = inputState.targetX - player.Transform.nextPosition[0];
      let dy = inputState.targetY - player.Transform.nextPosition[1];
      const dist = dx * dx + dy * dy;
      if (dist > 1)
      {
        const angle = Math.atan2(dy, dx);
        player.Motion.motionX = Math.cos(angle) * this.speed;
        player.Motion.motionY = Math.sin(angle) * this.speed;
      }
    }

    //NOTE: from world component logic
    this.motionSystem.updateEntity(player, 1);
  }
  */

  get worldTicks() { return Math.trunc(this._worldTicks); }
  get serverTicks() { return Math.trunc(this._serverWorldTicks); }
}

export default ClientWorld;
