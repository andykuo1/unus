import Eventable from 'util/Eventable.js';

//mouseup
//mousedown
//mouseclick
//mousewheel

class Mouse
{
  /**
   * constructor - Creates and registers this with the element to listen for
   * mouse events
   *
   * @param {type} canvas  The canvas to calculate appropriate mouse position
   * @param {type} element The element to listen for mouse events
   */
  constructor(canvas, element)
  {
    this.x = 0;
    this.y = 0;
    this.scrollX = 0;
    this.scrollY = 0;

    this._canvas = canvas;
    this._element = element;

    this._mouseup = this.onMouseUp.bind(this);
    this._mousedown = this.onMouseDown.bind(this);
    this._mouseclick = this.onMouseClick.bind(this);
    this._mousemove = this.onMouseMove.bind(this);
    this._wheel = this.onMouseWheel.bind(this);
    this._touchstart = this.onTouchStart.bind(this);

    this._touchmove = this.onTouchMove.bind(this);
    this._touchstop = this.onTouchStop.bind(this);

    this._contextmenu = event => {
      event.preventDefault();
      return false;
    };

    this._element.addEventListener('contextmenu', this._contextmenu, false);
    this._element.addEventListener('mouseup', this._mouseup);
    this._element.addEventListener('mousedown', this._mousedown);
    this._element.addEventListener('click', this._mouseclick);
    this._element.addEventListener('mousemove', this._mousemove);
    this._element.addEventListener('wheel', this._wheel);
    this._element.addEventListener('touchstart', this._touchstart);
  }

  destroy()
  {
    this._element.removeEventListener('contextmenu', this._contextmenu);
    this._element.removeEventListener('mouseup', this._mouseup);
    this._element.removeEventListener('mousedown', this._mousedown);
    this._element.removeEventListener('click', this._mouseclick);
    this._element.removeEventListener('mousemove', this._mousemove);
    this._element.removeEventListener('wheel', this._wheel);
    this._element.removeEventListener('touchstart', this._touchstart);
  }

  onMouseUp(event)
  {
    this.onMouseMove(event);
    this.emit('mouseup', this, event.which);
  }

  onMouseDown(event)
  {
    this.onMouseMove(event);
    this.emit('mousedown', this, event.which);
  }

  onMouseClick(event)
  {
    this.onMouseMove(event);
    this.emit('mouseclick', this, event.which);
  }

  onMouseWheel(event)
  {
    this.scrollX += event.deltaX;
    this.scrollY += event.deltaY;
    this.emit('mousewheel', this, event.deltaX, event.deltaY);
  }

  onMouseMove(event)
  {
    const screen = this._canvas.getBoundingClientRect();
    this.x = event.clientX - screen.left;
    this.y = event.clientY - screen.top;
  }

  onTouchStart(event)
  {
    const target = event.touches[0].target;
    target.addEventListener('touchmove', this._touchmove);
    target.addEventListener('touchend', this._touchstop);
    target.addEventListener('touchcancel', this._touchstop);
  }

  onTouchStop(event)
  {
    const target = event.touches[0].target;
    target.removeEventListener('touchmove', this._touchmove);
    target.removeEventListener('touchend', this._touchstop);
    target.removeEventListener('touchcancel', this._touchstop);
  }

  onTouchMove(event)
  {
    this.onMouseMove(event.touches[0]);
  }
}

Object.assign(Mouse.prototype, Eventable);

export default Mouse;
