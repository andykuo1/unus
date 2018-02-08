function fetchFileFromURL(url, callback, sync = false)
{
  var request = new XMLHttpRequest();
  request.open('GET', url, !sync);
  if (!sync)
  {
    request.onreadystatechange = function() {
      if (request.readyState == XMLHttpRequest.DONE)
      {
        if (request.status == 200)
        {
          let result = request.response;
          callback(result);
        }
  			else
  			{
  				throw new Error("Failed request: " + request.status);
  			}
      }
    }
  }
  request.send(null);
}
