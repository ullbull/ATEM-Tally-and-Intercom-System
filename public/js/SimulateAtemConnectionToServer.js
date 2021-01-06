import * as camManager from './camManager.js';

const programElement = document.getElementById('program')

const socket = io();

socket.on('simulate ATEM', ({ program, preview }) => {
   console.log('ATEM program:', program);
   console.log('ATEM preview:', preview);
   programElement.innerHTML = program;
   const camID = camManager.getCameraId();
   if (camID == program) {
      camManager.camOnProgram();
   } else if ( camID == preview) {
      camManager.camOnPreview();
   } else {
      camManager.camFree();
   }
});
