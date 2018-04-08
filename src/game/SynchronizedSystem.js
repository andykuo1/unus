import System from 'integrated/entity/System.js';
import Reflection from 'util/Reflection.js';

class SynchronizedSystem extends System
{
  constructor(entityManager, component)
  {
    super(entityManager);
    this.component = component;
    this.componentName = Reflection.getClassVarName(this.component);
  }

  onEntityUpdate(entity, delta)
  {

  }

  onUpdate(entityManager, delta)
  {
    const entities = entityManager.getEntitiesByComponent(this.component);
    for(const entity of entities)
    {
      this.onEntityUpdate(entity, delta);
    }
  }
}

export default SynchronizedSystem;
