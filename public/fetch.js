function fetchFileFromURL(url, callback = null)
{
  var request = new XMLHttpRequest();
  request.open('GET', url, callback != null);
  if (callback != null)
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
    request.send(null);
  }
  else
  {
    request.send(null);
    if (request.status == 200)
    {
      let result = request.response;
      return result;
    }
    else
    {
      throw new Error("Failed request: " + request.status);
    }
  }
}

export {
  fetchFileFromURL
}
