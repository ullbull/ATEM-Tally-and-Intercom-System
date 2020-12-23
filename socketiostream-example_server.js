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

console.log('Socket.IO-stream example');

const io = socket(server);

io.on('connection', client => {
  console.log('Client connected ', client.id);

  // Send file to client
  ss(client).on('fileRequest', function(stream, filename) {
    // Client emitted the even 'fileRequest'.
    // The client provided a stream to feed data into
    // and the name of the requested file.

    // Create a new stream to read the requested file into
    let readStream = fs.createReadStream(filename);
    
    // Start feeding the data into the clients stream
    readStream.pipe(stream); 

    console.log('stream: ', stream);
    console.log('readStream: ', readStream);
    console.log(`Streaming the file "${filename}"`);
  });

});
