
const b = document.querySelector("button");
let clicked = false;
let chunks = [];
let osc;
let dest;
let mediaRecorder;
const audio = document.querySelector("#audio");
const audio2 = document.querySelector("#audio2");
const ac = new AudioContext();


init();


function init() {
  osc = ac.createOscillator();
  dest = ac.createMediaStreamDestination();
  // mediaRecorder = new MediaRecorder(dest.stream);
  osc.connect(dest);

  audio2.srcObject = dest.stream;

  // mediaRecorder.ondataavailable = function (evt) {
  //   // push each chunk (blobs) in an array
  //   // chunks.push(evt.data);

  // };

  // mediaRecorder.onstop = function (evt) {
  //   // // Make blob out of our blobs, and open it.
  //   // let blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
  //   // let audioTag = document.createElement('audio');
  //   // audio.src = URL.createObjectURL(blob);
  // };
}

b.addEventListener("click", function (e) {


  if (!clicked) {
    // mediaRecorder.start();
    osc.start(0);
    e.target.innerHTML = "Stop";
    clicked = true;
    audio2.play();
  } else {
    clicked = false;
    e.target.innerHTML = "Start";
    // mediaRecorder.requestData();
    // mediaRecorder.stop(0);
    // osc.stop(0);
    // e.target.disabled = true;
  }
});
