console.log('Welcome!');
const socket = io();

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// Check if client has GetUserMedia()
if (hasGetUserMedia()) {

  const constraints = {
    audio: true,
  };

  const audio = document.querySelector("#autoAudio");

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    audio.srcObject = stream;
  });

} else {
  alert("getUserMedia() is not supported by your browser");
}

