import * as help from './help.js';

const ip = document.getElementById('atem-ip');
const hdmi1 = document.getElementById('atem-hdmi1');
const hdmi2 = document.getElementById('atem-hdmi2');
const hdmi3 = document.getElementById('atem-hdmi3');
const hdmi4 = document.getElementById('atem-hdmi4');
const sdi1 = document.getElementById('atem-sdi1');
const sdi2 = document.getElementById('atem-sdi2');
const sdi3 = document.getElementById('atem-sdi3');
const sdi4 = document.getElementById('atem-sdi4');

help.displayHelp();

fetch('/get-config')
   .then(response => response.json())
   .then(config => {
      console.log(config);
      ip.value = config.ip;
      hdmi1.value = config.sources.source1;
      hdmi2.value = config.sources.source2;
      hdmi3.value = config.sources.source3;
      hdmi4.value = config.sources.source4;
      sdi1.value = config.sources.source5;
      sdi2.value = config.sources.source6;
      sdi3.value = config.sources.source7;
      sdi4.value = config.sources.source8;
   });