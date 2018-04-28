function Renderable()
{
  this.model = 'square';
  this.color = 0xFFFFFF;
  this.visible = true;
}

Renderable.sync = {
  model: { type: 'string' },
  color: { type: 'integer' },
  visible: { type: 'boolean' }
};

export default Renderable;
