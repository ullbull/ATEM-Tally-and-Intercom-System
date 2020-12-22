const concat = (buffer1, buffer2) => {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);

  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);

  return tmp.buffer;
};

const appendBuffer = (buffer1, buffer2, context) => {
  const numberOfChannels = Math.min(buffer1.numberOfChannels, buffer2.numberOfChannels);
  const tmp = context.createBuffer(numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate);
  for (let i = 0; i < numberOfChannels; i++) {
    const channel = tmp.getChannelData(i);
    channel.set(buffer1.getChannelData(i), 0);
    channel.set(buffer2.getChannelData(i), buffer1.length);
  }
  return tmp;
};

const withWaveHeader = (data, numberOfChannels, sampleRate) => {
  const header = new ArrayBuffer(44);

  const d = new DataView(header);

  d.setUint8(0, "R".charCodeAt(0));
  d.setUint8(1, "I".charCodeAt(0));
  d.setUint8(2, "F".charCodeAt(0));
  d.setUint8(3, "F".charCodeAt(0));

  d.setUint32(4, data.byteLength / 2 + 44, true);

  d.setUint8(8, "W".charCodeAt(0));
  d.setUint8(9, "A".charCodeAt(0));
  d.setUint8(10, "V".charCodeAt(0));
  d.setUint8(11, "E".charCodeAt(0));
  d.setUint8(12, "f".charCodeAt(0));
  d.setUint8(13, "m".charCodeAt(0));
  d.setUint8(14, "t".charCodeAt(0));
  d.setUint8(15, " ".charCodeAt(0));

  d.setUint32(16, 16, true);
  d.setUint16(20, 1, true);
  d.setUint16(22, numberOfChannels, true);
  d.setUint32(24, sampleRate, true);
  d.setUint32(28, sampleRate * 1 * 2);
  d.setUint16(32, numberOfChannels * 2);
  d.setUint16(34, 16, true);

  d.setUint8(36, "d".charCodeAt(0));
  d.setUint8(37, "a".charCodeAt(0));
  d.setUint8(38, "t".charCodeAt(0));
  d.setUint8(39, "a".charCodeAt(0));
  d.setUint32(40, data.byteLength, true);

  return concat(header, data);
};

const getAudioContext = () => {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContent = new AudioContext();
  return audioContent;
};

console.log('Welcome!');
const socket = io();

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}


const audio = document.querySelector("#autoAudio");
const testButton = document.getElementById('testButton')

// Check if client has GetUserMedia()
if (hasGetUserMedia()) {


  // // Get access to mic
  // navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  //   // Play audio from mic
  //   // audio.srcObject = stream;
  //   console.log('stream', stream);

  //   recordAudio = RecordRTC(stream, {
  //     type: 'audio',
  //     mimeType: 'audio/webm',
  //     sampleRate: 44100,
  //     desiredSampRate: 16000,

  //     recorderType: StereoAudioRecorder,
  //     numberOfAudioChannels: 1,


  //     //1)
  //     // get intervals based blobs
  //     // value in milliseconds
  //     // as you might not want to make detect calls every seconds
  //     timeSlice: 4000,

  //     //2)
  //     // as soon as the stream is available
  //     ondataavailable: function (blob) {
  //       console.log('stream available!');

  //       // 3
  //       // making use of socket.io-stream for bi-directional
  //       // streaming, create a stream
  //       var stream2 = ss.createStream();
  //       // stream directly to server
  //       // it will be temp. stored locally
  //       ss(socket).emit('stream', stream2, {
  //         name: 'stream.wav',
  //         size: blob.size
  //       });
  //       // pipe the audio blob to the read stream
  //       ss.createBlobReadStream(blob).pipe(stream2);
  //     }
  //   });

  //   recordAudio.startRecording();

  // });

} else {
  alert("getUserMedia() is not supported by your browser");
}

function sendData(type, payload) {
  socket.emit(type, payload);
}

socket.on('msg', message => {
  console.log(message);
});

// ss(socket).on('stream', stream => {
//   console.log('got the stream returned back!', stream.id);
//   audio.srcObject = stream;

// })




// create audio context
const audioContext = getAudioContext();

testButton.onclick = async function () {
  sendData('msg', 'hej!');
  loadFile();

  // // load audio file from server
  // const url = '/track'
  // const response = await axios.get(url, {
  //   responseType: 'arraybuffer',
  // });

  // // create audio context
  // const audioContext = getAudioContext();
  // // create audioBuffer (decode audio file)
  // const audioBuffer = await audioContext.decodeAudioData(response.data);

  // // create audio source
  // const source = audioContext.createBufferSource();
  // source.buffer = audioBuffer;
  // source.connect(audioContext.destination);

  // // play audio
  // source.start();

}

function loadFile(/* { frequencyC, sinewaveC }, styles, onLoadProcess */) {
  new Promise(async (resolve, reject) => {

    socket.emit('track', () => { });

    ss(socket).on('track-stream', async (stream, { stat }) => {
      stream.on('data', async (data) => {
        // calculate loading process rate
        const loadRate = (data.length * 100) / stat.size;
        console.log('loadRate', loadRate);

        const audioBufferChunk = await audioContext.decodeAudioData(withWaveHeader(data, 2, 44100));
        source = audioContext.createBufferSource();
        source.buffer = audioBufferChunk;
        source.connect(audioContext.destination);

        const newaudioBuffer = (source && source.buffer)
          ? appendBuffer(source.buffer, audioBufferChunk, audioContext)
          : audioBufferChunk;
        source = audioContext.createBufferSource();
        source.buffer = newaudioBuffer;

        const whileLoadingInterval = setInterval(() => {
          if(startAt) {
            const inSec = (Date.now() - startAt) / 1000;
            if (playWhileLoadingDuration && inSec >= playWhileLoadingDuration) {
              playWhileLoading(playWhileLoadingDuration);
              playWhileLoadingDuration = source.buffer.duration
            }
          } else if(source) {
            playWhileLoadingDuration = source.buffer.duration;
            startAt = Date.now();
            playWhileLoading();
          }
         }, 500);

        source.start(source.buffer.duration);
      });
    });
  });
}





