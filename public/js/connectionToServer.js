import * as users from './users.js';
import * as tally from './tally.js';
import * as sourceManager from './sourceKeeper.js';
import { connection } from './connection.js';
import * as handleConnection from './handleConnection.js';

const programElement = document.getElementById('program')
const previewElement = document.getElementById('preview')
const socket = connection.getSocket();
const sadEmoji = "&#128532";

const ConnectionState = {
   closed: { description: 'Not connected' },
   attempting: { description: 'Attempting to connect' },
   establishing: { description: 'Establishing connection' },
   open: { description: 'connected' }
};

function interpretSource(sourceID, sources) {
   switch (sourceID) {
      case 1:
         return sources['HDMI 1'];
      case 2:
         return sources['HDMI 2'];
      case 3:
         return sources['HDMI 3'];
      case 4:
         return sources['HDMI 4'];
      case 5:
         return sources['SDI 1'];
      case 6:
         return sources['SDI 2'];
      case 7:
         return sources['SDI 3'];
      case 8:
         return sources['SDI 4'];
      default:
         return sadEmoji;
   }
}

function sendData(type, payload) {
   socket.emit(type, payload);
}

socket.on('message', (message) => {
   console.log('Received message:', message)
});

let ClientIDs = [];
socket.on("connected clients", clientIDs => {
   users.updateUserList(clientIDs, socket.id);
   ClientIDs = clientIDs;
});

socket.on('connection', () => {
   handleConnection.setConnected(true);
   console.log('socket connected ', socket.id);
   tally.switcherConnected();
   const element = document.getElementById('my-id')
   if (element) {
      element.innerHTML = socket.id;
   }

   // // Reload page if number of clients and streams don't match
   // setTimeout(() => {
   //    const numberOfStreams = connection.streamEvents.selectAll().length;
   //    if (ClientIDs.length > numberOfStreams) {
   //       socket.emit('reload');
   //    }
   // }, 5000);
});

socket.on('reload', () => {
   location.reload();
})

socket.on('program and preview', ({ program, preview }, sources) => {
   console.log('Receiving program and preview event', { program, preview, sources })

   if (!program || !preview || !sources) {
      console.error("Couldn't get tally from ATEM switcher! Try make a camera switch on ATEM switcher", { program, preview, sources })
      previewElement.innerHTML = "Press Cut on ATEM switcher to get tally";
      programElement.innerHTML = sadEmoji;
      return;
   }

   // Interpret program and preview sources
   program = interpretSource(program, sources);
   preview = interpretSource(preview, sources);

   console.log('Program:', program);
   console.log('Preview:', preview);

   programElement.innerHTML = program;
   previewElement.innerHTML = preview;

   // Show tally status
   const mySource = sourceManager.getMySource();
   if (mySource == program) {
      tally.camOnProgram();
   } else if (mySource == preview) {
      tally.camOnPreview();
   } else {
      tally.camFree();
   }
});

socket.on('connectionStateChange', state => {
   console.log('Atem connection state changed to: ', state.description);
   const stateElement = document.getElementById("atem-switcher-state");
   stateElement.innerHTML = state.description;

   if (state.description == ConnectionState.open.description) {
      tally.switcherConnected();
   } else {
      tally.switcherNotConnected();
   }
})

socket.on('disconnect client', clientId => {
   console.log('client disconnected:', clientId);
});

socket.on('disconnect', event => {
   console.log('socket disconnected:', event);

   const stateElement = document.getElementById("atem-switcher-state");
   stateElement.innerHTML = 'Connection lost';

   tally.switcherNotConnected();
   handleConnection.setConnected(false);
});


export {
   sendData
}