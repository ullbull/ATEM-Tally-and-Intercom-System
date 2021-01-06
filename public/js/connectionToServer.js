import * as users from './users.js';
import * as camManager from './camManager.js';

const programElement = document.getElementById('program')

const socket = io();

function sendData(type, payload) {
   socket.emit(type, payload);
}

socket.on('message', (message) => {
   console.log('Received message:', message);
});

socket.on("connected clients", clientIDs => {
   users.updateUserList(clientIDs, socket.id);
});

socket.on('ATEM', ({ program, preview }) => {
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

socket.on('disconnect client', clientId => {
   console.log('client disconnected:', clientId);
});

export {
   sendData
}