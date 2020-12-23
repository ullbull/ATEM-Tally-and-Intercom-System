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

io.on('connection', client => {
  console.log('Client connected ', client.id);

  // Create a new stream
  var clientMicStream = ss.createStream();

  // Emit the event 'streamRequest' to let the client
  // know I want it to stream data.
  // Provide the client a stream to use.
  // The client will feed data into the provided stream.
  ss(client).emit('streamRequest', clientMicStream);

  clientMicStream.on('data', data => {
    console.log(data);
  })

  // Send file to client
  ss(client).on('streamRequest', function (stream) {
    // The client emitted the even 'streamRequest'.
    // The client provided a stream to feed data into

    // Start feeding the data into the clients stream
    clientMicStream.pipe(stream);
  });

});
