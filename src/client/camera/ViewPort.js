import gl from '../mogli/gl.js';

class ViewPort
{
  constructor(canvas)
  {
    this.canvas = canvas;
  }

  update()
  {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.width, this.height);
  }

  get width()
  {
    return this.canvas.clientWidth;
  }

  get height()
  {
    return this.canvas.clientHeight;
  }
}

export default ViewPort;
