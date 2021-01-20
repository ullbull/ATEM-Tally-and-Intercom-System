import { connection } from './connection.js';
import * as cts from './connectionToServer.js';
import * as talk from './talk.js';
import * as sourceKeeper from './sourceKeeper.js';

// Open or join room
connection.openOrJoin('apa');

// Set mySource from url or
// prompt user to choose source if source is not set
sourceKeeper.setSource();

connection.onMediaError = error => {
   console.error('Media Error: ', error);
   const b = document.createElement('b');
   b.innerHTML = error;
   document.getElementById('error').append(b);
}
