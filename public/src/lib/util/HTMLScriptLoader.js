function loadScripts(files, callback, index = 0)
{
	if (index == 0)
	{
		console.log("Loading scripts...");
		let element = document.querySelector('#scripts');
    //Begin loading element...
	}

	if (index < files.length)
	{
		let file = files[index];
		console.log("...getting \'" + file + "\'...");

		//HTML implementation...
		let element = document.createElement('script');
		element.setAttribute('type', 'text/javascript');
		element.setAttribute('src', file);

		element.onload = function() {
			console.log("...evaluating...");
			load(files, callback, index + 1);
		};
		document.querySelector('#scripts').appendChild(element);
	}
	else
	{
		let element = document.querySelector('#scripts');
    //End loading element...
		console.log("...Loaded " + index + " script(s)!");
		callback();
	}
}

export default loadScripts;
