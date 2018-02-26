/**
 * Used by RenderManager to render worldstate.
 */
class RenderLayer
{
  load(gl)
  {

  }

  unload(gl)
  {
    //TODO: Should be guaranteed to be called if load(gl) is called.
  }

  bind(gl)
  {

  }

  unbind(gl)
  {
    //TODO: Should be guaranteed to be called if bind(gl) is called.
  }

  render(gl, worldstate)
  {

  }
}

export default RenderLayer;
