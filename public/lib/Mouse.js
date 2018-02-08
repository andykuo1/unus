export default class
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
    this.x = 0.0;
    this.y = 0.0;
    this.scrollX = 0.0;
    this.scrollY = 0.0;
    this.down = false;

    this._click = false;
    this._canvas = canvas;
    this._element = element;

    this._element.addEventListener('mouseup', onMouseUp);
    this._element.addEventListener('mousedown', onMouseDown);
    this._element.addEventListener('click', onMouseClick);
    this._element.addEventListener('wheel', onMouseWheel);
    this._element.addEventListener('mousemove', onMouseMove);
    this._element.addEventListener('touchstart', onTouchStart);
  }

  destroy()
  {
    this._element.removeEventListener('mouseup', onMouseUp);
    this._element.removeEventListener('mousedown', onMouseDown);
    this._element.removeEventListener('click', onMouseClick);
    this._element.removeEventListener('wheel', onMouseWheel);
    this._element.removeEventListener('mousemove', onMouseMove);
    this._element.removeEventListener('touchstart', onTouchStart);
  }

  onMouseUp(event)
  {
    let screen = this._canvas.getBoundingClientRect();
    this.x = event.clientX - screen.left;
    this.y = event.clientY - screen.top;
    this.down = false;
  }

  onMouseDown(event)
  {
    let screen = this._canvas.getBoundingClientRect();
    this.x = event.clientX - screen.left;
    this.y = event.clientY - screen.top;
    this.down = true;
  }

  onMouseClick(event)
  {
    let screen = this._canvas.getBoundingClientRect();
    this.x = event.clientX - screen.left;
    this.y = event.clientY - screen.top;
    this._click = true;
  }

  onMouseWheel(event)
  {
    this.scrollX = event.deltaX;
    this.scrollY = event.deltaY;
  }

  onMouseMove(event)
  {
    let screen = this._canvas.getBoundingClientRect();
    this.x = event.clientX - screen.left;
    this.y = event.clientY - screen.top;
  }

  onTouchStart(event)
  {
    var target = event.touches[0].target;
    target.addEventListener('touchmove', onTouchMove);
    target.addEventListener('touchend', onTouchStop);
    target.addEventListener('touchcancel', onTouchStop);
  }

  onTouchStop(event)
  {
    var target = event.touches[0].target;
    target.removeEventListener('touchmove', onTouchMove);
    target.removeEventListener('touchend', onTouchStop);
    target.removeEventListener('touchcancel', onTouchStop);
  }

  onTouchMove(event)
  {
    let screen = this._canvas.getBoundingClientRect();
    this.x = event.touches[0].clientX - screen.left;
    this.y = event.touches[0].clientY - screen.right;
  }

  get click()
  {
    var result = this._click;
    this._click = false;
    return result;
  }
}
