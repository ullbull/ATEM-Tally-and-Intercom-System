const express = require('express');
const ss = require('socket.io-stream');
const fs = require('fs');
const path = require('path');


const port = 5000;
const app = express();
const api = express();

const server = app.listen(port);

// Host public files
app.use(express.static('public'));

console.log('Socket server running')

api.get('/track', (req, res, err) => {
  // generate file path
  const filePath = path.resolve(__dirname, './track.wav');
  console.log('filePath', filePath);
  // get file size info
  const stat = fs.statSync(filePath);

  // set response header info
  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': stat.size
  });
  //create read stream
  const readStream = fs.createReadStream(filePath);
  // attach this stream with response stream
  readStream.pipe(res);
});

//register api calls
app.use('/api/v1/', api);

const socket = require('socket.io');

const io = socket(server);

io.sockets.on('connection', client => {
  console.log('Client connected: ', client.id);
  
  const stream = ss.createStream();
    
  client.on('track', () => {
    const filePath = path.resolve(__dirname, './track.wav');
    const stat = fs.statSync(filePath);
    const readStream = fs.createReadStream(filePath);
    // pipe stream with response stream
    readStream.pipe(stream);
    
    ss(client).emit('track-stream', stream, { stat });
  });
  client.on('disconnect', () => {});
  
  client.on('msg', message => {
    console.log(`Message from client ${client.id}: ${message}`);
    client.emit('msg', `Thanks for your message: ${message}`);
  });

});
