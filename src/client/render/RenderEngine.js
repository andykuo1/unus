import AssetManager from 'client/render/AssetManager.js';
import Renderer from 'client/Renderer.js';

class RenderEngine
{
  constructor(app, canvas)
  {
    this._app = app;
    this._canvas = canvas;
    this._assets = new AssetManager();
    this._renderer = new Renderer(canvas);
    this._renderQueue = new Set();
  }

  async initialize()
  {
    this._app.on('applicationUpdate', this.onApplicationUpdate.bind(this));

    //TODO: Load resources...
    await this._renderer.load();
  }

  onApplicationUpdate()
  {
    //TODO: Draw!
    for(const renderable of this._renderQueue)
    {
      this._renderer.render(renderable);
    }
    this._renderQueue.clear();
  }

  requestRender(renderable)
  {
    this._renderQueue.add(renderable);
  }
}

export default RenderEngine;
