import Application from 'Application.js';
import { quat } from 'gl-matrix';

import EntityManager from 'shared/entity/EntityManager.js';
import EntitySynchronizer from 'shared/entity/EntitySynchronizer.js';

import * as MathHelper from 'util/MathHelper.js';
import * as Components from 'shared/entity/component/Components.js';

import MotionSystem from 'shared/system/MotionSystem.js';
import RotatorSystem from 'shared/system/RotatorSystem.js';
import DecayOverTimeSystem from 'shared/system/DecayOverTimeSystem.js';

const ENTITY_SYNC_TICKS = 20;
const WORLD_TICK_FACTOR = 10;

class World
{
  constructor(serverEngine)
  {
    this.entityManager = new EntityManager();
    this.synchronizer = new EntitySynchronizer(this.entityManager);
    this.entitySyncTimer = ENTITY_SYNC_TICKS;

    this.forceFullUpdate = true;
    this._prevWorldTicks = 0;
    this._worldTicks = 0;

    this.motionSystem = new MotionSystem();
    this.rotatorSystem = new RotatorSystem();
    this.decayOverTimeSystem = new DecayOverTimeSystem();
  }

  async initialize()
  {
    this.entityManager.registerEntity('player', function() {
      this.addComponent(Components.Transform);
      this.addComponent(Components.Renderable);
      this.addComponent(Components.Motion);
      this.Renderable.color = 0xFFFFFF;
    });

    this.entityManager.registerEntity('bullet', function() {
      this.addComponent(Components.Transform);
      this.addComponent(Components.Renderable);
      this.addComponent(Components.Motion);
      this.addComponent(Components.DecayOverTime);
      this.Renderable.color = 0xFF00FF;
    });

    this.entityManager.registerEntity('star', function() {
      this.addComponent(Components.Transform);
      this.addComponent(Components.Renderable);
      this.addComponent(Components.Rotator);
      this.Renderable.color = 0xF2A900;
    });

    //populate with random
    for(let i = 0; i < 100; ++i)
    {
      const entity = this.entityManager.spawnEntity('star');
      entity.Transform.position[0] = Math.random() * 100 - 50;
      entity.Transform.position[1] = Math.random() * 100 - 50;
      const scale = 0.2 + 0.1 * Math.random();
      entity.Transform.scale[0] = scale;
      entity.Transform.scale[1] = scale;
      quat.rotateZ(entity.Transform.rotation, entity.Transform.rotation, Math.random() * Math.PI);
      entity.Rotator.speed = Math.random() + 1;
    }
  }

  onClientConnect(client)
  {
    console.log("Preparing environment for client...");

    const entity = this.entityManager.spawnEntity('player');
    client.onPlayerCreate(entity);

    this.forceFullUpdate = true;
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
    //Update world
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

    //Send world state update to clients and full updates every few ticks
    const payload = {};
    const fullUpdate = this.forceFullUpdate || --this.entitySyncTimer <= 0;
    if (fullUpdate)
    {
      console.log("Sending complete world state...");
      this.entitySyncTimer = ENTITY_SYNC_TICKS;
      this.forceFullUpdate = false;
    }
    payload.worldData = this.synchronizer.serialize(fullUpdate);
    payload.worldTicks = this.worldTicks;

    //Send to all clients
    for(const client of Application.server._clients.values())
    {
      payload.playerData = {
        entity: client.player.id
      };

      //Send server update
      if (client._restart)
      {
        client._socket.emit('serverRestart', payload);
        client._restart = false;
      }
      else
      {
        client._socket.emit('serverUpdate', payload);
      }
    }
  }

  onWorldUpdate()
  {
    //Update motion logic
    this.motionSystem.update(this.entityManager, 1);

    //Update rotator logic
    this.rotatorSystem.update(this.entityManager, 1);

    //Update decay over time logic
    this.decayOverTimeSystem.update(this.entityManager, 1);
  }

  get worldTicks() { return Math.trunc(this._worldTicks); }
}

export default World;
