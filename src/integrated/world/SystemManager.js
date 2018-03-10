
import SynchronizedSystem from './SynchronizedSystem.js';
import NetworkEntitySystem from './NetworkEntitySystem.js';
import PlayerSystem from './PlayerSystem.js';
import MotionSystem from './MotionSystem.js';
import TransformSystem from './TransformSystem.js';
import BulletSystem from './BulletSystem.js';

import Renderable from './RenderableComponent.js';

class SystemManager
{
  constructor()
  {
    this.systems = [];
  }

  init(entityManager)
  {
    this.systems.push(new NetworkEntitySystem(entityManager));
    this.systems.push(new PlayerSystem());
    this.systems.push(new MotionSystem());
    this.systems.push(new TransformSystem());
    this.systems.push(new SynchronizedSystem(Renderable));
    this.systems.push(new BulletSystem());
  }

  update(entityManager, frame)
  {
    for(const system of this.systems)
    {
      system.onUpdate(entityManager, frame);
    }
  }

  updateInput(inputState, targetEntity)
  {
    for(const system of this.systems)
    {
      system.onInputUpdate(targetEntity, inputState);
    }
  }

  captureSystemStates(entityManager, dst)
  {
    for(const system of this.systems)
    {
      system.writeToGameState(entityManager, dst);
    }
  }

  resetSystemStates(entityManager, gameState)
  {
    for(const system of this.systems)
    {
      system.readFromGameState(entityManager, gameState);
    }
  }
}

export default SystemManager;
