import * as tally from './tally.js';
import * as elementHider from './elementHider.js';
import { connection } from './connection.js';

let Connected = false;

function setConnected(connected, message = 'Connection lost!') {
   if (connected == Connected) {
      return;
   }

   Connected = connected;

   if (connected === true) {
      console.log('Connected to server!');
      elementHider.hideElement('connection-lost');
   }
   else {
      console.error(`Not connected! `, error);
      document.getElementById('connection-lost').innerHTML = message
      elementHider.unhideElement('connection-lost');
   }
}

// function getConnected() {
//    return Connected;
// }

// On my phone it took a very long time to receive the error if not connected. That's why I had to do this a bit more complicated
async function checkConnection(interval) {
   setInterval(() => {
      let gotResponse = false;
      fetch('/')
         .then(response => {
            gotResponse = true;
         })
         .catch(error => {
            setConnected(false);
         })

      setTimeout(() => {
         setConnected(gotResponse);
      }, interval/2);

   }, interval);
}

export {
   setConnected,
   // getConnected,
   checkConnection
}
