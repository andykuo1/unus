import SynchronizedSystem from './SynchronizedSystem.js';
import NetworkEntitySystem from './NetworkEntitySystem.js';
import PlayerSystem from './PlayerSystem.js';
import MotionSystem from './MotionSystem.js';
import TransformSystem from './TransformSystem.js';
import BulletSystem from './BulletSystem.js';
import RotatingSystem from './RotatingSystem.js';

import Transform from './TransformComponent.js';
import Motion from './MotionComponent.js';
import Player from './PlayerComponent.js';
import Renderable from './RenderableComponent.js';
import Bullet from './BulletComponent.js';
import Rotating from './RotatingComponent.js';

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

    GameFactory.INSTANCE.entityTypes.set('player', (entity) => {
      return entity
        .addComponent(Transform)
        .addComponent(Motion)
        .addComponent(Player)
        .addComponent(Renderable);
    });
    GameFactory.INSTANCE.entityTypes.set('bullet', (entity) => {
      return entity
        .addComponent(Transform)
        .addComponent(Bullet)
        .addComponent(Renderable);
    });
    GameFactory.INSTANCE.entityTypes.set('star', (entity) => {
      return entity
        .addComponent(Transform)
        .addComponent(Renderable)
        .addComponent(Rotating);
    });
  }

  static createWorld(game)
  {
    if (GameFactory.INSTANCE.entityManager == null) throw new Error('must init first');

    //populate with random
    for(let i = 0; i < 100; ++i)
    {
      const entity = GameFactory.createEntity('star');
      entity.transform.x = Math.random() * 100 - 50;
      entity.transform.y = Math.random() * 100 - 50;
      entity.transform.scale[0] = 0.1;
      entity.transform.scale[1] = 0.1;
      entity.renderable.color = 0xF2A900;
    }
  }

  static createEntity(entityType)
  {
    const entityConstructor = GameFactory.INSTANCE.entityTypes.get(entityType);
    const entity = GameFactory.INSTANCE.entityManager.createEntity();
    entityConstructor(entity);
    return entity;
  }
}

GameFactory.INSTANCE = new GameFactory();

export default GameFactory;
