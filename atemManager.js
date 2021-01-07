var Atem = require('atem') // Load the atem module
const fileManager = require('./fileManager.js');

const defaultIp = '192.168.1.225'

const atemSwitcher = new Atem()

// Get saved ip address
atemSwitcher.ip = fileManager.loadConfig().ip || defaultIp;

// Connect Atem switcher
console.log(`Connecting atem at ${atemSwitcher.ip}`);
atemSwitcher.connect()

console.log('state', atemSwitcher.state);

setTimeout(atemSwitcher.connect, 4000);


function init(io) {
   // When a new client connects
   io.on('connection', function (socket) {

      if (atemSwitcher.state === Atem.ConnectionState.open) {
         // Send to client
         socket.emit('ATEM', getProgPrev());
      }
   });

   atemSwitcher.on('connectionStateChange', state => {
      console.log('state', state);
      io.emit('connectionStateChange', state);

      // When atem switcher is connected
      if (atemSwitcher.state === Atem.ConnectionState.open) {
         // Get program and preview from switcher
         const program = 0;
         const preview = 0;

         // Save program and preview
         setProgram(program);
         setPreview(preview);

         // Send program and preview to all clients
         io.emit('ATEM', getProgPrev());
      }
   });

   atemSwitcher.on('connectionLost', () => {
      console.log("Connection Lost!")
      io.emit('message', 'Connection to Atem switcher lost!');
   });

   atemSwitcher.on('error', e => {
      console.log(e)
      io.emit('message', 'Atem switcher error: ' + e);
   });

   atemSwitcher.on('sourceTally', (source, state) => {
      console.log('incoming sourceTally event');
      console.log('source:', source);
      console.log('state:', state);

      if (state.program) {
         setProgram(source);
      }
      if (state.preview) {
         setPreview(source);
      }

      // Send to all clients
      io.emit('ATEM', getProgPrev());
   })

   // atemSwitcher.on('previewBus', previewBus => {
   //    setPreview(previewBus);

   //    // Send to all clients
   //    io.emit('ATEM', getProgPrev());
   // });

   // atemSwitcher.on('programBus', programBus => {
   //    setProgram(programBus);

   //    // Send to all clients
   //    io.emit('ATEM', getProgPrev());
   // });


}

function reconnect(ip) {
   atemSwitcher.disconnect();
   atemSwitcher.ip = ip;
   console.log(`Connecting atem at ${atemSwitcher.ip}`);
   atemSwitcher.connect();
}

///////////////////////////////////////

let Program = 0;
let Preview = 0;

function getProgram() {
   return Program;
}

function getPreview() {
   return Preview;
}

function getProgPrev() {
   return {
      program: getProgram(),
      preview: getPreview()
   }
}

function setProgram(program) {
   Program = program;
}

function setPreview(preview) {
   Preview = preview;
}

module.exports = {
   init,
   reconnect
}