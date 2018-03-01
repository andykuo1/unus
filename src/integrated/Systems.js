import EntitySystem from './entity/EntitySystem.js';

class TransformSystem extends EntitySystem
{
  constructor(id)
  {
    super(id);
  }

  encodeEntityData(src, dst)
  {
    super.encodeEntityData(src, dst);
    dst.x = src.x;
    dst.y = src.y;
  }

  decodeEntityData(src, dst)
  {
    super.decodeEntityData(src, dst);
    dst.x = src.x;
    dst.y = src.y;
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    entity.x = 0;
    entity.y = 0;
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);
    delete entity.x;
    delete entity.y;
  }

  onUpdate()
  {
    super.onUpdate();
  }
}

export SynchronizedSystem;
export TransformSystem;
