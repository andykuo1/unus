class EntityIterator
{
  constructor(entityManager)
  {
    this.entityManager = entityManager;
    this.ands = [];
    this.nots = [];
    this.src = null;

    this.entities = this.entityManager.entities || [];
    this.index = 0;
  }

  and(component)
  {
    if (this.src == null)
    {
      this.src = component;
      this.entities = this.entityManager.components.get(this.src) || [];
    }
    else
    {
      this.ands.push(component);
    }
  }

  not(component)
  {
    this.nots.push(component);
  }

  [Symbol.iterator]()
  {
    return {
      next: () => {
        while (this.index < this.entities.length)
        {
          const entity = this.entities[this.index++];

          let flag = false;
          for(const component of this.ands)
          {
            if (!entity.hasComponent(component))
            {
              flag = true;
              break;
            }
          }
          if (flag) continue;
          for(const component of this.nots)
          {
            if (entity.hasComponent(component))
            {
              flag = true;
              break;
            }
          }
          if (flag) continue;

          return {
            value: entity,
            done: false
          };
        }

        this.index = 0;
        return {
          done:true
        };
      }
    }
  }
}

export default EntityIterator;
