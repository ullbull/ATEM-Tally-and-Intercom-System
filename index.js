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

console.log('APA')

const io = socket(server);

io.on('connection', client => {
  console.log('Client connected ', client.id);
  client.emit('message', `You are connected!`);

  client.on('message', message => {
    console.log(`I got this message from client ${client.id}: ${message}`);
    client.emit('message', `Thanks for the message: ${message}`);
  })

  let strm = null;
  client.on('stream-mic', (istream) => {
    console.log('stream-mic');
    const stream = ss.createStream();

    // pipe stream with response stream
    istream.pipe(stream);

    strm = stream;
    // ss(client).emit('track-stream', stream);
  });

  client.on('track', () => {
    console.log('track');
    const stream = ss.createStream();
    const filePath = path.resolve(__dirname, './track.wav');
    // get file info
    const stat = fs.statSync(filePath);
    const readStream = fs.createReadStream(filePath);
    // pipe stream with response stream
    if (strm) {
      console.log('strm');
      readStream.pipe(strm);
      ss(client).emit('track-stream', strm, { stat });
    } else {
      readStream.pipe(stream);
      ss(client).emit('track-stream', stream, { stat });
    }
  });
});
