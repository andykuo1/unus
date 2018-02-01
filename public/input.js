clientInput = {
  x: 0.0, y: 0.0,
  scrollX: 0.0, scrollY: 0.0,
  down: false,
  _click: false,
  get click() {
    var result = this._click;
    this._click = false;
    return result;
  }
};

function onMouseUp(event)
{
  let screen = canvas.getBoundingClientRect();
  clientInput.x = event.clientX - screen.left;
  clientInput.y = event.clientY - screen.top;
  clientInput.down = false;
}

function onMouseDown(event)
{
  let screen = canvas.getBoundingClientRect();
  clientInput.x = event.clientX - screen.left;
  clientInput.y = event.clientY - screen.top;
  clientInput.down = true;
}

function onMouseClick(event)
{
  let screen = canvas.getBoundingClientRect();
  clientInput.x = event.clientX - screen.left;
  clientInput.y = event.clientY - screen.top;
  clientInput._click = true;
}

function onMouseWheel(event)
{
  clientInput.scrollX = event.deltaX;
  clientInput.scrollY = event.deltaY;
}

function onMouseMove(event)
{
  let screen = canvas.getBoundingClientRect();
  clientInput.x = event.clientX - screen.left;
  clientInput.y = event.clientY - screen.top;
}

function onTouchStart(event)
{
  var target = event.touches[0].target;
  target.addEventListener('touchmove', onTouchMove);
  target.addEventListener('touchend', onTouchStop);
  target.addEventListener('touchcancel', onTouchStop);
}

function onTouchStop(event)
{
  var target = event.touches[0].target;
  target.removeEventListener('touchmove', onTouchMove);
  target.removeEventListener('touchend', onTouchStop);
  target.removeEventListener('touchcancel', onTouchStop);
}

function onTouchMove(event)
{
  let screen = canvas.getBoundingClientRect();
  clientInput.x = event.touches[0].clientX - screen.left;
  clientInput.y = event.touches[0].clientY - screen.right;
}

document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('click', onMouseClick);
document.addEventListener('wheel', onMouseWheel);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('touchstart', onTouchStart);
