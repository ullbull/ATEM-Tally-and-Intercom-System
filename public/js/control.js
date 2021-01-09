import * as api from './api.js';
import * as simulateAtemControl from './simulateAtemControl.js';

window.onkeyup = event => {
   simulateAtemControl.keyUp(event);

   console.log(`${event.key} up`);
   console.log('event', event);

   if (event.key == 'Shift') {
      talk.mute();
   }
}
