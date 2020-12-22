/////////////////////////////
// NodeJS Server
/////////////////////////////

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');

io.sockets.on('connection', function(socket) {
  console.log("connection");

  //send stream to client/browser

  var i = 0;
  var timer = setInterval(function() {
    console.log('file',i);
    var stream = ss.createStream();
    ss(socket).emit('file',stream, {i:i});
    var filename = 'image'+(i%2)+'.png';
    console.log(filename);
    fs.createReadStream(filename).pipe(stream);
    i++;
  },1000);

  socket.on('disconnect', function() {
    console.log('disconnect')
    clearInterval(timer);
  })

});

app.use(express.static('public'));

http.listen(8080, function(){
  console.log('listening on *:8080');
});
