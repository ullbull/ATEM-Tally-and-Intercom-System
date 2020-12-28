const receiveButton = document.getElementById('receiveAudioStream');
const streamButton = document.getElementById('toggleStream');
const audioContext = new AudioContext();
let connectedClients = 0;

function hasGetUserMedia() {
   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

console.log('Socket.IO-stream stream mic');

// Connect socket
const socket = io();

function sendData(type, payload) {
   socket.emit(type, payload);
}

let recordAudio = null;

function hasGetUserMedia() {
   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

ss(socket).on('streamRequest', function (serverStream) {
   // The server emitted the even 'streamRequest'.
   // The server provided a stream to feed data into

   // Get access to clients mic
   // Check if client has GetUserMedia()
   if (hasGetUserMedia()) {

      // Get access to mic
      navigator.mediaDevices.getUserMedia({ audio: true }).then((micStream) => {
         console.log('Got access to mic!');
         recordAudio = RecordRTC(micStream, {
            type: 'audio',
            mimeType: 'audio/webm',
            // sampleRate: 44100,
            desiredSampRate: 16000,
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1,

            timeSlice: 500,

            ondataavailable: async function (blob) {
               let arrayBuffer = await new Response(blob).arrayBuffer();   //=> <ArrayBuffer>

               // Write data into the servers stream
               serverStream.write(new ss.Buffer(arrayBuffer));
            }
         });

         console.log('state', recordAudio.getState());

         // recordAudio.startRecording();

         // /////////////TESTING////////////////////////
         // let arrayBuffer = [1,2,3,4];

         // console.log('writing');
         // serverStream.write(new ss.Buffer(arrayBuffer));

         // // micStream.pipe(serverStream);
         // /////////////////////////////////////////////

      });

   } else {
      alert("getUserMedia() is not supported by your browser");
   }
});

socket.on('message', message => {
   console.log(message);
});

socket.on('connectedClients', clients => {
   connectedClients = clients;
   console.log('connectedClients:', connectedClients)
});

receiveButton.onclick = function () {
   // receiveButton.disabled = true;
   console.log('Clicked receiveButton');

   // Create streams
   const streams = [];
   connectedClients.forEach(client => {
      let stream = ss.createStream();
      streams.push(stream);
   });

   // Emit the event 'streamRequest' to let the server
   // know I want it to stream data.
   // Provide the server a stream to use.
   // The server will feed data into the provided stream.
   ss(socket).emit('streamRequest', streams);

   streams.forEach(stream => {
      stream.on('data', async data => {
         let arrayBuffer = await new Response(data).arrayBuffer();   //=> <ArrayBuffer>
         playOutput(arrayBuffer);
      })
   });
}

streamButton.onclick = function () {

   if (recordAudio.state == 'recording') {
      recordAudio.pauseRecording();
      streamButton.textContent = 'Stream mic';
   }

   else if (recordAudio.state == 'paused') {
      recordAudio.resumeRecording()
      streamButton.textContent = 'Pause';
   }
   else if (recordAudio.state == 'inactive') {
      recordAudio.startRecording();
      streamButton.textContent = 'Pause';
   }

}

function playOutput(arrayBuffer) {
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
