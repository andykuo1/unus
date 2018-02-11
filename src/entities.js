import Transform from './Transform.js';

import { Entity, EntityManager, System } from './lib/ecs.js';

class TransformSystem extends System
{
  constructor()
  {
    super("transform");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);

    entity.transform = new Transform();
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.transform;
  }
}

class TrackerSystem extends System
{
  constructor()
  {
    super("tracked");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);

    entity.guid = TrackerSystem.generateGUID();
    entity.trackers = [];
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.guid;
    delete entity.trackers;
  }

  static generateGUID()
  {
    function s4()
    {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}

class SolidSystem extends System
{
  constructor()
  {
    super("solid");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");

    entity.radius = 0.5;
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.radius;
  }
}

class RenderableSystem extends System
{
  constructor()
  {
    super("renderable");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");
  }
}

class MotionSystem extends System
{
  constructor()
  {
    super("motion");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");

    entity.motion = vec2.create();
    entity.friction = 0.1;
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.motion;
    delete entity.friction;
  }

  onUpdate()
  {
    super.onUpdate();

    for(let i in this.entities)
    {
      let entity = this.entities[i];
      entity.transform.position[0] += entity.motion[0];
      entity.transform.position[1] += entity.motion[1];

      const fric = 1.0 - entity.friction;
      entity.motion[0] *= fric;
      entity.motion[1] *= fric;

      if (entity.motion[0] < MotionSystem.MOTION_MIN && entity.motion[0] > -MotionSystem.MOTION_MIN) entity.motion[0] = 0;
      if (entity.motion[1] < MotionSystem.MOTION_MIN && entity.motion[1] > -MotionSystem.MOTION_MIN) entity.motion[1] = 0;
    }
  }
}
MotionSystem.MOTION_MIN = 0.01;

class FollowSystem extends System
{
  constructor()
  {
    super("follow");
  }

  onEntityCreate(entity)
  {
    super.onEntityCreate(entity);
    this.requireComponent(entity, "transform");
    this.requireComponent(entity, "motion");
    this.requireComponent(entity, "solid");

    entity.target = null;
    entity.distance = 1.0;
  }

  onEntityDestroy(entity)
  {
    super.onEntityDestroy(entity);

    delete entity.target;
    delete entity.distance;
  }

  onUpdate()
  {
    super.onUpdate();

    for(let i in this.entities)
    {
      var entity = this.entities[i];
      var target = entity.target;
      if (target != null)
      {
        var dx = entity.transform.position[0] - target.transform.position[0];
        var dy = entity.transform.position[1] - target.transform.position[1];
        var dx2 = dx * dx;
        var dy2 = dy * dy;
        var d = dx * dx + dy * dy;
        //TODO: COMPLETE THIS!
        entity.motion[0] += dx / d;
        entity.motion[1] += dy / d;
      }
    }
  }
}

export {
  TransformSystem,
  TrackerSystem,
  SolidSystem,
  RenderableSystem,
  MotionSystem,
  FollowSystem
}
