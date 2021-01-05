let camera = 0;
const selectCameraDiv = document.getElementById('select-camera-div');
console.log('selectCameraElements', selectCameraDiv);

document.getElementById('select-camera-button').onclick = () => {
   camera = document.getElementById('camera-id').value;
   selectCameraDiv.remove();
   addCameraDiv();
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