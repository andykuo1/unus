import { quat } from 'gl-matrix';

import Application from 'Application.js';

import SynchronizedSystem from 'game/SynchronizedSystem.js';
import PlayerSystem from 'game/PlayerSystem.js';
import MotionSystem from 'game/MotionSystem.js';
import TransformSystem from 'game/TransformSystem.js';
import BulletSystem from 'game/BulletSystem.js';
import RotatingSystem from 'game/RotatingSystem.js';
import FollowSystem from 'game/FollowSystem.js';

import Transform from 'game/TransformComponent.js';
import Motion from 'game/MotionComponent.js';
import Player from 'game/PlayerComponent.js';
import Renderable from 'game/RenderableComponent.js';
import Bullet from 'game/BulletComponent.js';
import Rotating from 'game/RotatingComponent.js';
import Follow from 'game/FollowComponent.js';

class GameFactory
{
  constructor()
  {
    this.entityTypes = new Map();
    this.entityManager = null;
  }

  init(game)
  {
    this.entityManager = game.entityManager;
    game.systemManager.systems.push(new PlayerSystem(this.entityManager));
    game.systemManager.systems.push(new MotionSystem(this.entityManager));
    game.systemManager.systems.push(new TransformSystem(this.entityManager));
    game.systemManager.systems.push(new SynchronizedSystem(this.entityManager, Renderable));
    game.systemManager.systems.push(new BulletSystem(this.entityManager));
    game.systemManager.systems.push(new RotatingSystem(this.entityManager));
    game.systemManager.systems.push(new FollowSystem(this.entityManager));

    this.entityManager.registerEntity('player', function(){
      this.addComponent(Transform);
      this.addComponent(Renderable);
      this.addComponent(Motion);
      this.addComponent(Player);
    });

    this.entityManager.registerEntity('bullet', function() {
      this.addComponent(Transform);
      this.addComponent(Renderable);
      this.addComponent(Bullet);
    });
    this.entityManager.registerEntity('star', function() {
      this.addComponent(Transform);
      this.addComponent(Renderable);
      this.addComponent(Rotating);
    });
    this.entityManager.registerEntity('cart', function() {
      this.addComponent(Transform);
      this.addComponent(Renderable);
      this.addComponent(Follow);
    });
  }

  createWorld(game)
  {
    if (Application.isRemote()) throw new Error('must be server-side');
    if (this.entityManager == null) throw new Error('must init first');

    //populate with random
    for(let i = 0; i < 100; ++i)
    {
      const entity = this.entityManager.spawnEntity('star');
      entity.transform.x = Math.random() * 100 - 50;
      entity.transform.y = Math.random() * 100 - 50;
      const scale = 0.2 + 0.1 * Math.random();
      entity.transform.scale[0] = scale;
      entity.transform.scale[1] = scale;
      quat.rotateZ(entity.transform.rotation, entity.transform.rotation, Math.random() * Math.PI);
      entity.renderable.color = 0xF2A900;
      entity.rotating.speed = Math.random() + 1;
    }
  }
}

export default new GameFactory();
