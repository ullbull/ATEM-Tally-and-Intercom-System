const socket = io();
const testButton = document.getElementById('testButton');
const makeButton = document.getElementById('makeButton');
const audio1 = document.getElementById('audio1');

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

///////////////////////////////////////

console.log('APA!');

const b = document.querySelector("button");
let clicked = false;
let chunks = [];
let ac;
let osc;
let dest;
let mediaRecorder;

function makeAudio() {
  let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
  audio1.src = URL.createObjectURL(blob);
  audio1.play();


  // let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
  // let audioTag = document.createElement('audio');
  // audioTag.src = URL.createObjectURL(blob);
  // audioTag.play();
}

function sendData(type, payload) {
  socket.emit(type, payload);
}

socket.on('message', message => {
  console.log(message);
});


/////////////////////////////

const getAudioContext =  () => {
  AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();

  return { audioContext, analyser };
};

const loadFile = () => new Promise(async (resolve, reject) => {
 try {
   let source = null;
   let playWhileLoadingDuration = 0;
   let startAt = 0;
   let audioBuffer = null;
   let activeSource = null;

   // create audio context
   const { audioContext, analyser } = getAudioContext();
   const gainNode = audioContext.createGain();

   const playWhileLoading = (duration = 0) => {
     source.connect(audioContext.destination);
     source.start(0, duration);
     activeSource = source;
   };

   const play = (resumeTime = 0) => {
     // create audio source
     source = audioContext.createBufferSource();
     source.buffer = audioBuffer;

     source.connect(audioContext.destination);
     source.start(0, resumeTime);
   };

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

   const stop = () => source && source.stop(0);

   // load file
   socket.emit('track', (e) => {});
   ss(socket).on('track-stream', (stream, { stat }) => {
     let rate = 0;
     let isData = false;
     stream.on('data', async (data) => {
       const audioBufferChunk = await audioContext.decodeAudioData(withWaveHeader(data, 2, 44100));
       const newaudioBuffer = (source && source.buffer)
         ? appendBuffer(source.buffer, audioBufferChunk, audioContext)
         : audioBufferChunk;
       source = audioContext.createBufferSource();
       source.buffer = newaudioBuffer;

       const loadRate = (data.length * 100 ) / stat.size;
       rate = rate + loadRate;
      //  changeAudionState({ loadingProcess: rate, startedAt: startAt });

       if(rate >= 100) {
         clearInterval(whileLoadingInterval);
         audioBuffer = source.buffer;
         const inSec = (Date.now() - startAt) / 1000;
         activeSource.stop();
         play(inSec);
         resolve({ play, stop});
       }
       isData = true;
     });
   });
 } catch (e) {
   reject(e)
 }
});


////////////////////////////

loadFile();


testButton.onclick = function () {
  console.log('click');
  socket.emit('message', 'Hejsan!');
  socket.emit('track');
}

makeButton.onclick = function () {
  makeAudio();
}