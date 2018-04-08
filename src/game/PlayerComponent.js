function Player()
{
  this.clientID = -1;
  this.nextX = 0;
  this.nextY = 0;
  this.move = false;
}

Player.sync = {
  clientID: { type: 'integer' },
  nextX: { type: 'float' },
  nextY: { type: 'float' },
  move: { type: 'boolean' }
};

export default Player;
