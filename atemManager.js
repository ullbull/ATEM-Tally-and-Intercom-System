// const Atem = require('atem')
const simulateAtemSwitcher = require('./simulateAtemSwitcher.js');
const Atem = require('./fakeAtem.js')
const fileManager = require('./fileManager.js');

const defaultIp = '192.168.1.225'

let config = fileManager.loadConfig();

const atemSwitcher = new Atem()

// Get saved ip address
atemSwitcher.ip = config.ip || defaultIp;

// Connect Atem switcher
console.log(`Connecting atem at ${atemSwitcher.ip}`);
atemSwitcher.connect()

console.log('state', atemSwitcher.state);

setTimeout(atemSwitcher.connect, 4000);

function init(io) {
   simulateAtemSwitcher.init(io, atemSwitcher);

   // When a new client connects
   io.on('connection', function (socket) {

      // Let client know that it is connected
      socket.emit('connection');

      // Send connection state to client
      socket.emit('connectionStateChange', atemSwitcher.state);

      if (atemSwitcher.state === Atem.ConnectionState.open) {
         // Send to client
         sendProgPrevTo(socket);
      }
   });

   atemSwitcher.on('connectionStateChange', state => {
      console.log('connection state changed to: ', state.description);
      io.emit('connectionStateChange', state);

      // When atem switcher is connected
      if (atemSwitcher.state === Atem.ConnectionState.open) {
         // Get program and preview from switcher
         let program;
         let preview;

         // Save program and preview
         storeProgram(program);
         storePreview(preview);

         // Send program and preview to all clients
         sendProgPrevTo(io);
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

   atemSwitcher.on('previewBus', source => {
      console.log('incoming previewBus event');
      console.log('source:', source);
      storePreview(source);

      // Send to all clients
      sendProgPrevTo(io);
   });

   atemSwitcher.on('programBus', source => {
      console.log('incoming programBus event');
      console.log('source:', source);
      storeProgram(source);

      // Send to all clients
      sendProgPrevTo(io);
   });
}

function sendProgPrevTo(socket) {
   const progPrev = getProgPrev();
   console.log('sending:', progPrev);
   socket.emit('ATEM', getProgPrev(), config.sources);
}

function reconnect(ip) {
   atemSwitcher.disconnect();
   atemSwitcher.ip = ip;

   // Reload config file
   config = fileManager.loadConfig();

   console.log(`Connecting atem at ${atemSwitcher.ip}`);
   atemSwitcher.connect();
}

///////////////////////////////////////

let Program;
let Preview;

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

function storeProgram(program) {
   Program = program;
}

function storePreview(preview) {
   Preview = preview;
}

module.exports = {
   init,
   reconnect
}