function Renderable()
{
  this.x = 0;
  this.y = 0;
}

Renderable.sync = {
  x: { type: 'float' },
  y: { type: 'float' }
};

export default Renderable;
