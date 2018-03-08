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

  register(type, id, url = null)
  {
    if (!this.registry[type])
    {
      this.registry[type] = {}
    }
    this.registry[type][id] = new ResourceLocation(url);
  }

  unregister(type, id)
  {
    this.registry[type].delete(id);
  }

  flush(callback)
  {
    var flag = false;
    var count = 0;
    for(let type in this.registry)
    {
      let assets = this.registry[type];
      for(let id in assets)
      {
        let asset = assets[id];
        if (asset instanceof ResourceLocation)
        {
          ++count;
          console.log("LOADING (" + count + ") " + type + ":" + id + "...");
          AssetManager.fetchFileFromURL(asset.url, function(response, args) {
            let assetManager = args[0];
            let type = args[1];
            let id = args[2];
            let assets = assetManager.registry[type];
            assets[id] = response;
            console.log("...RECEIVED (" + count + ") " + type + ":" + id + "...");
            --count;
            if (flag && count == 0)
            {
              callback();
            }
          },
          [ this, type, id ]);
        }
      }
    }
    flag = true;
    if (count == 0)
    {
      callback();
    }
  }

  getAsset(type, id)
  {
    let asset = this.registry[type][id];
    if (!asset)
    {
      asset = AssetManager.fetchFileFromURL(assets[id].url);
      this.registry[type][id] = asset;
    }
    return asset;
  }

  static fetchFileFromURL(url, callback = null, args = null)
  {
    var request = new XMLHttpRequest();
    request.open('GET', url, callback != null);
    if (callback != null)
    {
      request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE)
        {
          if (request.status == 200)
          {
            let result = request.response;
            callback(result, args);
          }
    			else
    			{
    				throw new Error("Failed request: " + request.status);
    			}
        }
      }
      request.send(null);
    }
    else
    {
      request.send(null);
      if (request.status == 200)
      {
        let result = request.response;
        return result;
      }
      else
      {
        throw new Error("Failed request: " + request.status);
      }
    }
  }
}

export default AssetManager;
