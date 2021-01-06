var Atem = require('atem') // Load the atem module
const fileManager = require('./fileManager.js');

const configFilename = 'atem-config.json';

const config = fileManager.loadFile(configFilename);

const atemSwitcher = new Atem()

// Get ip address for Atem switcher
if (!config.ip) {
   config.ip = '111.111.111.225';
   fileManager.saveFile(config, configFilename);
}
atemSwitcher.ip = config.ip;

// Connect to Atem switcher
atemSwitcher.connect()

atemSwitcher.on('connectionStateChange', function (state) {
   console.log('state', state);
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