import { quat } from 'gl-matrix';

import Application from 'Application.js';

import PlayerSystem from 'game/PlayerSystem.js';
import MotionSystem from 'game/MotionSystem.js';
import BulletSystem from 'game/BulletSystem.js';
import RotatingSystem from 'game/RotatingSystem.js';

import Transform from 'game/TransformComponent.js';
import Motion from 'game/MotionComponent.js';
import Player from 'game/PlayerComponent.js';
import Renderable from 'game/RenderableComponent.js';
import Bullet from 'game/BulletComponent.js';
import Rotating from 'game/RotatingComponent.js';

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
    game.systems.push(new PlayerSystem(this.entityManager));
    game.systems.push(new MotionSystem(this.entityManager));
    game.systems.push(new BulletSystem(this.entityManager));
    game.systems.push(new RotatingSystem(this.entityManager));

    Application.events.on('fireBullet', (owner, direction) => {
      const bulletSpeed = 10;
      const bulletEntity = this.entityManager.spawnEntity('bullet');
      bulletEntity.transform.x = owner.transform.x;
      bulletEntity.transform.y = owner.transform.y;
      bulletEntity.renderable.color = 0xFF00FF;
      bulletEntity.bullet.owner = owner._id;
      bulletEntity.bullet.speedx = Math.cos(direction) * bulletSpeed;
      bulletEntity.bullet.speedy = Math.sin(direction) * bulletSpeed;
    });

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
