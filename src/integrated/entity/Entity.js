class Entity
{
  constructor()
  {
    this.__init();
  }

  __init()
  {
    this._id = 0;
    this.x = 0;
    this.y = 0;
  }

  addComponent(component)
  {
    this._manager.addComponentToEntity(this, component);
    return this;
  }

  removeComponent(component)
  {
    this._manager.removeComponentFromEntity(this, component);
    return this;
  }

  clearComponents()
  {
    this._manager.clearComponentsFromEntity(this);
  }

  hasComponent(component)
  {
    return this._manager.hasComponent(this, component);
  }

  destroy()
  {
    this._manager.destroyEntity(this);
  }

  get id()
  {
    return this._id;
  }
}

export default Entity;
