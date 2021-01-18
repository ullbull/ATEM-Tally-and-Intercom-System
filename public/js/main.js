import { connection } from './connection.js';
import * as cts from './connectionToServer.js';
import * as talk from './talk.js';
import * as sourceManager from './sourceManager.js';

const roomId = 'apa';

// Set mySource from url or
// prompt user to choose source if source is not set
sourceManager.getSource();

// Open or join room
connection.openOrJoin(roomId);

connection.onMediaError = error => {
   console.error('Media Error: ', error);
   const b = document.createElement('b');
   b.innerHTML = error;
   document.getElementById('error').append(b);
}

// Connect to server
cts.connect();
