import { connection } from './connection.js';
import * as api from './api.js';
import * as atemControl from './atemControl.js';
import * as cts from './connectionToServer.js';

cts.connect();

async function buttons() {
   const config = await api.getConfig();
   const sourcesForm = document.getElementById('buttons');

   for (const key in config.sources) {
      if (Object.hasOwnProperty.call(config.sources, key)) {
         const value = config.sources[key];

         const button = document.createElement('button');
         if (value == '') {
            button.innerHTML = '-';
         } else {
            button.innerHTML = `${value}`;
         }
         button.setAttribute('id', key);
         button.setAttribute('name', 'button');
         button.setAttribute('class', 'control-container');
         button.setAttribute('style', 'height: 100px; width: 100px');

         // sourcesForm.appendChild(button);
         sourcesForm.append(button);
      }
   }

   const cutButton = document.createElement('button');
   cutButton.innerHTML = 'Cut';
   cutButton.setAttribute('id', 'button-cut');
   cutButton.setAttribute('class', 'control-container');
   document.getElementById("cut").append(cutButton);

   const which = 48;

   document.getElementById('HDMI 1').onclick = () => {
      cts.sendData('setPreview', 1);
   }
   document.getElementById('HDMI 2').onclick = () => {
      cts.sendData('setPreview', 2);
   }
   document.getElementById('HDMI 3').onclick = () => {
      cts.sendData('setPreview', 3);
   }
   document.getElementById('HDMI 4').onclick = () => {
      cts.sendData('setPreview', 4);
   }
   document.getElementById('SDI 1').onclick = () => {
      cts.sendData('setPreview', 5);
   }
   document.getElementById('SDI 2').onclick = () => {
      cts.sendData('setPreview', 6);
   }
   document.getElementById('SDI 3').onclick = () => {
      cts.sendData('setPreview', 7);
   }
   document.getElementById('SDI 4').onclick = () => {
      cts.sendData('setPreview', 8);
   }

   document.getElementById('button-cut').onclick = () => {
      cts.sendData('cut');
   }


   // document.getElementById('HDMI 1').onclick = cts.sendData('setPreview', 1);
   // document.getElementById('HDMI 2').onclick = cts.sendData('setPreview', 2);
   // document.getElementById('HDMI 3').onclick = cts.sendData('setPreview', 3);
   // document.getElementById('HDMI 4').onclick = cts.sendData('setPreview', 4);
   // document.getElementById('SDI 1').onclick = cts.sendData('setPreview', 5);
   // document.getElementById('SDI 2').onclick = cts.sendData('setPreview', 6);
   // document.getElementById('SDI 3').onclick = cts.sendData('setPreview', 7);
   // document.getElementById('SDI 4').onclick = cts.sendData('setPreview', 8);

   // document.getElementById('button-cut').onclick = cts.sendData('cut');
}

buttons();

window.onkeyup = event => {
   atemControl.keyUp(event);

   console.log(`${event.key} up`);
   console.log('event', event);
}

