function Transform()
{
  this.x = 0;
  this.y = 0;
  this.position = [0, 0, 0];
  this.rotation = [0, 0, 0, 1];
  this.scale = [1, 1, 1];
}

Transform.sync = {
  x: { type: 'float' },
  y: { type: 'float' },
  position: { type: 'array',
    elements: { type: 'float' } },
  rotation: { type: 'array',
    elements: { type: 'float' } },
  scale: { type: 'array',
    elements: { type: 'float' } }
};

export default Transform;
