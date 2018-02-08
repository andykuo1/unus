function fetchFileFromURL(url, callback)
{
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onreadystatechange = function() {
    console.log("READY!");
    if (request.readyState == XMLHttpRequest.DONE)
    {
      if (request.status == 200)
      {
        console.log("SUCESS!");
        let result = request.response;
        callback(result);
      }
			else
			{
				throw new Error("Failed request: " + request.status);
			}
    }
  }
  console.log("SOMETHING HERE");
  request.send(null);
}
