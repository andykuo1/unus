import { quat } from 'gl-matrix';

import SynchronizedSystem from 'game/SynchronizedSystem.js';
import NetworkEntitySystem from 'game/NetworkEntitySystem.js';
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

  static init(game)
  {
    GameFactory.INSTANCE.entityManager = game.entityManager;
    game.systemManager.systems.push(new NetworkEntitySystem(game.entityManager));
    game.systemManager.systems.push(new PlayerSystem());
    game.systemManager.systems.push(new MotionSystem());
    game.systemManager.systems.push(new TransformSystem());
    game.systemManager.systems.push(new SynchronizedSystem(Renderable));
    game.systemManager.systems.push(new BulletSystem());
    game.systemManager.systems.push(new RotatingSystem());
    game.systemManager.systems.push(new FollowSystem());

    GameFactory.INSTANCE.entityTypes.set('player', (entity) => {
      return entity
        .addComponent(Transform)
        .addComponent(Renderable)
        .addComponent(Motion)
        .addComponent(Player);
    });
    GameFactory.INSTANCE.entityTypes.set('bullet', (entity) => {
      return entity
        .addComponent(Transform)
        .addComponent(Renderable)
        .addComponent(Bullet);
    });
    GameFactory.INSTANCE.entityTypes.set('star', (entity) => {
      return entity
        .addComponent(Transform)
        .addComponent(Renderable)
        .addComponent(Rotating);
    });
    GameFactory.INSTANCE.entityTypes.set('cart', (entity) => {
      return entity
        .addComponent(Transform)
        .addComponent(Renderable)
        .addComponent(Follow);
    });
  }

  static createWorld(game)
  {
    if (game.isRemote()) throw new Error('must be server-side');
    if (GameFactory.INSTANCE.entityManager == null) throw new Error('must init first');

    //populate with random
    for(let i = 0; i < 100; ++i)
    {
      const entity = GameFactory.createEntity('star');
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

  static createEntity(entityType)
  {
    const entity = GameFactory.INSTANCE.entityManager.createEntity(null, 2);
    const entityConstructor = GameFactory.INSTANCE.entityTypes.get(entityType);
    entityConstructor(entity);
    return entity;
  }
}

GameFactory.INSTANCE = new GameFactory();

export default GameFactory;
