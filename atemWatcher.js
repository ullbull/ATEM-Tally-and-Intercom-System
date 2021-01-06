var Atem = require('atem') // Load the atem module
const fileManager = require('./fileManager.js');

const config = fileManager.loadConfig();

const atemSwitcher = new Atem()

// Get ip address for Atem switcher
if (!config.ip) {
   config.ip = '192.168.1.225';
   fileManager.saveConfig(config);
}
atemSwitcher.ip = config.ip;

// Connect to Atem switcher
console.log(`Connecting to atem at ${atemSwitcher.ip}`);
atemSwitcher.connect()
console.log('state', atemSwitcher.state);

setTimeout(atemSwitcher.connect, 4000);

atemSwitcher.on('connectionStateChange', function (state) {
   console.log('state', state);
});

atemSwitcher.on('connectionLost', function () {
   console.log("Connection Lost!")
});

atemSwitcher.on('error', function (e) {
   console.log(e)
});


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
   setProgram,
   setPreview,
   getProgPrev,
   getProgram,
   getPreview
}