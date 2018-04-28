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

  getAsset(type, id)
  {
    let asset = this.registry[type][id];
    if (!asset)
    {
      asset = AssetManager.fetchFileFromURLSync(assets[id].url);
      this.registry[type][id] = asset;
    }
    return asset;
  }

  async fetchAssets()
  {
    const promises = [];
    var flag = false;
    var count = 0;
    for(const type in this.registry)
    {
      const assets = this.registry[type];
      for(const id in assets)
      {
        const asset = assets[id];
        if (asset instanceof ResourceLocation)
        {
          ++count;
          console.log("LOADING (" + count + ") " + type + ":" + id + "...");
          const promise = AssetManager.fetchFileFromURL(asset.url)
            .then(response => {
              console.log("...RECEIVED (" + count + ") " + type + ":" + id + "...");
              assets[id] = response;
              --count;
            })
            .catch(e => { throw new Error(e); });
          promises.push(promise);
        }
      }
    }

    return Promise.all(promises);
  }

  static async fetchFileFromURL(url)
  {
    return new Promise(function(resolve, reject) {
      const request = new XMLHttpRequest();
      request.timeout = 5000;
      request.onreadystatechange = function(e) {
        if (request.readyState == XMLHttpRequest.DONE)
        {
          if (request.status == 200)
          {
            resolve(request.response);
          }
          else
          {
            reject(request.status);
          }
        }
      };
      request.ontimeout = function() {
        reject('timeout');
      };
      request.open('GET', url, true);
      request.send(null);
    });
  }

  static fetchFileFromURLSync(url)
  {
    const request = new XMLHttpRequest();
    request.timeout = 5000;
    request.open('GET', url, false);
    request.send(null);
    if (request.status == 200)
    {
      return request.response;
    }
    else
    {
      throw new Error(request.status);
    }
  }
}

export default AssetManager;
