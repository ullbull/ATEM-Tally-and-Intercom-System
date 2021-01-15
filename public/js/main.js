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

// handleConnection.checkConnection(3000);

connection.onMediaError = function (error) {
   console.error('Media Error: ', error);
   const b = document.createElement('b');
   b.innerHTML = error;
   document.getElementById('error').append(b);
}

window.onkeydown = event => {
   if (event.shiftKey) {
      talk.unmuteMyStream();
   }
}

window.onkeyup = event => {
   if (event.key == 'Shift') {
      talk.muteMyStream();
   }
}

window.ontouchstart = event => {
   talk.unmuteMyStream();
}

window.ontouchend = event => {
   talk.muteMyStream();
}

toggleTalk.onclick = event => {
   if (talk.getMyStream().isMuted) {
      talk.unmuteMyStream();
      // location.href='?mic-on=1';
   }
   else {
      talk.muteMyStream();
      // location.href='/';
   }
}
