import * as users from './users.js';
import * as tally from './tally.js';
import * as sourceManager from './sourceManager.js';
import { connection } from './connection.js';
import * as handleConnection from './handleConnection.js';

const programElement = document.getElementById('program')
const previewElement = document.getElementById('preview')
let connected = false;

function connect() {
   if (!connected) {
      connected = true;
      const socket = connection.getSocket();

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
         document.getElementById('my-id').innerHTML = socket.id;

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

      socket.on('ATEM', ({ program, preview }, sources) => {
         console.log('I got this: ', { program, preview, sources })

         if (!program || !preview || !sources) {
            console.error('This should not happen!', { program, preview, sources })
            // return;
         }

         // Interpret program and preview sources
         program = interpretSource(program, sources);
         preview = interpretSource(preview, sources);

         console.log('ATEM program:', program);
         console.log('ATEM preview:', preview);

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
   }
}

const ConnectionState = {
   closed: { description: 'Not connected' },
   attempting: { description: 'Attempting to connect' },
   establishing: { description: 'Establishing connection' },
   open: { description: 'connected' }
};

function interpretSource(sourceID, sources) {
   if (sourceID == 1) {
      return sources['HDMI 1'];
   } else if (sourceID == 2) {
      return sources['HDMI 2'];
   } else if (sourceID == 3) {
      return sources['HDMI 3'];
   } else if (sourceID == 4) {
      return sources['HDMI 4'];
   } else if (sourceID == 5) {
      return sources['SDI 1'];
   } else if (sourceID == 6) {
      return sources['SDI 2'];
   } else if (sourceID == 7) {
      return sources['SDI 3'];
   } else if (sourceID == 8) {
      return sources['SDI 4'];
   }
}

function sendData(type, payload) {
   socket.emit(type, payload);
}

export {
   connect,
   sendData
}