const express = require('express');
const socket = require('socket.io');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');

const port = 5000;
const app = express();

const server = app.listen(port);

// Host public files
app.use(express.static('public'));

console.log('WebRTC test');

const io = socket(server);

const jsonPath = {
   config: 'config.json',
   logs: 'logs.json'
};

const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;

var config = getValuesFromConfigJson(jsonPath);

// --------------------------
// socket.io codes goes below

io.on('connection', function (socket) {
   RTCMultiConnectionServer.addSocket(socket, config);

   // ----------------------
   // below code is optional

   const params = socket.handshake.query;

   if (!params.socketCustomEvent) {
      params.socketCustomEvent = 'custom-message';
   }

   socket.on(params.socketCustomEvent, function (message) {
      socket.broadcast.emit(params.socketCustomEvent, message);
   });
});
