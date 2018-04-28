import socketio from 'socket.io';
import express from 'express';
import path from 'path';

const __dirname = path.resolve();
const DEVMODE = process.argv.indexOf('--dev') != -1;
const PORT = process.env.PORT || 8082;
const FRAMERATE = 1000/10;

//Server Setup
const app = express();
app.set('port', PORT);
app.use('/', express.static(__dirname + '/public'));
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
const server = app.listen(PORT, function() {
  const port = server.address().port;
  console.log("Server is listening on port " + port + "...");
});

import Application from 'Application.js';
import ServerEngine from 'server/ServerEngine.js';

//Application Setup
function onServerLoad()
{
  new ServerEngine(Application, socketio(server))
    .initialize()
    .then(() => Application.start(FRAMERATE));
}

//Start the server...
onServerLoad();
