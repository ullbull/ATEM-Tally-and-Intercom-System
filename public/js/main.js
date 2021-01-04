import * as talk from './talk.js';
import * as users from './users.js';
import { connection } from './connection.js';

const roomId = 'apa';
const toggleTalk = document.getElementById('toggle-talk')

// Open or join room
connection.openOrJoin(roomId);

///////////////////////////////////////////////////////

// Mute my stream
// setTimeout(function () {
//    const myStream = connection.streamEvents.selectFirst({
//       local: true
//    }).stream;
//    myStream.talk.mute(connection'both');
// }, 1000);


window.onkeydown = event => {
   if (event.shiftKey) {
      talk.unmute(connection);
   }

   if (event.ctrlKey) {
      console.log('ctrlkey down')
   }
}

window.onkeyup = event => {
   console.log(`${event.key} up`);
   console.log('connection', connection);


   if (event.key == 'Shift') {
      talk.mute(connection);
   }
}

window.ontouchstart = event => {
   talk.unmute(connection);
}

window.ontouchend = event => {
   talk.mute(connection);
}

toggleTalk.onclick = event => {
   if (talk.isMuted) {
      talk.unmute(connection);
   }
   else {
      talk.mute(connection);
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