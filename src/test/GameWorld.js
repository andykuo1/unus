import Application from 'Application.js';

import SystemMotion from 'test/SystemMotion.js';

import ComponentTransform from 'test/ComponentTransform.js';
import ComponentRenderable from 'test/ComponentRenderable.js';

class GameWorld
{
  constructor()
  {
    this.entityManager = null;
  }

  init(game)
  {
    this.entityManager = game.world.entityManager;

    this.entityManager.addSystem(new SystemMotion());

    this.entityManager.registerEntity('player', function() {
      this.addComponent(ComponentTransform);
      this.addComponent(ComponentRenderable);
      this.renderable.color = 0xFF00FF;
    });

    this.entityManager.registerEntity('star', function() {
      this.addComponent(ComponentTransform);
      this.addComponent(ComponentRenderable);
    });
  }

  create(game)
  {
    if (Application.isRemote()) throw new Error('must be server-side');
    if (this.entityManager == null) throw new Error('must init first');

    //populate with random
    for(let i = 0; i < 100; ++i)
    {
      const entity = this.entityManager.spawnEntity('star');
      entity.transform.x = Math.random() * 100 - 50;
      entity.transform.y = Math.random() * 100 - 50;
    }
  }
}

export default new GameWorld();
