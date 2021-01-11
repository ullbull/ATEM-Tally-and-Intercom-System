import * as users from './users.js';
import * as tally from './tally.js';
import * as sourceManager from './sourceManager.js';
import * as elementHider from './elementHider.js';

const programElement = document.getElementById('program')
const previewElement = document.getElementById('preview')

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

function temporaryFunction(num, sources) {
   if (num == 1) {
      return sources['HDMI 1'];
   } else if (num == 2) {
      return sources['HDMI 2'];
   } else if (num == 3) {
      return sources['HDMI 3'];
   } else if (num == 4) {
      return sources['HDMI 4'];
   } else if (num == 5) {
      return sources['SDI 1'];
   } else if (num == 6) {
      return sources['SDI 2'];
   } else if (num == 7) {
      return sources['SDI 3'];
   } else if (num == 8) {
      return sources['SDI 4'];
   }
}

socket.on('ATEM', ({ program, preview }, sources) => {
   console.log('I got this: ', {program, preview, sources})

   if(!program || !preview || !sources) {
      console.error('This should not happen!', {program, preview, sources})
      return;
   }

   // Get program and preview sources

   program = temporaryFunction(program, sources);
   preview = temporaryFunction(preview, sources);

   console.log('ATEM program:', program);
   console.log('ATEM preview:', preview);
   
   programElement.innerHTML = program;
   previewElement.innerHTML = preview;
   
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