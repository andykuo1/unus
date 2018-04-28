
class SerializerRegistry
{
  constructor()
  {
    this._registry = new Map();
  }

  registerSerializableType(type, serializer)
  {
    this._registry.set(type, serializer);
  }

  unregisterSerializableType(type)
  {
    this._registry.delete(type);
  }

  getSerializerForType(type)
  {
    if (!this._registry.has(type))
    {
      throw new Error("cannot find serializer for type \'" + type + "\'");
    }
    return this._registry.get(type);
  }
}

export default SerializerRegistry;
