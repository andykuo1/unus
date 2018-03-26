import Frame from 'util/Frame.js';

class Application
{
  constructor()
  {
    this._frame = new Frame();
  }

  init(network, game)
  {
    this._network = network;
    this._game = game;

    this._startTime = Date.now();

    this._now = 0;
    this._then = 0;
    this._frames = 0;

    //Display frames per second
    setInterval(() => {
      console.log("FPS " + this._frames);
      this._frames = 0;
    }, 1000);

    return new Promise(function(resolve, reject) {
      resolve();
    });
  }

  update()
  {
    this._then = this._now;
    this._now = Date.now() - this._startTime;
    const delta = this._now - this._then;
    this._frames++;

    this._frame.next(this._now);

    this._game.update(this._frame);
  }

  getApplicationTime()
  {
    return this._now;
  }

  get network() { return this._network; }

  get game() { return this._game; }

  get remote() { return this._network.remote; }
}

export default new Application();
