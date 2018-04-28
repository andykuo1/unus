import AssetManager from 'client/render/AssetManager.js';

class RenderEngine
{
  constructor(app, canvas)
  {
    this._app = app;
    this._canvas = canvas;
    this._assets = new AssetManager();
  }

  async initialize()
  {
    this._app.on('applicationUpdate', this.onApplicationUpdate.bind(this));

    //TODO: Load resources...
  }

  onApplicationUpdate()
  {
    //TODO: Draw!
  }
}

export default RenderEngine;
