import System from '../entity/System.js';

class TransformSystem extends System
{
  constructor()
  {

  }

  onUpdate(entityManager, frame)
  {
    super.onUpdate(entityManager, frame);
  }

  writeToGameState(entityManager, gameState)
  {
    super.writeToGameState(entityManager, gameState);
  }

  readFromGameState(entityManager, gameState)
  {
    super.readFromGameState(entityManager, gameState);
  }
}

export default TransformSystem;
