import * as users from './users.js';

const socket = io();

function sendData(type, payload) {
   socket.emit(type, payload);
}

socket.on('message', (message) => {
   console.log('Received message:', message);
});

socket.on('ATEM', num => {
   console.log('ATEM:', num);
   program.innerHTML = num;
});

socket.on("connected clients", (clientIDs) => {
   users.updateUserList(clientIDs, socket.id);
});

socket.on('disconnect client', (clientId) => {
   console.log('client disconnected:', clientId);
});

export {
   sendData
}