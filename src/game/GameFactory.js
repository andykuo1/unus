import SynchronizedSystem from './SynchronizedSystem.js';
import NetworkEntitySystem from './NetworkEntitySystem.js';
import PlayerSystem from './PlayerSystem.js';
import MotionSystem from './MotionSystem.js';
import TransformSystem from './TransformSystem.js';
import BulletSystem from './BulletSystem.js';

import Transform from './TransformComponent.js';
import Motion from './MotionComponent.js';
import Player from './PlayerComponent.js';
import Renderable from './RenderableComponent.js';
import Bullet from './BulletComponent.js';

class GameFactory
{
  constructor()
  {
    this.entityTypes = new Map();
    this.entityManager = null;
  }

  static init(game)
  {
    this.entityManager = game.entityManager;
    game.systemManager.systems.push(new NetworkEntitySystem(game.entityManager));
    game.systemManager.systems.push(new PlayerSystem());
    game.systemManager.systems.push(new MotionSystem());
    game.systemManager.systems.push(new TransformSystem());
    game.systemManager.systems.push(new SynchronizedSystem(Renderable));
    game.systemManager.systems.push(new BulletSystem());

    GameFactory.INSTANCE.entityTypes.set('player', (entity) => {
      return entity.addComponent(Transform)
        .addComponent(Motion)
        .addComponent(Player)
        .addComponent(Renderable);
    });
    GameFactory.INSTANCE.entityTypes.set('bullet', (entity) => {
      return entity.addComponent(Transform)
        .addComponent(Bullet)
        .addComponent(Renderable);
    });
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
