import * as connection from './connection.js';
import * as elementHider from './elementHider.js';

let Connected = false;

function setConnected(connected) {
   Connected = connected;
}

function getConnected() {
   return Connected;
}

async function handleConnection() {
   setInterval(() => {
      fetch('/')
         .then(response => {
            if(getConnected() === false) {
               console.log('Connected to server!');
               setConnected(true);
               elementHider.hideElement('connection-lost');
            }
         })
         .catch(error => {
            if (getConnected() === true) {   
               console.error(`Not connected! `, error);
               setConnected(false);
               elementHider.unhideElement('connection-lost');
            }
         })
   }, 1000);
}

export {
   setConnected,
   getConnected,
   handleConnection
}
