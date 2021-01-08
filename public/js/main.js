import * as talk from './talk.js';
import { connection } from './connection.js';
import * as simulateAtemControl from './simulateAtemControl.js';
import * as elementHider from './elementHider.js';

const roomId = 'apa';
const toggleTalk = document.getElementById('toggle-talk')

// Open or join room
connection.openOrJoin(roomId);

///////////////////////////////////////////////////////

// Mute my stream
// setTimeout(function () {
//    // const myStream = connection.streamEvents.selectFirst({
//    //    local: true
//    // }).stream;
//    // myStream.mute('both');
//    talk.mute(connection);
// }, 100);

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
   // simulateAtemControl.keyUp(event);

   elementHider.toggleHide("main-container");

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
