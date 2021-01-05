import * as cts from './connectionToServer.js';

// const selectCameraDiv = document.getElementById('select-camera-div');
const bgColor = document.body.style.backgroundColor;
const programColor = 'rgb(197, 68, 68)';
const previewColor = 'rgb(71, 194, 97)';
const minCamId = 1;
const maxCamId = 20;

// Set this camera
const urlParams = new URLSearchParams(window.location.search);
let camera = urlParams.get('cam');

// Check if camera was set properly
if (camera >= minCamId && camera <= maxCamId) {
   // Remove select-camera-div
   document.getElementById('select-camera-div').remove();
   
   addCameraDiv();
} else {
   console.log('no camera', camera);
}

function addCameraDiv() {
   const container = document.getElementById("main-container");
   const div = document.createElement("div");
   const text = document.createElement("p");
   // div.setAttribute("class", "select-camera");
   // text.setAttribute("class", "select-camera");
   text.setAttribute("id", "camera-id");
   text.innerHTML = `Cam: ${camera}`;
   div.appendChild(text);
   container.insertBefore(div, container.firstChild);
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
   // Change background color
   const x = document.getElementsByClassName('content-container');
   for (let i = 0; i < x.length; i++) {
      x[i].style.backgroundColor = color;
   }
}

export {
   getCameraId,
   camOnProgram,
   camOnPreview,
   camFree
}