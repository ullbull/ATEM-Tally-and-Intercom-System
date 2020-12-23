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
  var stream = ss.createStream();
  
  // Emit the event 'streamRequest' to let the client
  // know I want it to stream data.
  // Provide the client a stream to use.
  // The client will feed data into the provided stream.
  ss(client).emit('streamRequest', stream);
  stream.on('data', data => {
    var uint8array = new TextEncoder("utf-8").encode(data);
    var string = new TextDecoder("utf-8").decode(uint8array);
    console.log(string);
    console.log(data);
  })

  // ss(client).emit('streamRequest', 'hej');

  // when the client sends 'stream' events
  // when using audio streaming
  ss(client).on('stream', function (stream, data) {
    // stream.on('data', data => {
    //   console.log(data);
    // })

    // // get the name of the stream
    // const filename = path.basename(data.name);
    // // pipe the filename to the stream
    // stream.pipe(fs.createWriteStream(filename));

    // // Send back stream
    // client.emit('return', stream.name);

    // console.log('got stream from client: ', stream.id);

  });

  // Send file to client
  ss(client).on('fileRequest', function (stream, filename) {
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
