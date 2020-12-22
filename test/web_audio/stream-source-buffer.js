
const myAudio = document.querySelector('audio');
const pre = document.querySelector('pre');
const audio = document.querySelector('audio');
const myScript = document.querySelector('script');
const range = document.querySelector('input');
const freqResponseOutput = document.querySelector('.freq-response-output');
// create float32 arrays for getFrequencyResponse
const myFrequencyArray = new Float32Array(5);
myFrequencyArray[0] = 1000;
myFrequencyArray[1] = 2000;
myFrequencyArray[2] = 3000;
myFrequencyArray[3] = 4000;
myFrequencyArray[4] = 5000;
const magResponseOutput = new Float32Array(5);
const phaseResponseOutput = new Float32Array(5);
// getUserMedia block - grab stream
// put it into a MediaStreamAudioSourceNode
// also output the visuals into a audio element
if (navigator.mediaDevices) {
  console.log('getUserMedia supported.');
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      audio.srcObject = stream;
      audio.onloadedmetadata = function (e) {
        audio.play();
        audio.muted = true;
      };

      // Create a MediaStreamAudioSourceNode
      // Feed the HTMLMediaElement into it
      const audioCtx = new AudioContext();
      
      const source = audioCtx.createMediaStreamSource(stream);

      // Create a gain node
      let gainNode = audioCtx.createGain();

      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);

    })
    .catch(function (err) {
      console.log('The following gUM error occured: ' + err);
    });
} else {
  console.log('getUserMedia not supported on your browser!');
}
// dump script to pre element
pre.innerHTML = myScript.innerHTML;
