class Renderer
{
  constructor(canvas)
  {
    this.canvas = canvas;
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.loader = document.getElementById('loader');
  }

  render(gameState)
  {
    let str = "";
    for(var i in gameState)
    {
      let entity = gameState[i];
      if (entity)
      {
        str += "<p>" + i + " : " + JSON.stringify(entity) + "</p>";
      }
    }
    this.loader.innerHTML = str;
  }
}

export default Renderer;
