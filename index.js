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

console.log('WebRTC test');

const io = socket(server);



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

   // Send to client
   client.emit('message', 'You are connected!');

   // Send to all clients
   io.emit('connected clients', getClientIDs());

   client.on("call-user", data => {
      // sending to individual socketid (private message)
      io.to(data.to).emit("call-made", {
         offer: data.offer,
         socket: client.id
      });
   });

   client.on("make-answer", data => {
      // Send back to caller
      io.to(data.to).emit("answer-made", {
         socket: client.id,
         answer: data.answer
      });
   });



   // Runs when client disconnects
   client.on('disconnect', () => {
      console.log('Disconnecting client', client.id)
      // Send to all clients
      io.emit('disconnect client', client.id);
      io.emit('connected clients', getClientIDs());
   });
});
