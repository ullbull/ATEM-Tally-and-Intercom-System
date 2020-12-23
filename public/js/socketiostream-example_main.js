const streamMicButton = document.getElementById('downloadButton');

// Connect socket
const socket = io();

console.log('Socket.IO-stream example');

function sendData(type, payload) {
  socket.emit(type, payload);
}

socket.on('message', message => {
  console.log(message);
});

streamMicButton.onclick = function () {
  console.log('Clicked downloadButton');

  // Create a new stream
  var stream = ss.createStream();

  // This is the file I want to download
  const filename = 'requirements.txt';

  // Emit the event 'fileRequest' to let the server
  // know I want a file.
  // Provide the server a stream and the name of 
  // the requested file.
  // The server will feed data into the provided stream.
  ss(socket).emit('fileRequest', stream, filename);
  stream.on('data', data => {
    var uint8array = new TextEncoder("utf-8").encode(data);
    var string = new TextDecoder("utf-8").decode(uint8array);
    console.log(string);
    console.log(data);
  })
}
