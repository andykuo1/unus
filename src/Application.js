import Eventable from 'util/Eventable.js';
import NetworkHandler from 'shared/NetworkHandler.js';

const DEBUG_PRINT_FPS = true;

const MILLIS_PER_SECOND = 1000;
const SECOND_PER_MILLIS = 0.001;

//applicationStart - Called when application starts, before updating
//applicationUpdate - Called each tick
//applicationStop - Called when application stops, after updating
class Application
{
  constructor()
  {
    this._startTime = -1;
    this._stopTime = -1;
    this._now = -1;
    this._then = -1;
    this._delta = 0;
    this._frames = 0;

    this._remote = typeof window != 'undefined' && window.document;

    this._debug_interval = null;
    this._update_interval = null;

    this.client = null;
    this.server = null;
    this.network = new NetworkHandler();
  }

  start()
  {
    if (this._startTime !== -1)
    {
      throw new Error("Application already started");
    }

    this._stopTime = -1;
    this._startTime = Date.now();
    this._now = 0;
    this._then = 0;
    this._delta = 0;
    this._frames = 0;

    if (this._remote && window.requestAnimationFrame)
    {
      const callback = () => {
        this.update();
        if (this._stopTime !== -1) return;
        window.requestAnimationFrame(callback);
      };
      window.requestAnimationFrame(callback);
    }
    else
    {
      const networkSide = this.server || this.client;
      if (networkSide.tickRate <= 0)
      {
        throw new Error("Cannot start application with tick rate <= 0");
      }

      this._update_interval = setInterval(this.update.bind(this), networkSide.tickRate);
    }

    if (DEBUG_PRINT_FPS)
    {
      this._debug_interval = setInterval(() => {
        console.log("FPS " + this._frames);
        this._frames = 0;
      }, MILLIS_PER_SECOND);
    }

    this.emit('applicationStart');
  }

  stop()
  {
    this._stopTime = this._now;

    if (this._debug_interval !== null)
    {
      clearInterval(this._debug_interval);
      this._debug_interval = null;
    }

    if (this._update_interval !== null)
    {
      clearInterval(this._update_interval);
      this._update_interval = null;
    }

    this.emit('applicationStop');

    if (this._remote && window.close)
    {
      window.close();
    }
    else
    {
      process.exit(0);
    }
  }

  update()
  {
    this._then = this._now;
    this._now = Date.now() - this._startTime;
    this._delta = (this._now - this._then) * SECOND_PER_MILLIS;
    this._frames++;

    this.emit('applicationUpdate', this._delta);
  }

  getApplicationTime()
  {
    return this._now;
  }

  getFrameTime()
  {
    return this._delta;
  }

  isRemote()
  {
    return this._remote;
  }
}

Object.assign(Application.prototype, Eventable);

export default new Application();
