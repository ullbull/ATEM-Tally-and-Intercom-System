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
   io.on('connection', function (socket) {
      // Send to client
      socket.emit('ATEM', getProgPrev());
      
      socket.on('ATEM get status', () => {
         socket.emit('ATEM', getProgPrev());
      })
   });

   atemSwitcher.on('connectionStateChange', function (state) {
      console.log('state', state);
      io.emit('connectionStateChange', state);
   });
   
   atemSwitcher.on('connectionLost', function () {
      console.log("Connection Lost!")
      io.emit('message', 'Connection to Atem switcher lost!');
   });
   
   atemSwitcher.on('error', function (e) {
      console.log(e)
      io.emit('message', 'Atem switcher error: ' + e);
   });

   atemSwitcher.on('previewBus', previewBus => {
      setPreview(previewBus);

      // Send to all clients
      io.emit('ATEM', getProgPrev());
   });

   atemSwitcher.on('programBus', programBus => {
      setProgram(programBus);

      // Send to all clients
      io.emit('ATEM', getProgPrev());
   });
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