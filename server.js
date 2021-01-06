const express = require('express');
const socket = require('socket.io');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
// const fs = require('fs');
// const https = require('https');
const simulateAtemSwitcher = require('./simulateAtemSwitcher.js');
const atemManager = require('./atemManager.js');
const fileManager = require('./fileManager.js');

const port = 5000;
const app = express();

// var privateKey = fs.readFileSync('fake_keys/111.111.1.59-key.pem');
// var certificate = fs.readFileSync('fake_keys/111.111.1.59.pem');

// const server = https.createServer({
//     key: privateKey,
//     cert: certificate
// }, app).listen(port);

const server = app.listen(port);

// Host public files
app.use(express.static('public'));

const io = socket(server);
simulateAtemSwitcher.init(io);

const jsonPath = {
   config: 'config.json',
   logs: 'logs.json'
};

const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;

var config = getValuesFromConfigJson(jsonPath);

// --------------------------
// socket.io codes goes below

function getClientIDs() {
   const clientIDs = [];
   const srvSockets = io.sockets.sockets;
   srvSockets.forEach(function (value, key) {
      clientIDs.push(key);
      // console.log(key + ' = ' + value)
   })
   return clientIDs;
}

io.on('connection', function (socket) {
   RTCMultiConnectionServer.addSocket(socket, config);

   const srvSockets = io.sockets.sockets;
   console.log('Client connected ', socket.id);
   console.log('Connected clients: ', srvSockets.size);
   console.log('clients: ', getClientIDs());

   // Send to client
   socket.emit('message', 'You are connected!');

   // Send to all clients
   io.emit('connected clients', getClientIDs());

   // Runs when client disconnects
   socket.on('disconnect', () => {
      console.log('Disconnecting client', socket.id)
      // Send to all clients
      io.emit('disconnect client', socket.id);
      io.emit('connected clients', getClientIDs());
   });
});

const atem = atemManager.atemSwitcher;

atem.on('connectionStateChange', state => {
   io.emit('message', 'state:' + state.description);
});


////////////////////


app.get('/select-cam', (request, response) => {
   // Get desired camID
   const camID = request.query.cam
   response.redirect(`/?cam=${camID}`);
});

app.get('/get-config', (request, response) => {
   const config = fileManager.loadFile('atem-config.json');
   response.json(config);
});

app.get('/save.config', (request, response) => {
   const data = request.query;
   console.log('Receiving config data!', data);

   const config = fileManager.loadConfig();
   config.ip = data['atem-ip'];

   fileManager.saveConfig(config);

   // Reconnect atem switcher with new ip
   atemManager.reconnect(config.ip);

   response.redirect(`/`);
});
