const button = document.querySelector('button');
const pre = document.querySelector('pre');
const myScript = document.querySelector('script');

pre.innerHTML = myScript.innerHTML;

let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

// Stereo
let channels = 2;

function init() {
  audioCtx = new AudioContext();
}


function getBuffer() {
  // Create an empty two second stereo buffer at the
  // sample rate of the AudioContext
  let frameCount = audioCtx.sampleRate * 2.0;

  let myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

  // Fill the buffer with white noise;
  //just random values between -1.0 and 1.0
  for (let channel = 0; channel < channels; channel++) {
   // This gives us the actual array that contains the data
   let nowBuffering = myArrayBuffer.getChannelData(channel);
   for (let i = 0; i < frameCount; i++) {
     // Math.random() is in [0; 1.0]
     // audio needs to be in [-1.0; 1.0]
     nowBuffering[i] = Math.random() * 2 - 1;
   }
  }

  return myArrayBuffer;
}

button.onclick = function() {
  if(!audioCtx) {
    init();
  }

  let myArrayBuffer = getBuffer();

  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  let source = audioCtx.createBufferSource();
  
  // set the buffer in the AudioBufferSourceNode
  source.buffer = myArrayBuffer;
  
  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(audioCtx.destination);
  
  // start the source playing
  source.start();

  source.onended = () => {
    console.log('White noise finished');
  }
}
