import * as users from './users.js';
import * as atemManager from './atemManager.js';
import * as sourceManager from './sourceManager.js';
import * as elementHider from './elementHider.js';

const programElement = document.getElementById('program')

const socket = io();

function sendData(type, payload) {
   socket.emit(type, payload);
}

socket.on('message', (message) => {
   console.log('Received message:', message)
});

socket.on("connected clients", clientIDs => {
   users.updateUserList(clientIDs, socket.id);
});

socket.on('connection', () => {
   // Prompt user to choose source if source is not set
   if (!sourceManager.getMySource()) {
      sourceManager.promptUserForSource();
   } else {
      // Source is already set.
      // Hide prompt element
      elementHider.hideElement("prompt");
   }
});

socket.on('ATEM', ({ program, preview }, cam_config) => {
   program = cam_config['source'+program];
   preview = cam_config['source'+preview];
   console.log('ATEM program:', program);
   console.log('ATEM preview:', preview);
   programElement.innerHTML = program;
   const mySource = sourceManager.getMySource();
   if (mySource == program) {
      atemManager.camOnProgram();
   } else if ( mySource == preview) {
      atemManager.camOnPreview();
   } else {
      atemManager.camFree();
   }
});

socket.on('connectionStateChange', state => {
   const stateElement = document.getElementById("atem-switcher-state");
   stateElement.innerHTML = state.description;
})

socket.on('disconnect client', clientId => {
   console.log('client disconnected:', clientId);
});

export {
   sendData
}