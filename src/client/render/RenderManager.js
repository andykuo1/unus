
/**
 * Manages and dispatches render calls to the necessary layers.
 * Must add(RenderLayer) to this.layers before load() is called, the order in
 * which it is added is also the order it will be loaded, bound, rendered, etc.
 */
class RenderManager
{
  constructor()
  {
    this.layers = [];
  }

  addLayer(layer)
  {
    this.layers.add(layer);
    return this; //For method chaining
  }

  removeLayer(layer)
  {
    this.layers.remove(layer);
    return this; //For method chaining
  }

  load(gl)
  {
    let len = this.layers.length;
    for(let i = 0; i < len; ++i)
    {
      //TODO: this should be in a try block to properly load all other things
      this.layers[i].load(gl);
    }
  }

  unload(gl)
  {
    for(let i = this.layers.length; i >= 0; --i)
    {
      //TODO: this should be in a try block to properly unload all other things
      this.layers[i].unload(gl);
    }
  }

  render(gl, worldstate)
  {
    let len = this.layers.length;
    for(let i = 0; i < len; ++i)
    {
      this.layers[i].bind(gl);
      //TODO: This should be in a try block, since it should be guaranteed to unbind
      {
        let layer = this.layers[i];
        layer.render(gl, worldstate);
      }
      this.layers[i].unbind(gl);
    }
  }
}

export default RenderManager;
