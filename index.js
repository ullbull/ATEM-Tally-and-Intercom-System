const express = require('express');
const socket = require('socket.io');
const ss = require('socket.io-stream');
const fs = require('fs');
const path = require('path');

const port = 5000;
const app = express();
const api = express();

const server = app.listen(port);

// Host public files
app.use(express.static('public'));

console.log('Socket.IO-stream stream mic');

const io = socket(server);

const streams = {};
function addStream(stream, id) {
   streams[id] = stream;
}
function removeStream(id) {
   delete streams[id];
}

function getClientIDs() {
   const clientIDs = [];
   const srvSockets = io.sockets.sockets;
   srvSockets.forEach(function (value, key) {
      clientIDs.push(key);
      // console.log(key + ' = ' + value)
   })
   return clientIDs;
}

io.on('connection', client => {
   const srvSockets = io.sockets.sockets;
   console.log('Client connected ', client.id);
   console.log('Connected clients: ', srvSockets.size);
   console.log('clients: ', getClientIDs());

   // Send to all clients
   io.emit('connectedClients', getClientIDs());

   // Create a new stream
   const clientStream = ss.createStream();
   addStream(clientStream, client.id);

   // Emit the event 'streamRequest' to let the client
   // know I want it to stream data.
   // Provide the client a stream to use.
   // The client will feed data into the provided stream.
   ss(client).emit('streamRequest', clientStream);
   // ss(client).emit('streamRequest', mainStream);

   clientStream.on('data', data => {
      // console.log(data);
   })

   ss(client).on('streamRequest', function (clientStreams) {
      // The client emitted the even 'streamRequest'.
      // The client provided streams to feed data into

      // Start feeding data into the clients streams
      for (let i = 0; i < clientStreams.length; i++) {
         Object.values(streams)[i].pipe(clientStreams[i]);
      }
   });

   // Runs when client disconnects
   client.on('disconnect', () => {
      console.log('Disconnecting client', client.id)
      removeStream(client.id);
   });
});
