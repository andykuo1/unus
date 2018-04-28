class ModelManager
{
  constructor()
  {
    this.models = new Map();
  }

  registerModel(name, model)
  {
    this.models.set(name, model);
  }

  getModelByName(name)
  {
    return this.models.get(name);
  }
}
