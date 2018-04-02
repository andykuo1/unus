import Frame from 'util/Frame.js';
import EventHandler from 'util/EventHandler.js';

class Application
{
  constructor()
  {
    this._frame = new Frame();
  }

  async init(network, game)
  {
    this._network = network;
    this._game = game;
    this._events = new EventHandler();

    this._startTime = Date.now();

    this._now = 0;
    this._then = 0;
    this._delta = 0;
    this._frames = 0;

    //Display frames per second
    setInterval(() => {
      console.log("FPS " + this._frames);
      this._frames = 0;
    }, 1000);

    await this._game.start();
  }

  update()
  {
    this._then = this._now;
    this._now = Date.now() - this._startTime;
    this._delta = (this._now - this._then) * 0.001;
    this._frames++;

    //TODO: slowly get rid of frame and use this._delta
    this._frame.next(this._now);
    this._game.update(this._frame);

    this._events.emit('update', this._delta);
  }

  getFrameTime()
  {
    return this._delta;
  }

  getApplicationTime()
  {
    return this._now;
  }

  isRemote()
  {
    return this._network.remote;
  }

  get network() { return this._network; }

  get game() { return this._game; }

  get events() { return this._events; }
}

export default new Application();
