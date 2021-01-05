import * as cts from './connectionToServer.js';

let camera = 0;
const selectCameraDiv = document.getElementById('select-camera-div');
console.log('selectCameraElements', selectCameraDiv);
const bgColor = document.body.style.backgroundColor;
const programColor = 'rgb(197, 68, 68)';
const previewColor = 'rgb(71, 194, 97)';

document.getElementById('select-camera-button').onclick = () => {
   camera = document.getElementById('camera-id').value;
   selectCameraDiv.remove();
   addCameraDiv();

   // Get ATEM status
   cts.sendData('ATEM get status');
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