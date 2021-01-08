import * as users from './users.js';
import * as tally from './tally.js';
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
   console.log('socket connected ', socket.id);
});

socket.on('ATEM', ({ program, preview }, sources) => {

   if(!program || !preview || !sources) {
      console.error('This should not happen!', {program, preview, sources})
      return;
   }

   // Get program and preview sources
   program = sources['source'+program];
   preview = sources['source'+preview];

   console.log('ATEM program:', program);
   console.log('ATEM preview:', preview);
   
   programElement.innerHTML = program;
   
   // Show tally status
   const mySource = sourceManager.getMySource();
   if (mySource == program) {
      tally.camOnProgram();
   } else if ( mySource == preview) {
      tally.camOnPreview();
   } else {
      tally.camFree();
   }
});

socket.on('connectionStateChange', state => {
   console.log('Atem connection state changed to: ', state.description);
   const stateElement = document.getElementById("atem-switcher-state");
   stateElement.innerHTML = state.description;
})

socket.on('disconnect client', clientId => {
   console.log('client disconnected:', clientId);
});

export {
   sendData
}