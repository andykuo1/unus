class Renderer
{
  constructor(canvas)
  {
    this.canvas = canvas;
    this.loader = document.getElementById('loader');
  }

  render(gameState)
  {
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'white';
    for(var i in gameState)
    {
      let entity = gameState[i];
      if (entity)
      {
        ctx.fillRect(entity.x - 16, entity.y - 16, 32, 32);
        //str += "<p>" + i + " : " + JSON.stringify(entity) + "</p>";
      }
    }
    //this.loader.innerHTML = str;
  }
}

export default Renderer;
