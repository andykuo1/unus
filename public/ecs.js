class Entity
{
  //static _count;

  constructor()
  {
    //this.id = _count++;
    this.components = {};
  }

  addComponent(component)
  {
    this.components[component.name] = component;
    return this;//For method chaining
  }

  removeComponent(name)
  {
    delete this.components[name];
    return this;//For method chaining
  }
}
