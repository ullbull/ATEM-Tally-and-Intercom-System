const bgColor = document.body.style.backgroundColor;
const programColor = 'rgb(197, 68, 68)';
const previewColor = 'rgb(71, 194, 97)';
const minCamId = 1;
const maxCamId = 20;

// Set this camera
const urlParams = new URLSearchParams(window.location.search);
let camera = urlParams.get('cam');

// Validate camera value
if (camera >= minCamId && camera <= maxCamId) {
   // Camera value is approved!
   // Remove select-camera-div
   document.getElementById('select-camera-div').remove();

   // Set camera to string
   camera = 'cam ' + camera;

   addCameraDiv();
} else {
   console.log('no camera', camera);
}

function addCameraDiv() {
   // const container = document.getElementById("main-container");
   const div = document.getElementById("tally-div");
   // const div = document.createElement("div");
   const camID = document.createElement("p");
   // div.setAttribute("class", "tally-for");
   camID.setAttribute("class", "tally-for");
   camID.setAttribute("id", "camera-id");
   camID.innerHTML = camera;
   div.appendChild(camID);
   // container.insertBefore(div, container.firstChild);
}

function getCameraId() {
   return camera;
}

function camOnProgram() {
   changeColorTo(programColor);
}

function camOnPreview() {
   changeColorTo(previewColor);
}

function camFree() {
   changeColorTo(bgColor);
}

function changeColorTo(color) {
   // const x = document.getElementsByClassName('content-container');
   // for (let i = 0; i < x.length; i++) {
   //    x[i].style.backgroundColor = color;
   // }

   // Change background color
   document.body.style.backgroundColor = color;
}

export {
   getCameraId,
   camOnProgram,
   camOnPreview,
   camFree
}