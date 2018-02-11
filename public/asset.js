class ResourceLocation
{
  constructor(filename)
  {
    this._filename = filename;
  }

  get url()
  {
    return this._filename;
  }
}

class AssetManager
{
  constructor()
  {
    this.registry = {};
  }

  destroy()
  {
    this.registry.clear();
  }

  register(type, id, resourceLocation = null)
  {
    if (!this.registry[type])
    {
      this.registry[type] = {}
    }
    this.registry[type][id] = resourceLocation;
  }

  unregister(type, id)
  {
    this.registry[type].delete(id);
  }

  flush()
  {
    for(let type in this.registry)
    {
      var assets = this.registry[type];
      for(let id in assets)
      {
        if (assets[id] instanceof ResourceLocation)
        {
          fetchFileFromURL(assets[id].url, function(response) {
            assets[id] = response;
          });
        }
      }
    }
  }

  getAsset(type, id)
  {
    let asset = this.registry[type][id];
    if (!asset)
    {
      asset = fetchFileFromURL(assets[id].url);
      this.registry[type][id] = asset;
    }
    return asset;
  }
}

export {
  ResourceLocation,
  AssetManager
}
