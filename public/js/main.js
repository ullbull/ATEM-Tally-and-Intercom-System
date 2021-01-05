import * as talk from './talk.js';
import * as users from './users.js';
import { connection } from './connection.js';

const roomId = 'apa';
const toggleTalk = document.getElementById('toggle-talk')

// Open or join room
connection.openOrJoin(roomId);

///////////////////////////////////////////////////////


// connection.onExtraDataUpdated = function (event) {
//    console.log('extra:', event);
// };

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
   console.log(`${event.key} up`);
   console.log('connection', connection);


   if (event.key == 'Shift') {
      talk.mute();
   }

   if (event.key == '1') {
      sendData('ATEM', 1);
   }
   if (event.key == '2') {
      sendData('ATEM', 2);
   }
   if (event.key == '3') {
      sendData('ATEM', 3);
   }
      if (event.key == '4') {
      sendData('ATEM', 4);
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

const socket = connection.socket;

function sendData(type, payload) {
   socket.emit(type, payload);
}

socket.on('message', (message) => {
   console.log('Received message:', message);
});

socket.on("connected clients", (clientIDs) => {
   users.updateUserList(clientIDs, socket.id);
});

socket.on('disconnect client', (clientId) => {
   console.log('client disconnected:', clientId);
});