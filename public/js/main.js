import * as talk from './talk.js';
import { connection } from './connection.js';
import * as sourceManager from './sourceManager.js';
import * as cts from './connectionToServer.js';
import * as handleConnection from './handleConnection.js';

const roomId = 'apa';
const toggleTalk = document.getElementById('toggle-talk')

sourceManager.getSource();

// Open or join room
connection.openOrJoin(roomId);

handleConnection.handleConnection();

connection.onMediaError = function(error) {
   console.error('Media Error: ', error);
   const b = document.createElement('b');
   b.innerHTML = error;
   document.getElementById('error').append(b);
}

window.onkeydown = event => {

   if (event.shiftKey) {
      talk.unmute();
      // connection.extra.isMuted = talk.isMuted;
   }

   if (event.ctrlKey) {
      console.log('ctrlkey down')
   }
}

window.onkeyup = event => {

   console.log(`${event.key} up`);
   console.log('event', event);

   if (event.key == 'Shift') {
      talk.mute();
   }
}

window.ontouchstart = event => {
   talk.unmute();
}

window.ontouchend = event => {
   talk.mute();
}

toggleTalk.onclick = event => {
   if (talk.isMuted) {
      talk.unmute();
   }
   else {
      talk.mute();
   }
}
