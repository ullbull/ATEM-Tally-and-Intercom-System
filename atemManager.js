const Atem = require('./fakeAtem.js')
// const Atem = require('atem')
const fileManager = require('./fileManager.js');
const keeper = require('./programPreviewKeeper.js');

const defaultIp = '192.168.1.225'

let config = fileManager.loadConfig();

const atemSwitcher = new Atem()

// Get saved ip address
atemSwitcher.ip = config.ip || defaultIp;

// Connect Atem switcher
console.log(`Connecting atem at ${atemSwitcher.ip}`);
atemSwitcher.connect()

function init(io) {
   // When a new client connects
   io.on('connection', socket => {

      // Let client know that it is connected
      socket.emit('connection');

      // Send connection state to client
      socket.emit('connectionStateChange', atemSwitcher.state);

      if (atemSwitcher.state === Atem.ConnectionState.open) {
         // Send to client
         sendProgPrevTo(socket);
      }

      socket.on('setPreview', sourceID => {
         atemSwitcher.setPreview(sourceID);
      })

      socket.on('cut', () => {
         atemSwitcher.cut();
      })

   });

   atemSwitcher.on('connectionStateChange', state => {
      console.log('connection state changed to: ', state.description);
      io.emit('connectionStateChange', state);

      // When atem switcher is connected
      if (atemSwitcher.state === Atem.ConnectionState.open) {
         // Get program and preview from switcher
         let program = undefined;
         let preview = undefined;

         // Store program and preview
         keeper.storeProgPrev(program, preview);

         // Send program and preview to all clients
         sendProgPrevTo(io);
      }
   });

   atemSwitcher.on('connectionLost', () => {
      console.log("Connection Lost!")
      io.emit('connectionStateChange', Atem.ConnectionState.closed);
   });

   atemSwitcher.on('error', e => {
      console.log(e)
      io.emit('message', 'Atem switcher error: ' + e);
   });

   atemSwitcher.on('previewBus', source => {
      console.log('source:', source);
      keeper.storePreview(source);

      // Send to all clients
      sendProgPrevTo(io);
   });

   atemSwitcher.on('programBus', source => {
      console.log('source:', source);
      keeper.storeProgram(source);

      // Send to all clients
      sendProgPrevTo(io);
   });
}

function sendProgPrevTo(socket) {
   socket.emit('program and preview', keeper.getProgPrev(), config.sources);
}

function reconnect() {

   // Reload config file
   config = fileManager.loadConfig();
   console.log('loaded config', config);

   atemSwitcher.disconnect();

   // Get saved ip address
   atemSwitcher.ip = config.ip || defaultIp;
   
   console.log(`Connecting atem at ${atemSwitcher.ip}`);
   atemSwitcher.connect();
}

module.exports = {
   init,
   reconnect
}