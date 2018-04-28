function Renderable()
{
  this.renderType = 'box';
  this.visible = true;
  this.color = 0xFFFFFF;
}

Renderable.sync = {
  renderType: { type: 'string' },
  visible: { type: 'boolean' },
  color: { type: 'integer' }
};

export default Renderable;
