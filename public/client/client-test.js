class Application
{
  onStart()
  {
  	socket.emit('newplayer');
  }

  onUpdate()
  {
  	socket.emit('movement', movement);
  }
}

console.log("TEST.JS IS RIN!");

//Test input
movement = {
  up: false,
  down: false,
  left: false,
  right: false
};
document.addEventListener('keydown', function(event){
  switch(event.keyCode)
  {
    case 65:
    movement.left = true;
    break;
    case 87:
    movement.up = true;
    break;
    case 68:
    movement.right = true;
    break;
    case 83:
    movement.down = true;
    break;
  }
});
document.addEventListener('keyup', function(event){
  switch(event.keyCode)
  {
    case 65:
    movement.left = false;
    break;
    case 87:
    movement.up = false;
    break;
    case 68:
    movement.right = false;
    break;
    case 83:
    movement.down = false;
    break;
  }
});
//Test renderer
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, screenWidth, screenHeight);
  context.fillStyle = 'blue';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 8, 0, 2 * Math.PI);
    context.fill();
  }
});

console.log("END!");
//--------------------------------
