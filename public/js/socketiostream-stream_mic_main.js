const streamMicButton = document.getElementById('streamMic');
const micElement = document.getElementById('mic');

// Connect socket
const socket = io();

console.log('Socket.IO-stream stream mic');

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function sendData(type, payload) {
  socket.emit(type, payload);
}

ss(socket).on('streamRequest', function (serverStream) {
  console.log('got stream request', serverStream);
  // The server emitted the even 'streamRequest'.
  // The server provided a stream to feed data into

  let strm = ss.createStream();

  // Get access to clients mic
  navigator.getUserMedia(
    { audio: true },
    function (micStream) {
      // micElement.srcObject = micStream;
      recordAudio = RecordRTC(micStream, {
        type: 'audio',
        mimeType: 'audio/webm',
        sampleRate: 44100,
        desiredSampRate: 16000,

        recorderType: StereoAudioRecorder,
        numberOfAudioChannels: 1,


        //1)
        // get intervals based blobs
        // value in milliseconds
        // as you might not want to make detect calls every seconds
        timeSlice: 1000,

        //2)
        // as soon as the stream is available
        ondataavailable: async function (blob) {

          // 3
          // making use of socket.io-stream for bi-directional
          // streaming, create a stream
          // var readStream = ss.createStream();

          // // stream directly to server
          // // it will be temp. stored locally
          // ss(socket).emit('stream', readStream, {
          //   name: 'stream.wav',
          //   size: blob.size
          // });

          // // pipe the audio blob to the read stream
          // ss.createBlobReadStream(blob).pipe(readStream);

          // let blobReadStream = ss.createBlobReadStream(blob);
          // // pipe the audio blob to the read stream
          // blobReadStream.pipe(serverStream);

          let arrayBuffer = await new Response(blob).arrayBuffer();   //=> <ArrayBuffer>
          serverStream.write(new ss.Buffer(arrayBuffer));
          playOutput(arrayBuffer);
        }
      });

      recordAudio.startRecording();
    }, function (error) {
      console.error(JSON.stringify(error));
    });

  // strm.pipe(serverStream);

  // micBlobStream.on('data', data => {
  //   console.log('data: ', data);
  // });
  // // Create a new stream to read mic data into
  // let micBlobStream = ss.createBlobReadStream()
  // let readStream = fs.createReadStream(filename);

  // // Feed mic stream into the servers stream
  // micStream.pipe(serverStream);

  console.log(`Streaming mic to server`);
});




// if (hasGetUserMedia()) {
//   // Client has the function navigator.mediaDevices.getUserMedia

//   // Get access to clients mic
//   navigator.mediaDevices.getUserMedia({ audio: true }).then((micStream) => {
//     // micElement.srcObject = micStream;

//     // Send audio stream to server
//     ss(socket).on('streamRequest', function (stream) {
//       console.log('got stream request');
//       // The server emitted the even 'streamRequest'.
//       // The server provided a stream to feed data into

//       // Start feeding the data into the clients stream
//       micStream.pipe(stream);

//       console.log(`Streaming mic to server`);
//     });


//     streamMicButton.onclick = function () {
//       console.log('Clicked streamMicButton');

//       // Send my micStream to the server
//       ss(socket).emit('audioStream', micStream);
//     }
//   });

// } else {
//   alert("getUserMedia() is not supported by your browser");
// }

socket.on('message', message => {
  console.log(message);
});

function playOutput(arrayBuffer) {
  let audioContext = new AudioContext();
  let outputSource;
  try {
    if (arrayBuffer.byteLength > 0) {
      audioContext.decodeAudioData(arrayBuffer,
        function (buffer) {
          audioContext.resume();
          outputSource = audioContext.createBufferSource();
          outputSource.connect(audioContext.destination);
          outputSource.buffer = buffer;
          outputSource.start(0);
        },
        function () {
          console.log(arguments);
        });
    }
  } catch (e) {
    console.log(e);
  }
}
