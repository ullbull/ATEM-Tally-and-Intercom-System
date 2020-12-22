const socket = io();
const testButton = document.getElementById('testButton');
const makeButton = document.getElementById('makeButton');

console.log('APA!');

const b = document.querySelector("button");
let clicked = false;
let chunks = [];
let ac;
let osc;
let dest;
let mediaRecorder;

function init() {
  ac = new AudioContext();
  osc = ac.createOscillator();
  dest = ac.createMediaStreamDestination();
  mediaRecorder = new MediaRecorder(dest.stream);
  osc.connect(dest);

  mediaRecorder.ondataavailable = function (evt) {
    // push each chunk (blobs) in an array
    chunks.push(evt.data);
  };

  mediaRecorder.onstop = function (evt) {
    // Make blob out of our blobs, and open it.
    let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
    let audioTag = document.createElement('audio');
    document.querySelector("audio").src = URL.createObjectURL(blob);
  };
}

function makeAudio() {
  let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
  let audioTag = document.createElement('audio');
  document.querySelector("audio").src = URL.createObjectURL(blob);
}

b.addEventListener("click", function (e) {
  if (!ac) {
    init();
  }

  if (!clicked) {
    mediaRecorder.start();
    // osc.start(0);
    e.target.innerHTML = "Stop recording";
    clicked = true;
  } else {
    mediaRecorder.requestData();
    mediaRecorder.stop();
    // osc.stop(0);
    e.target.disabled = true;
  }
});

function sendData(type, payload) {
  socket.emit(type, payload);
}

socket.on('message', message => {
  console.log(message);
});

ss(socket).on('track-stream', (stream, { stat }) => {
  stream.on('data', async (data) => {
    console.log('data[0]', data[0]);
    chunks.push(data);
    // if (data[0] == 0) {
    //   console.log('end')

    //   // Make blob out of our blobs, and open it.
    //   let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
    //   let audioTag = document.createElement('audio');
    //   audio2.src = URL.createObjectURL(blob);
    // }
  });
});


testButton.onclick = function () {
  console.log('click');
  socket.emit('message', 'Hejsan!');
  socket.emit('track');
}

makeButton.onclick = function () {
  makeAudio();
}