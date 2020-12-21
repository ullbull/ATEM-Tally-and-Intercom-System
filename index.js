const express = require('express');

const port = 5000;
const app = express();
const server = app.listen(port);

// Host public files
app.use(express.static('public'));

console.log('Socket server running')

const socket = require('socket.io');

const io = socket(server);

io.sockets.on('connection', socket => {
  console.log('Client connected: ', socket.id);
})
